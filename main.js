// Greeting Section
function greetingHandler() {
    let currentHour = new Date().getHours(); // Get the current hour to determine the appropriate greeting
    let greetingMessage = "";

    if(currentHour < 12) {
        greetingMessage = "Good Morning!";
    } else if (currentHour < 18) {
        greetingMessage = "Good Afternoon!";
    } else {
        greetingMessage = "Good Evening!";
    }

    document.querySelector("#greeting").innerHTML = greetingMessage;
}


// CONST variables required for the openWeatherMap API
const weatherAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric`;
const weatherAPIKey = "XXXXXXXXXXX"; // Enter the API Key

// Weather Text
function weatherHandler() {
    navigator.geolocation.getCurrentPosition(function(location){
        const weatherTextElement = document.querySelector("p#weather-info");
        
        let latitude = location.coords.latitude;
        let longitude = location.coords.longitude;
        let api_URL = weatherAPIURL.replace("{lat}", latitude).replace("{lon}", longitude).replace("{API key}", weatherAPIKey); // Request call based on user's latitude and longitude

        fetchAPIData(api_URL, weatherTextElement)
        .then(data => {
            let position = data.name;
            let weather = data.weather[0].description;
            let temperature = data.main.temp;
            weatherTextElement.innerHTML = `It is ${weather} in ${position} with ${temperature}°C.`; // Example: It is scattered clouds in London with 17°C.
        })
    });
}

// Local Time - Clock Function
function localTimeHandler() {
    setInterval(function(){ // Set interval of 1 second to update the clock every second.
        let currentDateTime = new Date();
        let currentHour = currentDateTime.getHours();
        let currentMinute = currentDateTime.getMinutes();
        let currentSecond = currentDateTime.getSeconds();

        document.querySelector(".time-holder span[data-time=hours]").textContent = currentHour.toString().padStart(2,"0");
        document.querySelector(".time-holder span[data-time=minutes]").textContent = currentMinute.toString().padStart(2,"0");
        document.querySelector(".time-holder span[data-time=seconds]").textContent = currentSecond.toString().padStart(2,"0");

    }, 1000); // 1000ms = 1s
}


// Last Update Date Time
function lastUpdateHandler() {
    let currentDateTime = new Date();
    let dateTime = currentDateTime.toLocaleString();
    let timeZone = currentDateTime.toLocaleString('en-US', { timeZoneName: 'short' }).split(' ').pop();

    document.querySelector(".info-bar .last-updatetime h5").textContent = `Last Update ${dateTime} (${timeZone})`; // Updates the date/time on top of the stock list so that the user knows when was the last action
}


/*******************************************Stock Market Group Selection + Stock Polulation*********************************************/

// Sample Stock Card
/* <div class="stock-card">
    <div class="stock-name">
        <h3>AAPL</h3>
        <p>Apple Inc</p>
    </div>
    <div class="stock-price price-dropped">
        <h3>$226.19</h3>
        <p>-9.81 (-4.16%)</p>
    </div>
</div> */


const stockAPIURL = "https://api.twelvedata.com/quote";
const stockAPIKey = "XXXXXXXXXXX"; // Enter the API Key

const stockList = [ // Ideally we would like to fetch the symbols from the API too but it is hardcoded here since the Tweve Data API free subscription has limits.
                    // Only the prices and changes are going to be fetched from the API.
    {
        "market": "NASDAQ",
        "symbol": "AAPL",
        "name": "Apple Inc."
    },
    {
        "market": "NASDAQ",
        "symbol": "MSFT",
        "name": "Microsoft Corporation"
    },
    {
        "market": "NASDAQ",
        "symbol": "AMZN",
        "name": "Amazon.com, Inc."
    },
    {
        "market": "NASDAQ",
        "symbol": "GOOGL",
        "name": "Alphabet Inc. Class A"
    },
    {
        "market": "NYSE",
        "symbol": "AAT",
        "name": "American Assets Trust Inc"
    },
    {
        "market": "NYSE",
        "symbol": "KO",
        "name": "The Coca-Cola Company"
    },
    {
        "market": "NYSE",
        "symbol": "MCD",
        "name": "McDonald's Corporation"
    },
    {
        "market": "NYSE",
        "symbol": "GS",
        "name": "Goldman Sachs Group Inc."
    },
    {
        "market": "TSE/TYO",
        "symbol": "7203",
        "name": "Toyota Motor Corporation"
    },
    {
        "market": "TSE/TYO",
        "symbol": "6758",
        "name": "Sony Group Corporation"
    },
    {
        "market": "TSE/TYO",
        "symbol": "6861",
        "name": "Keyence Corporation"
    },
    {
        "market": "TSE/TYO",
        "symbol": "9984",
        "name": "SoftBank Group Corp."
    },
    {
        "market": "ASX",
        "symbol": "BHP",
        "name": "BHP Group Limited"
    },
    {
        "market": "ASX",
        "symbol": "CBA",
        "name": "Commonwealth Bank of Australia"
    },
    {
        "market": "ASX",
        "symbol": "CSL",
        "name": "CSL Limited"
    },
    {
        "market": "ASX",
        "symbol": "WBC",
        "name": "Westpac Banking Corporation"
    },
    {
        "market": "BORSA ITALIANA",
        "symbol": "ENEL",
        "name": "Enel S.p.A."
    },
    {
        "market": "BORSA ITALIANA",
        "symbol": "ENI",
        "name": "Eni S.p.A."
    },
    {
        "market": "BORSA ITALIANA",
        "symbol": "ISP",
        "name": "Intesa Sanpaolo S.p.A."
    },
    {
        "market": "BORSA ITALIANA",
        "symbol": "UCG",
        "name": "UniCredit S.p.A."
    }    
];

// Helper function to display error messages
function displayErrorMessage(message, container) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    container.appendChild(errorMessage);
}

// Helper function to create a stock card element
function createStockCard(symbol, details) {
    // Create the card element
    let stockCard = document.createElement("div");
    stockCard.classList.add("stock-card");

    // Create the stock name element
    let stockNameArea = document.createElement("div");
    stockNameArea.classList.add("stock-name");

    let stockSymbol = document.createElement("h3");
    stockSymbol.textContent = symbol;
    let stockName = document.createElement("p");
    stockName.textContent = details.name;

    stockNameArea.appendChild(stockSymbol);
    stockNameArea.appendChild(stockName);

    // Create the stock price element
    let stockPriceArea = document.createElement("div");
    stockPriceArea.classList.add("stock-price");

    let stockPrice = document.createElement("h3");
    stockPrice.textContent = parseFloat(details.close).toFixed(5);
    let stockPriceChange = document.createElement("p");
    stockPriceChange.textContent = `${parseFloat(details.change).toFixed(5)} (${parseFloat(details.percent_change).toFixed(2)})`;

    if (parseFloat(details.change).toFixed(5) < 0) { // If the price drops, add a class that applies RED to the text color
        stockPrice.classList.add("price-dropped");
        stockPriceChange.classList.add("price-dropped");
    } else {
        stockPrice.classList.add("price-rised"); // If the price rises, add a class that applies GREEN to the text color
        stockPriceChange.classList.add("price-rised");
    }

    stockPriceArea.appendChild(stockPrice);
    stockPriceArea.appendChild(stockPriceChange);

    stockCard.appendChild(stockNameArea);
    stockCard.appendChild(stockPriceArea);

    return stockCard;
}

// Helper function to fetch API data
async function fetchAPIData(url, parentElement) { // the parentElement is used in case there is an error, so that it prints the error inside the given parentElement
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        displayErrorMessage("Failed to fetch stock data. Please try again.", parentElement);
    }
}

// Helper function to populate the stock list based on a given Market Group
function populateStockList(marketGroup) {
    const stockListSection = document.querySelector(".stock-list");

    // Clear stock-list area
    if (stockListSection) {
        while (stockListSection.firstChild) {
            stockListSection.removeChild(stockListSection.firstChild);
        }
    }

    let filteredStockList = stockList.filter(stock => stock.market === marketGroup); // Filter the stockList array based on the Market Group (Exchange)

    let requestURL = `${stockAPIURL}?apikey=${stockAPIKey}&exchange=${marketGroup}&symbol=`;

    filteredStockList.forEach(function(stock, index){
        requestURL = requestURL + stock.symbol + ",";
    });

    requestURL = requestURL.slice(0, -1); // Remove last comma

    fetchAPIData(requestURL, stockListSection)
    .then(data => {

        if(data.status === "error") { // Header Level Error - *** This API returns the error code/status in the response body. That is, the response itself will always be 200
            displayErrorMessage(`Error: ${data.message}`, stockListSection);
        }
        else {
            Object.entries(data).forEach(function([symbol, details]){

                if(details.status === "error") {
                    displayErrorMessage(`Error: ${details.message}`, stockListSection);
                } else {
                    let stockCard = createStockCard(symbol, details);
                    stockListSection.appendChild(stockCard);
                }
            });
        }
    })
    .catch(error => displayErrorMessage(`Error: ${error}`, stockListSection));
}

// Function that deals with the Market Group selector and stock population
function stockMarketGroupHandler() {

    const marketList = document.querySelector(".stock-market-group");   
    const initialMarketGroup = document.querySelector('.stock-market-group h2.active-tab').textContent;

    populateStockList(initialMarketGroup); //Populate the initial market group that is selected by default
    
    marketList.addEventListener("click", function(e){

        lastUpdateHandler(); // Update last update date/time
    
        if(e.target.tagName.toLowerCase() == "h2") {
            // Reset active-tab class for all h2 elements
            document.querySelectorAll(".stock-market-group h2").forEach(h2 => h2.classList.remove("active-tab"));

            // Set active-tab class to the clicked h2
            e.target.classList.add("active-tab");

            populateStockList(e.target.textContent);
        }
    });
}

// Search Function
function searchStockHandler() {
    document.querySelector(".search-area").addEventListener("submit", function(e) {
        e.preventDefault(); // Prevents page refresh for both cases

        const stockListSection = document.querySelector(".stock-list");

        lastUpdateHandler(); // Update last update date/time

        // Clear stock-list area
        if (stockListSection) {
            while (stockListSection.firstChild) {
                stockListSection.removeChild(stockListSection.firstChild);
            }
        }
        
        const inputField = document.querySelector("#stock-input");
        let stockInput = inputField.value;

        if (stockInput.trim() === "") {
            alert("Enter a stock symbol.");
        }
        else {
            let requestURL = `${stockAPIURL}?apikey=${stockAPIKey}&symbol=${stockInput}`;

            fetchAPIData(requestURL, stockListSection)
            .then(data => {

                if(data.status === "error") { // Header Level Error - *** This API returns the error code/status in the response body. That is, the response itself will always be 200
                    displayErrorMessage(`Error: ${data.message}`, stockListSection);
                }
                else {
                        const stockCard = createStockCard(data.symbol, data);
                        stockListSection.appendChild(stockCard);
                }
            })
            .catch(error => displayErrorMessage(`Error: ${error}`, stockListSection));
        }
    });
}

/*****************************************************************************************************************************************/

// Copyright
function copyrightHandler() {
    let currentYear = new Date().getFullYear().toString();
    document.querySelector(".copyright p").innerHTML = `${currentYear} &reg; All Rights Reserved`; // This line makes sure that the year gets updated dynamically.
}

// Page Load
greetingHandler();
weatherHandler();
localTimeHandler();
stockMarketGroupHandler();
lastUpdateHandler();
searchStockHandler();
copyrightHandler();