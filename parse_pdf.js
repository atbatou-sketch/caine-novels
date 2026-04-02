const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('./src/data/Volume 2 The Demon Leaves the Mountain.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('./src/data/vol2.txt', data.text);
    console.log("Extracted text saved to vol2.txt. Length: " + data.text.length);
}).catch(function(error) {
    console.error(error);
});