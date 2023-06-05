const axios = require('axios');
let data = 'LANGUAGE=GB&COUNTRY_SITE=GB&SITE=CARMCARM&BOOKING_FLOW=REVENUE&TRIP_FLOW=YES&EXTERNAL_ID=BOOKING&OFFICE_ID=SGNCI08AB&TRIP_TYPE=O&PRICING_TYPE=O&RECOMMENDATION_ID_1=1&FLIGHT_ID_1=0&IS_MILES_MODE=false&PAGE_TICKET=0';

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://book.china-airlines.com/plnext/FPChinaAirlines/AjaxCall.action;jsessionid=W54tCliyYXH-uDOx6SE3RqaqWh2ZFPJkvlEJiVIB!1685773479630?UID=FARE&UI_ACTION=ajax',
  headers: { 
    'Accept': '*/*', 
    'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8', 
    'Connection': 'keep-alive', 
    'Content-Type': 'application/x-www-form-urlencoded;', 
    'Cookie': '_gcl_au=1.1.1960572295.1685454090; visid_incap_2252153=y5go/uUdRrm5hVYRY4EzQnYadmQAAAAAQUIPAAAAAABkz8heCCh3jWR4XUaKrtzY; cookie-locale=1; cookie-locale-us=1; OLS_UID=3a5c5b11-6ad7-4532-843b-b97df20bedca; emcid=F-UlmLJ3uyZ; country=United%20States; _gid=GA1.2.1803566239.1685769911; __utmc=225761605; _clck=tvky6f|2|fc5|0|1245; flightSearchResultFrom=Hanoi-HAN-Vietnam; flightSearchResultTo=Singapore-SIN-Singapore; flightSearchResultLang=%2Fus%2Fen; um_jst=591B3857706CF9F4E10425AE225BAC8602675D1C215E5A695C27B6E625642723; DWM_XSITECODE=CARMCARM; e414981128293b49935d27ee056ba918=e57f151e0209b44b2f8c147de7de52fb; incap_ses_935_2252153=d4QperJwFWanBzQJYsr5DNDOemQAAAAA1W2Bnm05egC7vzc0A2aBeQ==; nlbi_2252153=VwCPMYsCnBglH5UnRZjwhwAAAADGsQxx1yTaTkc2SlhbUqAL; incap_ses_576_2252153=5dNeaZ5YohJ08fMt/F3+B9PbemQAAAAARdO9m3JUTqRJElm9+tgX8w==; reese84=3:nZ2XbJ5Icm0eVu8i+d0KHg==:+cMRL9P4hGONFdrln9iKWE4cedT0fpJiU9ny71xyAte27GEc6Mv3KtJmKMOb4HOHJOTB1kxhSVI3oas9YzmQWf7oqKxJi+W2lusQwGGB9Dg660Cn+mlTH0c2wCTegNMZyajDl9DuYtIX+/uNf82DJRpzT3a+nDoqIM3qtIqLDTnCd19e/ICr46DYccRas+uYYN/ow+4xevZV3pIpsMVZ+zqVQnlEstxKaTF9zqsEcS/G8kl4Bf0JyV+1g+58KHkmCEv/0HiYcRvukghpP4lsRI478XM0cUkwil/aSMI5ygR8WGaPWDfuveZgqOyApVETM4Mte21QNDxwzw2hH/TZWMIorGmwnRfPpbLx4q7qQpXuJB4E4DMkJiiNOlKGJCciJlKZkSpKNQx/KxZGL8aNEqpBIXZTRM1LM4Vyr1su12iywl8COvRIGsvDMc6MfTscalHaqstRXM/TGPD3kOiqxkiO2cFGV52VHCSWCn4T+DyfVOoUpslSnk4/ulqFaf3BICdmSMFDeUDeJJM0u14fg84hMaHhq1XR1dGX2G/X0nMvIvqYiPyU/HQgp8y2sNtfzxJtkIvMzX7UlZOZ66FiCNcOJ3FK/9608lhV7V4Q2kuJZOXRngLuI+wifHRPdhf9yG2Qhz2b51wVGtbd8k5AfeALr+N5+QnNvFuf2a+KV0AdK9pHcBZpEkXC1el5KNNnc4jEDP44WqwK1uRx05j46g==:4PzUuS5bMuPzTLUlQuew6EwjVg2otfF2eh28htByY9I=; incap_ses_429_2252153=VGxxHSpNPV+PpYWhJx70BWzcemQAAAAAxcpBQIRr0oRZ4jsm9Z0lbQ==; incap_ses_570_2252153=H0jRXfSsNQabNy9FhAzpB23cemQAAAAA8Khkty8LjSqNVW4wNN2Jbg==; __utma=225761605.72006886.1685454090.1685769912.1685773423.5; __utmz=225761605.1685773423.5.5.utmcsr=book.china-airlines.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt_UA-46599335-8=1; keep-settings=1; default-redirect-url=%2Fus%2Fen; __utmt_track0=1; __utmt_track1=1; flightSearchResult=1; _dd1A=lPAPD57qdYYbZubo_rYjSDA_7HhflM4IZAtynfiD!16855456106321685545612.6; nlbi_2252153_2147483392=WoYMYL3RiCdZU3HGRZjwhwAAAABrtJSRcCv/ZzaJWWuaktV7; __utmb=225761605.9.10.1685773423; _ga_GYSW63REV5=GS1.1.1685773421.7.1.1685773486.57.0.0; _ga=GA1.1.72006886.1685454090; _ga_ZW09V288NG=GS1.1.1685773422.7.1.1685773486.57.0.0; _uetsid=02f5497001cf11eeb7090fc31501d436; _uetvid=af099710feef11edbca22b93a9983bc0; BIGipServer~ETV~RD1_ns_bibi-prd_praxis_80_pool=!bopvF1sEsrdhSmwjVdJLkktCYi1XHmmJr7rMvHf8GVAOOjg/ogEmE5w63FTjeOgp2u+bH4KVaFn8f/NuNn0ef6T0Xgf9Mh0RnCLvG2g=; _clsk=1n5lm9r|1685773487504|8|0|w.clarity.ms/collect; incap_ses_1132_2252153=Z4kvVvc8vHbZ2oJt96y1D0reemQAAAAAaP1MiTwr4bTRxWSyIUSOjw==; incap_ses_429_2252153=/nRNOkpYzDPb64ehJx70BUXgemQAAAAA4oqWlmvE7/ABqZEcSd8fNA==; visid_incap_2252153=KCsq1cgqTyq5cL595IqEUfMMdmQAAAAAQUIPAAAAAADf9XVo53QsLhDYCfub85Js; BIGipServer~ETV~RD1_ns_bibi-prd_praxis_80_pool=!ffZmHZED34yw9wMjVdJLkktCYi1XHiI1weKe0sSZEn7vMAF6bjxG/PHUNGIYpj5HlrKMhhRIk+jmKK3wtRsqN1DokTteXnTvHpZF/B4=; DWM_XSITECODE=CARMCARM; _dd1A=FE_CDCvHZxBS9PZQSGTwqJdpXojM5cR0WmrAMLXS!16856302641821685630266.4', 
    'Origin': 'https://book.china-airlines.com', 
    'Referer': 'https://book.china-airlines.com/plnext/FPChinaAirlines/Override.action', 
    'Sec-Fetch-Dest': 'empty', 
    'Sec-Fetch-Mode': 'cors', 
    'Sec-Fetch-Site': 'same-origin', 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 
    'X-Accept-Charset': 'iso-8859-1', 
    'X-Requested-With': 'XMLHttpRequest', 
    'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
