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
    "child": 0,
    "infant": 0,
    "dptDate": "2021-09-29"
   }
   */
    //CABIN: Y = Economy
    const body = req.body;
    const convertedDate = body.dptDate.split("-").join("") + '0000';
    let data = `B_LOCATION_1=${body.origin}&E_LOCATION_1=${body.dest}&B_DATE_1=${convertedDate}&ADULTS=${body.adult}&CHILDS=${body.child}&INFANTS=${body.infant}&LANG=GB&CABIN=Y&TRIP_TYPE=O&Channel=IOS&EBA=GB`;

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
            'Cookies':'_gcl_au=1.1.1960572295.1685454090; __utmc=225761605; visid_incap_2252153=y5go/uUdRrm5hVYRY4EzQnYadmQAAAAAQUIPAAAAAABkz8heCCh3jWR4XUaKrtzY; incap_ses_431_2252153=j7TZFKa0jXb8gMrnJDn7BWoidmQAAAAALvR7kLH736UHIi0+RYXJkQ==; incap_ses_265_2252153=CbFNWzv9eBZtktnxoXitA/godmQAAAAA5SIZpaP1i6I6TbgJ9HQZtw==; incap_ses_797_2252153=o2C0bGhtcQCaBSPeKIQPCwAwdmQAAAAAzy2KFpe7zoWKBXvUHBKHlg==; country=United%20States; _gid=GA1.2.714407047.1685545274; __utma=225761605.72006886.1685454090.1685454090.1685545274.2; __utmz=225761605.1685545274.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _clck=tvky6f|2|fc2|0|1245; cookie-locale=1; cookie-locale-us=1; flightSearchResultFrom=Hanoi-HAN-Vietnam; flightSearchResultTo=Singapore-SIN-Singapore; flightSearchResultLang=%2Fus%2Fen; incap_ses_214_2252153=dbJhAdQmlH9DGeKqAEj4Aodid2QAAAAAg0aW7wnwTB1m8AfF7XLabw==; incap_ses_415_2252153=5ezBUFZ0eQmiHbzU0WDCBYhid2QAAAAAfSN5JPxlnQrPq5nYBN9PRQ==; um_jst=7C7C3CF5BE4EFA192AF77B46E477AC2677AFDAC27186EE12DF2705DB263315E8; DWM_XSITECODE=CARMCARM; e414981128293b49935d27ee056ba918=51bbda38c5359955cb5459ff6877a255; nlbi_2252153=Gvm5aHbUvnKeCk1wRZjwhwAAAACd80V+63+hcpKA4jHXyPlH; OLS_UID=3a5c5b11-6ad7-4532-843b-b97df20bedca; incap_ses_202_2252153=7Q3jD6rW6mpYY81KDKbNApVid2QAAAAAmh0x9kkW7Z/cn0ZzXgMQhw==; incap_ses_1046_2252153=4f5MeDTZ0xqsByDJVCSEDmlkd2QAAAAA0yxwUubLuMT3TLDsZ2M5ag==; incap_ses_935_2252153=zfNQQ4mFhAky28QGYsr5DKlkd2QAAAAAb7xWfYGcbp3cEjnmMrEsSA==; incap_ses_256_2252153=QOhQClgo4UzGLl9ThH+NA05od2QAAAAARa7gR/dl8W5G5btnxW0uOQ==; reese84=3:LAf/Dy6UySZsOo6ilipLQQ==:iSNKVipy+V6qNKylUP1d4T5boGUJV99dHVT7TbXvNnyUnUirMOiHh61VLeYGm0Ir7Kax3upTXQaSufuYC+7Tem+J0JXZ6fwnYeFdFgy8xi34tVnLyroYwtRQxkDklKzh1cj13SAa0kFBZKqLMSZ50O2icyIQuFs/uboXwqsosnQJF6Str55o3hTM7cGmcdBXhEGaEe4zAVYGoiIf0sXAlR4EgBWku8kbRSQtNtrjpiTuHcSDHU6QoLJ76X2lTTMQU2KDSlX6Vy1GoW2SFtM8UmYd7Xo1PWj4fniMwJuqA/GZWZVYMDAxaEvi+wGhf/Sn8kvn85OrLRchtqsn8IP9H7kcrzLXi2/tZTMIsPpl6uu3sTZUv2HryWXDhLBhJbQQGrnC1/W+tcXEi/4s2ycjhYyJQ0Vd7tP2cqMgcZK52qwsfIE5Vb2tBAPmcsMY81ooFHoJheBWQKjWbDS+CKAXrR+YEnXMcy9iMTlvoVWj8W8eKE1NGwPW/0viLUyWd+Vcm0Mr3TZcvyZw2h3sv3CrBKEC9A+uFo7O/0jWHO2RPNAOhGLotZHvpixMr+2JVsuM9W63puIyAO53W9i793luv6NpCgTvKDorm+odWHt7mmf/4eeWptEKNAz5edQaIJ4FO6Q72dLTKh4GkuSbImvP9A==:hJnObuXWi8+vnppVCFWBUEfCgtniksqFxf3vwYCrYMc=; flightSearchResult=1; incap_ses_934_2252153=MBVmSfbTGWweNLG15Tz2DKxod2QAAAAA17wSbkrAEUWDudlcV9BivQ==; incap_ses_933_2252153=4nGpD0aleTYg0r+9ZK/yDK1od2QAAAAAOFP8f9bQ7EnZ+MtZNFiWbg==; __utmt_track0=1; __utmt_track1=1; __utmb=225761605.9.10.1685545274; _ga=GA1.1.72006886.1685454090; _uetsid=fd732f10ffc311edb38c4bc1fe45063e; _uetvid=af099710feef11edbca22b93a9983bc0; _clsk=1ur1g76|1685547185660|2|1|v.clarity.ms/collect; incap_ses_1044_2252153=QjErYIXqylU5o7WBVwl9DnVpd2QAAAAAMU8OJh7mgxK+s1kwTZFgog==; incap_ses_1047_2252153=fdVLZnw/AVUMxPHHzrGHDnVpd2QAAAAAQXOEIplDP0k+gHtCtQ537A==; BIGipServer~ETV~RD1_ns_bibi-prd_praxis_80_pool=!BspNf/0ILBH5U8QjVdJLkktCYi1XHqCDgFXc8HbQz4h6T9YGmysCqocYkOipW29hKM1aWtJNoSO8WY/yz/N2vTL6BPEzrFc80vreU+k=; _dd1A=lPAPD57qdYYbZubo_rYjSDA_7HhflM4IZAtynfiD!16855456106321685545612.3; _ga_ZW09V288NG=GS1.1.1685545274.2.1.1685547390.51.0.0; _ga_GYSW63REV5=GS1.1.1685545274.2.1.1685547390.51.0.0; ___utmvc=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; nlbi_2252153_2147483392=lNokYavecH5VdoPmRZjwhwAAAABFhRrcPc/XHiUmzeAtsUHu'
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
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookies':'_gcl_au=1.1.1960572295.1685454090; __utmc=225761605; visid_incap_2252153=y5go/uUdRrm5hVYRY4EzQnYadmQAAAAAQUIPAAAAAABkz8heCCh3jWR4XUaKrtzY; incap_ses_431_2252153=j7TZFKa0jXb8gMrnJDn7BWoidmQAAAAALvR7kLH736UHIi0+RYXJkQ==; incap_ses_265_2252153=CbFNWzv9eBZtktnxoXitA/godmQAAAAA5SIZpaP1i6I6TbgJ9HQZtw==; incap_ses_797_2252153=o2C0bGhtcQCaBSPeKIQPCwAwdmQAAAAAzy2KFpe7zoWKBXvUHBKHlg==; country=United%20States; _gid=GA1.2.714407047.1685545274; __utma=225761605.72006886.1685454090.1685454090.1685545274.2; __utmz=225761605.1685545274.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _clck=tvky6f|2|fc2|0|1245; cookie-locale=1; cookie-locale-us=1; flightSearchResultFrom=Hanoi-HAN-Vietnam; flightSearchResultTo=Singapore-SIN-Singapore; flightSearchResultLang=%2Fus%2Fen; incap_ses_214_2252153=dbJhAdQmlH9DGeKqAEj4Aodid2QAAAAAg0aW7wnwTB1m8AfF7XLabw==; incap_ses_415_2252153=5ezBUFZ0eQmiHbzU0WDCBYhid2QAAAAAfSN5JPxlnQrPq5nYBN9PRQ==; um_jst=7C7C3CF5BE4EFA192AF77B46E477AC2677AFDAC27186EE12DF2705DB263315E8; DWM_XSITECODE=CARMCARM; e414981128293b49935d27ee056ba918=51bbda38c5359955cb5459ff6877a255; nlbi_2252153=Gvm5aHbUvnKeCk1wRZjwhwAAAACd80V+63+hcpKA4jHXyPlH; OLS_UID=3a5c5b11-6ad7-4532-843b-b97df20bedca; incap_ses_202_2252153=7Q3jD6rW6mpYY81KDKbNApVid2QAAAAAmh0x9kkW7Z/cn0ZzXgMQhw==; incap_ses_1046_2252153=4f5MeDTZ0xqsByDJVCSEDmlkd2QAAAAA0yxwUubLuMT3TLDsZ2M5ag==; incap_ses_935_2252153=zfNQQ4mFhAky28QGYsr5DKlkd2QAAAAAb7xWfYGcbp3cEjnmMrEsSA==; incap_ses_256_2252153=QOhQClgo4UzGLl9ThH+NA05od2QAAAAARa7gR/dl8W5G5btnxW0uOQ==; reese84=3:LAf/Dy6UySZsOo6ilipLQQ==:iSNKVipy+V6qNKylUP1d4T5boGUJV99dHVT7TbXvNnyUnUirMOiHh61VLeYGm0Ir7Kax3upTXQaSufuYC+7Tem+J0JXZ6fwnYeFdFgy8xi34tVnLyroYwtRQxkDklKzh1cj13SAa0kFBZKqLMSZ50O2icyIQuFs/uboXwqsosnQJF6Str55o3hTM7cGmcdBXhEGaEe4zAVYGoiIf0sXAlR4EgBWku8kbRSQtNtrjpiTuHcSDHU6QoLJ76X2lTTMQU2KDSlX6Vy1GoW2SFtM8UmYd7Xo1PWj4fniMwJuqA/GZWZVYMDAxaEvi+wGhf/Sn8kvn85OrLRchtqsn8IP9H7kcrzLXi2/tZTMIsPpl6uu3sTZUv2HryWXDhLBhJbQQGrnC1/W+tcXEi/4s2ycjhYyJQ0Vd7tP2cqMgcZK52qwsfIE5Vb2tBAPmcsMY81ooFHoJheBWQKjWbDS+CKAXrR+YEnXMcy9iMTlvoVWj8W8eKE1NGwPW/0viLUyWd+Vcm0Mr3TZcvyZw2h3sv3CrBKEC9A+uFo7O/0jWHO2RPNAOhGLotZHvpixMr+2JVsuM9W63puIyAO53W9i793luv6NpCgTvKDorm+odWHt7mmf/4eeWptEKNAz5edQaIJ4FO6Q72dLTKh4GkuSbImvP9A==:hJnObuXWi8+vnppVCFWBUEfCgtniksqFxf3vwYCrYMc=; flightSearchResult=1; incap_ses_934_2252153=MBVmSfbTGWweNLG15Tz2DKxod2QAAAAA17wSbkrAEUWDudlcV9BivQ==; incap_ses_933_2252153=4nGpD0aleTYg0r+9ZK/yDK1od2QAAAAAOFP8f9bQ7EnZ+MtZNFiWbg==; __utmt_track0=1; __utmt_track1=1; __utmb=225761605.9.10.1685545274; _ga=GA1.1.72006886.1685454090; _uetsid=fd732f10ffc311edb38c4bc1fe45063e; _uetvid=af099710feef11edbca22b93a9983bc0; _clsk=1ur1g76|1685547185660|2|1|v.clarity.ms/collect; incap_ses_1044_2252153=QjErYIXqylU5o7WBVwl9DnVpd2QAAAAAMU8OJh7mgxK+s1kwTZFgog==; incap_ses_1047_2252153=fdVLZnw/AVUMxPHHzrGHDnVpd2QAAAAAQXOEIplDP0k+gHtCtQ537A==; BIGipServer~ETV~RD1_ns_bibi-prd_praxis_80_pool=!BspNf/0ILBH5U8QjVdJLkktCYi1XHqCDgFXc8HbQz4h6T9YGmysCqocYkOipW29hKM1aWtJNoSO8WY/yz/N2vTL6BPEzrFc80vreU+k=; _dd1A=lPAPD57qdYYbZubo_rYjSDA_7HhflM4IZAtynfiD!16855456106321685545612.3; _ga_ZW09V288NG=GS1.1.1685545274.2.1.1685547390.51.0.0; _ga_GYSW63REV5=GS1.1.1685545274.2.1.1685547390.51.0.0; ___utmvc=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; nlbi_2252153_2147483392=lNokYavecH5VdoPmRZjwhwAAAABFhRrcPc/XHiUmzeAtsUHu'
      },
      data : data
    };
    const searchResponse = await fetchData(config);
    const $ = cheerio.load(searchResponse);
    console.log($.html)
    return searchResponse;
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