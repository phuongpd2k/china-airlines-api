const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const SOLD_OUT = { "error": true, "msg": "FNF" }
const ERROR = { "error": true, "msg": "<ERROR_MESSAGE>" }
async function one_way_process(req) {
    const searchForm = await create_search_form(req);
    if (searchForm.length == 0){
        return SOLD_OUT;
    }else{
        return get_search_result(searchForm)
    }

}
async function create_search_form(req) {
    /**
   {"origin": "LGK",
    "dest": "KUL",
    "adult": 2,
    "youngAdult": 1,
    "child": 0,
    "infant": 0,
    "dptDate": "2021-09-29"
   }
   */
    //CABIN: Y = Economy
    const body = req.body;
    const convertedDate = body.dptDate.split("-").join("") + '0000';
    let data = `B_LOCATION_1=${body.origin}&E_LOCATION_1=${body.dest}&B_DATE_1=${convertedDate}&ADULTS=${body.adult}&YOUNGADTS=${body.youngAdult}&CHILDS=${body.child}&INFANTS=${body.infant}&LANG=GB&CABIN=Y&TRIP_TYPE=O&Channel=IOS&EBA=GB`;

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
            'Content-Type': 'text/plain'
        },
        data: data
    };
    const searchResponse = await fetchData(config);
    const $ = cheerio.load(searchResponse);
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
async function get_search_result(searchForms) {
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
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://book.china-airlines.com/plnext/FPChinaAirlines/Override.action',
      headers: { 
        'Host': 'book.china-airlines.com', 
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 
        'Sec-Fetch-Site': 'same-site', 
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8', 
        'Sec-Fetch-Mode': 'navigate', 
        'Origin': 'https://bookingportal.china-airlines.com', 
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 
        'Referer': 'https://bookingportal.china-airlines.com/', 
        'Sec-Fetch-Dest': 'document', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    const searchResponse = await fetchData(config);
    const $ = cheerio.load(searchResponse);
    console.log($('title').text())
    return $.html;
}
function fetchData(config) {
    return axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}
module.exports = one_way_process;