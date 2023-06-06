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
    const pattern = /{"siteConfiguration"\s*:\s*{[^]*}}}/g;
    const matches = data.match(pattern);
    const jsonObject = JSON.parse(matches);
    const availability = jsonObject.pageDefinitionConfig.pageData.business.Availability;

    const recommendationList = availability.recommendationList;
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

            const dptSegments = availability.proposedBounds[0].proposedFlightsGroup[flight.flightId].segments
            const rtnSegments = availability.proposedBounds[1].proposedFlightsGroup[flight.flightId].segments
            // console.log(segments)
            if (dptSegments.length > 2) return;
            let dptDepartDateTime = null;
            let dptArrivalDateTime = null;
            let dptTransitDepartDateTime = null;
            let dptTransitArrivalDateTime = null;
            if (dptSegments.length== 2) {
                dptDepartDateTime = moment(dptSegments[0].beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                dptArrivalDateTime = moment(dptSegments[1].endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                dptTransitDepartDateTime = moment(dptSegments[0].endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                dptTransitArrivalDateTime = moment(dptSegments[1].beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
            }
            dptSegments.forEach((segment) => {
                if (segment.endLocation.locationCode != 'SIN') {
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
                    flightObject.transitAirport = segment.beginLocation.locationCode;
                    flightObject.departDateTime = dptDepartDateTime;
                    flightObject.arrivalDateTime = dptArrivalDateTime
                    flightObject.transitDepartDateTime = dptTransitDepartDateTime
                    flightObject.transitArrivalDateTime = dptTransitArrivalDateTime
                }
            })
            if(!dptMap.has(flightObject._flightCode+flightObject._transitAirport+flightObject._transitFlightCode+flightObject._bookingClass)){
                dpt.push(flightObject.toJson())
                dptMap.set(''+flightObject._flightCode+flightObject._transitAirport+flightObject._transitFlightCode+flightObject._bookingClass)
            }

            if (rtnSegments.length > 2) return;
            let rtnDepartDateTime = null;
            let rtnArrivalDateTime = null;
            let rtnTransitDepartDateTime = null;
            let rtnTransitArrivalDateTime = null;
            if (rtnSegments.length== 2) {
                rtnDepartDateTime = moment(rtnSegments[0].beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                rtnArrivalDateTime = moment(rtnSegments[1].endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                rtnTransitDepartDateTime = moment(rtnSegments[0].endDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
                rtnTransitArrivalDateTime = moment(rtnSegments[1].beginDate, 'MMMM DD, YYYY h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
            }
            rtnSegments.forEach((segment) => {
                if (segment.endLocation.locationCode != 'HAN') {
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
                    flightObject.transitAirport = segment.beginLocation.locationCode;
                    flightObject.departDateTime = rtnDepartDateTime;
                    flightObject.arrivalDateTime = rtnArrivalDateTime;
                    flightObject.transitDepartDateTime = rtnTransitDepartDateTime;
                    flightObject.transitArrivalDateTime = rtnTransitArrivalDateTime;
                }
            })
            if(!rtnMap.has(flightObject._flightCode+flightObject._transitAirport+flightObject._transitFlightCode+flightObject._bookingClass)){
                rtn.push(flightObject.toJson())
                rtnMap.set(''+flightObject._flightCode+flightObject._transitAirport+flightObject._transitFlightCode+flightObject._bookingClass)
            }
    }


    // const listBounds = availability.cube.bounds
    // listBounds.forEach(async bound => {
    //     const fareFamilyList = bound.fareFamilyList
    //     for (const flightObj of fareFamilyList) {
    //         const flights = flightObj.flights;
    //         for (const key in flights) {
    //             const flight = flights[key];
    //             const { flightId, rbd } = flight.flight;
    //             const foundFlight = get_flight_info(flightId, rbd, availability)
    //             if (foundFlight !== undefined)
    //                 res.push(foundFlight)
    //         }
    //     }
    // })



    //LANGUAGE=GB&COUNTRY_SITE=GB&SITE=CARMCARM&BOOKING_FLOW=REVENUE&TRIP_FLOW=YES
    //&EXTERNAL_ID=BOOKING&OFFICE_ID=SGNCI08AB&TRIP_TYPE=O&PRICING_TYPE=O
    //&RECOMMENDATION_ID_1=0&FLIGHT_ID_1=0&IS_MILES_MODE=false&PAGE_TICKET=0



    const res =({
        "dpt":dpt,
        "rtn":rtn
    });

    // res.forEach(flight => {
    //     console.log(flight)
    // })
    console.log(res)




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


