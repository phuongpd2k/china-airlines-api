const fs = require('fs');
const filePath = './html';
// Read the file asynchronously
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    const pattern = /{"siteConfiguration"\s*:\s*{[^]*}}}/g;
    const matches = data.match(pattern);
    const jsonObject = JSON.parse(matches);
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
    availabilityFlight.forEach((value,key) => {
        value.forEach( i => console.log(key,i))
        // console.log(key,value);
    })
    console.log(availabilityFlight.values())
});


