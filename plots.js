var apiKey = "MKmctyaPKu2wdsPyaz1a";
var stock = "TSLA"

// // Submit Button handler
// function handleSubmit() {
//   // Prevent the page from refreshing
//   d3.event.preventDefault();

//   // Select the input value from the form
//   var stock = d3.select("#stockInput").node().value;
//   console.log(stock);

//   // clear the input value
//   d3.select("#stockInput").node().value = "";

//   // Build the plot with the new stock
//   buildPlot(stock);
// }

// // Add event listener for submit button
// d3.select("#submit").on("click", handleSubmit);

function getMonthlyData() {

    var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
    d3.json(queryUrl).then(function(data) {
        // @TODO: Unpack the dates, open, high, low, close, and volume
        var dates = data.dataset.data.map(row => row[0])
        var lowPrices = data.dataset.data.map(row => row[3])
        var openPrices = data.dataset.data.map(row => row[1])
        var closingPrices = data.dataset.data.map(row => row[4])
        var highPrices = data.dataset.data.map(row => row[2])
        var volume = data.dataset.data.map(row => row[5])

        buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
    });
}



function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;
    for (var i = 0; i < 12; i++) {
        trow = tbody.append("tr");
        trow.append("td").text(dates[i]);
        trow.append("td").text(openPrices[i]);
        trow.append("td").text(highPrices[i]);
        trow.append("td").text(lowPrices[i]);
        trow.append("td").text(closingPrices[i]);
        trow.append("td").text(volume[i]);
    }
}



function buildPlot() {

    var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=2016-01-01&end_date=2017-12-22&api_key=${apiKey}`;

    d3.json(url).then(function(data) {
        // Grab values from the response json object to build the plots
        var name = data.dataset.name;
        var stock = data.dataset.dataset_code;
        var startDate = data.dataset.start_date;
        var endDate = data.dataset.end_date;
        // Print the names of the columns
        console.log(data.dataset.column_names);
        // Print the data for each day
        console.log(data.dataset.data);
        // Use map() to build an array of the the dates
        var dates = data.dataset.data.map(row => row[0])
            // Use map() to build an array of the closing prices
        var closingPrices = data.dataset.data.map(row => row[4])

        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: name,
            x: dates,
            y: closingPrices,
            line: {
                color: "#17BECF"
            }
        };

        var trace2 = {
            type: "candlestick",
            x: data.dataset.data.map(row => row[0]),
            high: data.dataset.data.map(row => row[2]),
            low: data.dataset.data.map(row => row[3]),
            open: data.dataset.data.map(row => row[1]),
            close: data.dataset.data.map(row => row[4]),
            name: "candlestick"
        }

        var data = [trace1, trace2]



        var layout = {
            title: `${stock} closing prices`,
            xaxis: {
                range: [startDate, endDate],
                type: "date"
            },
            yaxis: {
                autorange: true,
                type: "linear"
            }
        };

        Plotly.newPlot("plot", data, layout);

    });
}

buildPlot();
getMonthlyData();