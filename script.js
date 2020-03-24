// GET current date
let finishDate = new Date();

// FORMAT finish date
let finishFormatDate = finishDate.getFullYear() + '-' + ('0' + (finishDate.getMonth() + 1)).slice(-2) + '-' + ('0' + finishDate.getDate()).slice(-2);


// GET date 10 years ago!
let startDate = new Date();
startDate.setDate(startDate.getDate() - 10 * 365);

// FORMAT 10 years ago date
let startFormatDate = startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2) + '-' + ('0' + startDate.getDate()).slice(-2);

// API
let idStation = '27612';// ID current station71508
let key = 'BU9brR7I';// my API key
let URL = 'https://api.meteostat.net/v1/history/daily?station=' + idStation + '&start=' + startFormatDate + '&end=' + finishFormatDate + '&key=' + key;
let url = 'https://api.meteostat.net/v1/stations/search?q=new%20york&key=' + key;

let arrData = [];

$.ajax({
    type: 'GET',
    url: URL,
    success: function (dataJSON) {
        for (let i = 0; i < dataJSON.data.length; i++) {
            let date = dataJSON.data[i].date.split('-');
            let dateParse = (new Date(parseInt(date[0]), parseInt(date[1]), parseInt(date[2])).getTime() / 1000);
            let temperatureParse = parseFloat(dataJSON.data[i].temperature);
            arrData.push([dateParse * 1000, temperatureParse]);
        }
        arrData = arrData.sort(function (a, b) {
            return a[0] - b[0];
        });
        arrData = arrData.filter(function (item) {
            return !isNaN(item[1])
        });
        console.log(arrData);
        createGraph();
    }
});

function createGraph() {
    Highcharts.stockChart('container', {
        rangeSelector: {
            allButtonsEnabled: true,
            buttons: [{
                type: 'month',
                count: 3,
                text: 'Day',
                dataGrouping: {
                    forced: true,
                    units: [['day', []]]
                }
            }, {
                type: 'year',
                count: 1,
                text: 'Week',
                dataGrouping: {
                    forced: true,
                    units: [['week', [1]]]
                }
            }, {
                type: 'all',
                text: 'Month',
                dataGrouping: {
                    forced: true,
                    units: [['month', [1]]]
                }
            }, {
                type: 'all',
                text: 'Year',
                dataGrouping: {
                    forced: true,
                    units: [['year', [1]]]
                }
            }],
            buttonTheme: {
                width: 60
            },
            selected: 2
        },

        title: {
            // text: 'График',
            colors: ['#d8803c', '#233a0e', '#bc3ab5', '#910000', '#1aadce',
                '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']
        },
        series: [{
            name: 'C',
            data: arrData,
            color: '#492970',
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
}

