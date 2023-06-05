const axios = require('axios');
const cheerio = require('cheerio');
const e = require('express');
const qs = require('qs');
const moment = require('moment');
const Flight = require('../model/flight.js');
const BookingClass = require('../model/booking_class.js');
const cookie = require('cookie');
const SOLD_OUT = { "error": true, "msg": "FNF" }
const ERROR = { "error": true, "msg": "<ERROR_MESSAGE>" }
const fs = require('fs');
const { cache } = require("./set_cookie.js")
async function one_way_process(req) {
    const searchForm = await create_search_form(req);
    if (searchForm.length == 0) {
        return SOLD_OUT;
    } else {
        return await get_flight_info(req, searchForm);
    }

}
async function create_search_form(req) {
    /**
   {"origin": "LGK",
    "dest": "KUL",
    "adult": 2,
    "child": 0,
    "infant": 0,
    "dptDate": "2021-09-29"
   }
   */
    //CABIN: Y = Economy
    const body = req.body;
    const convertedDate = body.dptDate.split("-").join("") + '0000';
    let data = `B_LOCATION_1=${body.origin}&E_LOCATION_1=${body.dest}&B_DATE_1=${convertedDate}&ADULTS=${body.adult}&CHILDS=${body.child}&INFANTS=${body.infant}&LANG=GB&CABIN=Y&TRIP_TYPE=O&Channel=IOS&EBA=GB`;
    let cookie = cache.getData('memCookie');
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://bookingportal.china-airlines.com/eRetailPortal/Mobile.svc/Mobile/Search',
        headers: {
            'Host': 'bookingportal.china-airlines.com',
            'Sec-Fetch-Site': 'none',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'Sec-Fetch-Mode': 'navigate',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Origin': 'null',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
            'Sec-Fetch-Dest': 'document',
            'Content-Type': 'text/plain',
            'Cookie': cookie
        },
        data: data
    };
    const searchResponse = await fetchData(config);
    const $ = cheerio.load(searchResponse.data);
    const inputElements = $('input');
    const inputData = [];
    inputElements.each((index, element) => {
        const name = $(element).attr('name');
        const value = $(element).val();
        inputData.push({ name, value });
        inputData.push({ name, value });
    });
    return inputData;
}
async function get_flight_info(req, searchForms) {
    // let data = qs.stringify({
    //   'EMBEDDED_TRANSACTION': '',
    //   'ENC': '',
    //   'ENCT': '',
    //   'SITE': '',
    //   'LANGUAGE': '' 
    // });
    const searchData = {};
    searchForms.forEach(element => {
        searchData[element.name] = element.value;
    });
    const data = qs.stringify(searchData)
    let cookie = cache.getData('memCookie')
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://book.china-airlines.com/plnext/FPChinaAirlines/Override.action',
        headers: {
            'Host': 'book.china-airlines.com',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Sec-Fetch-Site': 'same-site',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'Sec-Fetch-Mode': 'navigate',
            'Origin': 'https://bookingportal.china-airlines.com',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
            'Referer': 'https://bookingportal.china-airlines.com/',
            'Sec-Fetch-Dest': 'document',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        },
        data: data
    };
    if (cookie !== undefined && cookie !== null) {
        console.log("has cookie")
    }
    const searchResponse = await fetchData(config);
    const setCookieHeader = searchResponse.headers.get('set-cookie');
    let cookieString = '';
    setCookieHeader.forEach((cookieHeader) => {
        if (cookieString === '') {
            cookieString = cookieHeader;
        } else {
            cookieString += ';' + cookieHeader;
        }
    })
    let sessionId = await getCookieVariable(cookieString, 'JSESSIONID')
    // return sessionId === null ? '' : sessionId.slice(0,sessionId.lastIndexOf('.'));
    const pattern = /{"siteConfiguration"\s*:\s*{[^]*}}}/g;
    const cleanedData = searchResponse.data.replace(/\r?\n|\r/g, '');
    const matches = cleanedData.match(pattern);
    const jsonObject = JSON.parse(matches);
    if (jsonObject === null) {
        console.log('jsonObject null')
        return SOLD_OUT;
    }
    const availability = jsonObject.pageDefinitionConfig.pageData.business.Availability;
    if (sessionId === null || jsonObject === null || availability === undefined) {
        console.log('Cookie expried')
        return SOLD_OUT;
    }
    const res = new Array();
    const recommendationList = availability.recommendationList;
    const currentFlightMap = new Map();
    for (index in recommendationList) {
        const recomend = recommendationList[index]
        const bounds = recomend.bounds[0];
        const travellerPrices = {
            ADT: bounds.travellerPrices.ADT,
            CHD: bounds.travellerPrices.CHD,
            INF: bounds.travellerPrices.INF

        }
        // for (flightIndex in bounds.flightGroupList) {
        const flightObject = new Flight();
        const flight = bounds.flightGroupList[0];

        const bookingClass = CLASS_MAP.get(flight.rbd)

        const segments = availability.proposedBounds[0].proposedFlightsGroup[flight.flightId].segments
        // console.log(segments)
        let departDateTime = null;
        let arrivalDateTime = null;
        let transitDepartDateTime = null;
        let transitArrivalDateTime = null;
        if (segments.length > 2) return;
        if (segments.length == 2) {
            departDateTime = moment(segments[0].beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
            arrivalDateTime = moment(segments[1].endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
            transitDepartDateTime = moment(segments[0].endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
            transitArrivalDateTime = moment(segments[1].beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
        }
        segments.forEach((segment) => {

            if (segment.endLocation.locationCode != req.body.dest) {
                flightObject.flightCode = segment.airline.code + segment.flightNumber;
                flightObject.type = 'direct'
                flightObject.departTerminal = segment.beginTerminal;
                flightObject.departDateTime = moment(segment.beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                flightObject.arrivalTerminal = segment.endTerminal;
                flightObject.arrivalDateTime = moment(segment.endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                flightObject.cabinClass = bookingClass._cabinClass;
                flightObject.bookingClass = flight.rbd;
                flightObject.class = flight.rbd;
                flightObject.currency = availability.currencyBean.code;
                flightObject.priceAdult = (travellerPrices.ADT === undefined) ? 0 : travellerPrices.ADT;
                flightObject.priceChild = (travellerPrices.CHD === undefined) ? 0 : travellerPrices.CHD;
                flightObject.priceInfant = (travellerPrices.INF === undefined) ? 0 : travellerPrices.INF;
            } else {
                flightObject.type = 'transit'
                flightObject.transitFlightCode = segment.airline.code + segment.flightNumber;
                flightObject.transitDepartTerminal = segment.beginTerminal;
                flightObject.transitArrivalTerminal = segment.endTerminal;
                flightObject.transitAirport = segment.beginLocation.locationCode
                flightObject.departDateTime = departDateTime;
                flightObject.arrivalDateTime = arrivalDateTime
                flightObject.transitDepartDateTime = transitDepartDateTime
                flightObject.transitArrivalDateTime = transitArrivalDateTime
            }
        })
        if(currentFlightMap.has(bookingClass._classType)){
            continue;
        }else{
            currentFlightMap.set(''+flightObject._flightCode+flightObject._transitFlightCode,res.length);
        }
        res.push(flightObject.toJson())
        // }
    }
    return res;
}

function fetchData(config) {
    return axios.request(config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error;
        });
}
async function getCookieVariable(cookieString, variableName) {
    const cookies = cookie.parse(cookieString);

    if (cookies && cookies[variableName]) {
        return cookies[variableName];
    } else {
        return null;
    }
}
const ecoBasic = new BookingClass('VNSHECB', 'ECO Basic','ECO');
const ecoStandard = new BookingClass('VNSHECS', 'ECO Standard','ECO');
const ecoFlex = new BookingClass('VNSHECF', 'ECO Flex ','ECO');
const businessBasic = new BookingClass('VNSHBZB', 'Business Basic','BIZ');
const businessStandard = new BookingClass('VNSHBZS', 'Business Standard','BIZ');
const businessFlex = new BookingClass('VNSHBZF', 'Business Flex','BIZ');
const CLASS_MAP = new Map([
    { key: 'N', value: ecoBasic },
    { key: 'Q', value: ecoBasic },
    { key: 'H', value: ecoBasic },
    { key: 'R', value: ecoBasic },
    { key: 'K', value: ecoStandard },
    { key: 'V', value: ecoStandard },
    { key: 'T', value: ecoStandard },
    { key: 'Y', value: ecoFlex },
    { key: 'B', value: ecoFlex },
    { key: 'M', value: ecoFlex },
    { key: 'D', value: businessBasic },
    { key: 'C', value: businessStandard },
    { key: 'J', value: businessFlex },
].map(obj => [obj.key, obj.value]));
module.exports = one_way_process;


/// VNSHECB: ECO Basic - R/Q/H/N
/// VNSHBZF: Business Flex - J
/// VNSHBZB: Business Basic - D
/// VNSHBZS: Business Standard - C
/// VNSHECS: ECO Standard - K/V/T
/// VNSHECF: ECO Flex - Y/B/M
/// ECO Discount L