const axios = require('axios');
const cheerio = require('cheerio');
const e = require('express');
const qs = require('qs');
const cookie = require('cookie');
const SOLD_OUT = { "error": true, "msg": "FNF" }
const ERROR = { "error": true, "msg": "<ERROR_MESSAGE>" }
const fs = require('fs');
const {cache} = require ("../job/getCookie.js")
async function one_way_process(req) {
    const searchForm = await create_search_form(req);
    if (searchForm.length == 0) {
        return SOLD_OUT;
    } else {
        return get_session_id(searchForm)
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
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
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
async function get_session_id(searchForms) {
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
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Referer': 'https://bookingportal.china-airlines.com/',
            'Sec-Fetch-Dest': 'document',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        },
        data: data
    };
    const searchResponse = await fetchData(config);
    const setCookieHeader = searchResponse.headers.get('set-cookie');
    let cookieString = '';
    setCookieHeader.forEach((cookieHeader) => {
        if (cookieString === ''){
            cookieString = cookieHeader;
        }else{
            cookieString+= ';'+cookieHeader;
        }
    })
    let sessionId = await getCookieVariable(cookieString,'JSESSIONID')
    fs.writeFile("response", searchResponse.data, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return;
        }
      
        console.log('Data written to file successfully.');
      });
    console.log(sessionId)
    // return sessionId === null ? '' : sessionId.slice(0,sessionId.lastIndexOf('.'));
    const pattern = /{"siteConfiguration"\s*:\s*{[^]*}}}/g;
    const cleanedData = searchResponse.data.replace(/\r?\n|\r/g, '');
    const matches = cleanedData.match(pattern);
    const jsonObject = JSON.parse(matches);
    if(sessionId === '' || jsonObject === null || jsonObject.pageDefinitionConfig.pageData.business.Availability.cube === undefined){
        return SOLD_OUT;
    }
    const listBounds = jsonObject.pageDefinitionConfig.pageData.business.Availability.cube.bounds
    const availabilityFlight = new Map();
    listBounds.forEach(bound => {
        const fareFamilyList = bound.fareFamilyList
        fareFamilyList.forEach(fare => {
            let count = 0;
            while(fare.flights[count] !== undefined){
                const flight = fare.flights[count];
                let recommendationsIndex = flight.recommendationsIndex;
                recommendationsIndex.forEach( index => {
                    if (availabilityFlight.has(flight.flight.flightId)) {
                        availabilityFlight.get(flight.flight.flightId).push(index);
                      } else {
                        availabilityFlight.set(flight.flight.flightId, [index]);
                      }
                })
                count++;
            }
        })
    })
    let resultS ='';
    availabilityFlight.forEach((value,key) => {
        value.forEach( i => resultS += ';'+key+i)
    })
    return resultS;
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
module.exports = one_way_process;