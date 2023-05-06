const XLSX = require('xlsx')
var gplay = require('google-play-scraper');

// This example will return 3000 reviews
// on a single call
// gplay.reviews({
//     appId: 'com.ruangguru.livestudents',
//     sort: gplay.sort.RATING,
//     num: 3000
// }).then(console.log, console.log);

// This example will return the first page with 150 reviews paginated
// just send an empty nexPaginationToken
// you will receive a nextPaginationToken parameter in your response
gplay.reviews({
    appId: 'com.ruangguru.livestudents',
    sort: gplay.sort.NEWEST,
    paginate: true,
    nextPaginationToken: null, // you can omit this parameter
    num:654000
}).then( function (result) {
    console.log(result);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(result.data);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'data/ruangguru.xlsx');

});

// This example will return 150 reviews paginated
// for the next page (next page is the token return by the previous call)
// you will receive a nextPaginationToken parameter in your response
// gplay.reviews({
//     appId: 'com.ruangguru.livestudents',
//     sort: gplay.sort.RATING,
//     paginate: true,
//     nextPaginationToken: 'TOKEN_FROM_THE_PREVIOUS_REQUEST' // you can omit this parameter
// }).then(console.log, console.log);

//store data to excel

//create google-play-scraper get all reviews