console.log("File will be deleted in case it already exists!");

var fs = require('fs'),
    readline = require('readline');

var gplay = require('google-play-scraper');

var rd = readline.createInterface({
    input: fs.createReadStream('app.txt'),
    // output: process.stdout,
    console: false
});

var http = require('http');
var https = require('https');
http.globalAgent.maxSockets = 1;
https.globalAgent.maxSockets = 1;

rd.on('line', function (line) {

    gplay.app({
        appId: line,
        lang: 'id',
        country: 'id'
    }).then(obj => {
        var perPage = 150;

        console.log("Extracting reviews from: " + line);

        console.log("Total review count for app: " + line + " is: " + obj.reviews);

        delFile("details/" + line + ".json");
        console.log("Saving details");
        appendToFile("details/" + line + ".json", obj);

        delFile("reviews/" + line + ".csv");
        // var tReviewPages = Math.ceil(obj.reviews / perPage); // Google store 40 reviews in single page
        tReviewPages = 1;
        console.log("Saving reviews from " + tReviewPages + " pages");


        for (i = 0; i < tReviewPages; i++) {

            var review = gplay.reviews({
                appId: line,
                page: i,
                fullDetail: true,
                sort: gplay.sort.NEWEST,
                lang: 'id',
                country: 'id',
                num: perPage
            }).then(obj => {
                // appendToFile("reviews/" + line + ".review", obj);
                appendToCSV("reviews/" + line + ".csv", obj.data);
            });

            console.log(`page ${line} ${(i+1)} / ${tReviewPages}`);
        }

        console.log("\n");
    });

});

function appendToCSV(filename, dataArray) {
    // Check if the file already exists
    const fileExists = fs.existsSync(filename);

    // If the file doesn't exist, create a new one with header row
    if (!fileExists) {
        headers = ['username', 'date', 'score', 'version', 'text'];
        fs.writeFileSync(filename, headers.join(',') + '\n');

        // const headerRow = Object.keys(dataArray[0]).join(',') + '\n';
        // fs.writeFileSync(filename, headerRow);
    }

    // Append data to the file
    const dataRows = dataArray.map(data => {
        const rows = [
            JSON.stringify(data.userName.toString().replace(/["]+/g, '')),
            JSON.stringify(data.date),
            JSON.stringify(data.score),
            JSON.stringify(data.version),
            JSON.stringify(data.text.toString().replace(/["]+/g, ''))
        ];
        return rows.join(',') + '\n';

        // return Object.values(data).join(',') + '\n';
    });
    fs.appendFileSync(filename, dataRows.join(''));
}

function appendToFile(filename, obj) {
    fs.appendFileSync(filename, JSON.stringify(obj, null, '\t'), 'utf-8', function (err) {
        if (err) { console.log(err); }
    });
}

function delFile(fileName) {
    fs.unlink(fileName, (err) => {
        if (!err) {
            // console.log("Deleting existing file " + fileName);
        }
    });
}