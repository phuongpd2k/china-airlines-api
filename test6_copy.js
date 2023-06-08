const fs = require('fs');
const filePath = './html';
const Flight = require('./model/flight.js');
const BookingClass = require('./model/booking_class.js');
const moment = require('moment');
const dpt = new Array();
const rtn = new Array();
const dptMap = new Map();
const rtnMap = new Map();
// Read the file asynchronously
fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    // const pattern = /{"siteConfiguration"\s*:\s*{[^]*}}}/g;
    // const matches = data.match(pattern);
    const jsonObject = JSON.parse(data);
    if (jsonObject === null) {
        console.log('jsonObject null')
        return SOLD_OUT;
    }
    const res = new Array();
    const availability = jsonObject.pageDefinitionConfig.pageData.business.Availability;
    const recommendationList = availability.recommendationList;
    const proposedBounds = availability.proposedBounds;
    const dptFlights = proposedBounds[0].proposedFlightsGroup;
    for (flightIndex in dptFlights) {
        const flightObject = new Flight();
        const recomend = recommendationList.find(recommendation => recommendation.bounds[0].flightGroupList.find(flight => flight.flightId === dptFlights[flightIndex].proposedBoundId))
        // console.log(recomend.bounds[0].travellerPrices)
        const flight = recomend.bounds[0].flightGroupList.find(flight => flight.flightId === dptFlights[flightIndex].proposedBoundId);
        const dptSegments = dptFlights[flightIndex].segments;
        if(dptSegments.length>2) continue;
        if(flight === undefined || flight ===null) continue;
        const bookingClass = CLASS_MAP.get(flight.rbd);
        // console.log(bookingClass)
        const dptTravellerPrices = {
            ADT: recomend.bounds[0].travellerPrices.ADT,
            CHD: recomend.bounds[0].travellerPrices.CHD,
            INF: recomend.bounds[0].travellerPrices.INF
        }
        
        let dptDepartDateTime = null;
            let dptArrivalDateTime = null;
            let dptTransitDepartDateTime = null;
            let dptTransitArrivalDateTime = null;
            let dptDepartTerminal = null;
            let dptArrivalTerminal = null;
            let dptTransitDepartTerminal = null;
            let dptTransitArrivalTerminal = null;
        if (dptSegments.length <= 2) {
            // if (!dptFlightMap.has('' + flightObject._flightCode + flightObject._transitFlightCode)) {
            if (dptSegments.length == 2) {
                dptDepartDateTime = moment(dptSegments[0].beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                dptArrivalDateTime = moment(dptSegments[1].endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                dptTransitDepartDateTime = moment(dptSegments[1].beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                dptTransitArrivalDateTime = moment(dptSegments[0].endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                dptDepartTerminal = dptSegments[0].beginTerminal;
                dptArrivalTerminal = dptSegments[1].endTerminal;
                dptTransitDepartTerminal = dptSegments[1].beginTerminal;
                dptTransitArrivalTerminal = dptSegments[0].endTerminal;
            }
        }
        dptSegments.forEach(segment => {
            if (segment.endLocation.locationCode !== 'SIN') {
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
                flightObject.aircraftName = segment.equipment.name;
                flightObject.aircraftIata = segment.equipment.code;
                let match = segment.equipment.name.match(/ [^]*-/g)
                if (match !== null) {
                    flightObject.aircraftIcao = match[0].slice(1, -1);
                } else {
                    match = segment.equipment.name.match(/ [^]*/g);
                    if (match !== null) {
                        flightObject.aircraftIcao = match[0].slice(1);
                    }
                }
                flightObject.priceAdult = (dptTravellerPrices.ADT === undefined) ? 0 : dptTravellerPrices.ADT;
                flightObject.priceChild = (dptTravellerPrices.CHD === undefined) ? 0 : dptTravellerPrices.CHD;
                flightObject.priceInfant = (dptTravellerPrices.INF === undefined) ? 0 : dptTravellerPrices.INF;
            } else {
                flightObject.type = 'transit'
                flightObject.transitFlightCode = segment.airline.code + segment.flightNumber;
                flightObject.transitDepartTerminal = dptTransitDepartTerminal
                flightObject.transitArrivalTerminal = dptTransitArrivalTerminal
                flightObject.departTerminal = dptDepartTerminal;
                flightObject.arrivalTerminal = dptArrivalTerminal;
                flightObject.transitAirport = segment.beginLocation.locationCode;
                flightObject.departDateTime = dptDepartDateTime;
                flightObject.arrivalDateTime = dptArrivalDateTime
                flightObject.transitDepartDateTime = dptTransitDepartDateTime
                flightObject.transitArrivalDateTime = dptTransitArrivalDateTime
            }
        });
        if (!dptMap.has('' + flightObject._flightCode + flightObject._transitFlightCode)) {
            res.push(flightObject.toJson())
            dptMap.set('' + flightObject._flightCode + flightObject._transitFlightCode)
        }
    }

    res.forEach(flight => {
        console.log(flight)
    })
    console.log(res.length)




    //     const basefacts = jsonObject.pageDefinitionConfig.pageData.basefacts

    //     console.log('Language=',basefacts['request.LANGUAGE'])
    //     console.log('Country_Site=',basefacts['request.COUNTRY_SITE'])
    //     console.log('Site=',basefacts['request.SITE'])
    //     console.log('Booking_Flow',basefacts['request.BOOKING_FLOW'])
    //     console.log('Trip_Flow',basefacts['request.TRIP_FLOW'])
    //     console.log('External_Id=',basefacts['request.EXTERNAL_ID'])
    //     console.log('Office_Id=',basefacts['request.OFFICE_ID'])
    //     console.log('Trip_Type=',basefacts['request.TRIP_TYPE'])
    //     console.log('Pricing_Type= ',basefacts['request.PRICING_TYPE'])
    //     console.log('RECOMMENDATION_ID_1')
    //     console.log('FLIGHT_ID_1')
    //     console.log('IS_MILES_MODE=', jsonObject.pageDefinitionConfig.pageData.business.Price.isMilesMode)
    //     console.log('PAGE_TICKET=', jsonObject.pageDefinitionConfig.pageData.pageTicket)

});

function waitFor(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function get_flight_info(flightId, rbd, availability) {
    const flightObject = new Flight();

    console.log(`flight_id: ${flightId} and class_code: ${rbd}`)
    const currentBookingCode = CLASS_MAP.get(rbd)

    console.log('currentBookingCode: ' + currentBookingCode.cabinClass)
    let founded = false;
    for (index in availability.recommendationList) {
        const recomend = availability.recommendationList[index]
        console.log(`compare ffCode=${recomend.ffCode} and currentBookingCode: ${currentBookingCode.ffCode}`)
        if (recomend.ffCode === currentBookingCode.ffCode) {
            console.log("map success")
            flightObject.class = rbd
            flightObject.bookingClass = rbd
            flightObject.cabinClass = currentBookingCode.cabinClass;
            founded = true;
            break;
        }
        // console.log(recomend)
    }
    if (founded)
        return flightObject;
}
const ecoBasic = new BookingClass('VNSHECB', 'ECO Basic');
const ecoStandard = new BookingClass('VNSHECS', 'ECO Standard');
const ecoFlex = new BookingClass('VNSHECF', 'ECO Flex ');
const businessBasic = new BookingClass('VNSHBZB', 'Business Basic');
const businessStandard = new BookingClass('VNSHBZS', 'Business Standard');
const businessFlex = new BookingClass('VNSHBZF', 'Business Flex');
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
/// VNSHECB: ECO Basic - R/Q/H/N
/// VNSHBZF: Business Flex - J
/// VNSHBZB: Business Basic - D
/// VNSHBZS: Business Standard - C
/// VNSHECS: ECO Standard - K/V/T
/// VNSHECF: ECO Flex - Y/B/M


