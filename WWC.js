$(() => {
    // Handle the navigation 
    $(".aboutBTN").click(function (e) {
        $(".about").css("display", "flex")
        $(".coins").css("display", "none")
    })

    $(".homeBTN").click(function (e) {
        $(".coins").css("display", "")
        $(".about").css("display", "none")
    })

    let idNum = 0
    // Display the coins

    $.get("https://api.coingecko.com/api/v3/coins/list", function (coins) {
        for (let coin = 0; coin < 10; coin++) {
            const currentCoin = coins[coin];
            creatCoin(currentCoin, idNum)
            idNum++

        };
    })

})

function creatCoin(currentCoin, idNum) {

    // Create all the elements in the task
    let coin = $("<div></div>").addClass("card-body").attr("id", `coin${idNum}`)
    let coinRow = $("<div></div>").addClass("row")
    let coinSymbol = $("<h5></h5>").addClass("card-title").text(currentCoin.symbol)
    let switchToggle = $("<div></div>").addClass("custom-control custom-switch")
    let toggleInp = $("<input>").addClass("custom-control-input").attr("type", "checkbox").attr("id", `live_reports${idNum}`)
    let toggleLabel = $("<label></label>").addClass("custom-control-label").attr("for", "live_reports")
    let coinName = $("<p></p>").addClass("card-text").text(currentCoin.name)
    let moreInfoBTN = $("<button></button>").addClass("btn btn-warning").text("More Info").attr("data-toggle", "collapse").attr("data-target", "#more_info").attr("aria-controls", "more_info").attr("aria-expanded", "false")
    let moreInfoCollapse = $("<div></div>").addClass("collapse").attr("id", `more_info${idNum}`)
    let moreInfoContainer = $("<div></div>").addClass("cont")
    let imageCoin = $("<img>").addClass("col")
    let contCoin = $("<div></div>").addClass("col")
    let coinToUSD = $("<p></p>").addClass("USD")
    let coinToEUR = $("<p></p>").addClass("ERU")
    let coinToILS = $("<p></p>").addClass("ILS")
    
    // Combine everything together 
    $(".coins").append(coin)
    $(coin).append(coinRow)
    $(coinRow).append(coinSymbol)
    $(coinRow).append(switchToggle)
    $(switchToggle).append(toggleInp)
    $(switchToggle).append(toggleLabel)
    $(coin).append(coinName)
    $(coin).append(moreInfoBTN)
    $(coin).append(moreInfoCollapse)
    $(moreInfoCollapse).append(moreInfoContainer)
    $(moreInfoContainer).append(contCoin)
    $(contCoin).append(coinToUSD)
    $(contCoin).append(coinToEUR)
    $(contCoin).append(coinToILS)
    $(moreInfoContainer).append(imageCoin)

    // Handle the info button

    $(moreInfoBTN).click(function (e) {
        // let moreInfoCollapse = e.target.parentElement.lastChild
        // switch (moreInfoCollapse.className) {
        //     case collapse:
        //         break;
        //     case collapsing:
        //         break;
        //     default:
        //         break;
        // }
        
        let moreInfoCollapse = e.target.parentElement.lastChild
        $(moreInfoCollapse).toggle()

        let keys = Object.keys(localStorage)

        let current = $(e.target).prev()
        if (keys.length == 0) {
            creatMoreInfoFromAPI(currentCoin.id, imageCoin, coinToUSD, coinToEUR, coinToILS)
        } else {
            keys.forEach(key => {
                if (keys.find(key => key == $(current).text())) {

                    let value = JSON.parse(localStorage.getItem(key))

                    if (checkTime(value.date)) {
                        // create more info from localStorage
                        $(imageCoin).attr("src", value.image)
                        $(coinToUSD).text(`USD: ${value.USD}$`)
                        $(coinToEUR).text(`EUR: ${value.EUR}£`)
                        $(coinToILS).text(`ILS: ${value.ILS}₪`)
                    } else {
                        creatMoreInfoFromAPI(currentCoin.id, imageCoin, coinToUSD, coinToEUR, coinToILS)

                    }
                } else {
                    creatMoreInfoFromAPI(currentCoin.id, imageCoin, coinToUSD, coinToEUR, coinToILS )

                }

            });


        }
    })

}

function checkTime(date) {

    let now = new Date();
    now = now.getTime()
    if ((date + 2000) >= now) {
        return true
    } else { return false }
}


function creatMoreInfoFromAPI(id, imageCoin, coinToUSD, coinToEUR, coinToILS) {
    

    $.get("https://api.coingecko.com/api/v3/coins/" + id, function (info) {

    console.log(info);
        $(imageCoin).attr("src", info.image.small)
        $(coinToUSD).text(`USD: ${info.market_data.current_price.usd}$`)
        $(coinToEUR).text(`EUR: ${info.market_data.current_price.eur}£`)
        $(coinToILS).text(`ILS: ${info.market_data.current_price.ils}₪`)

        // save to localStorage
        let d = new Date()

        localStorage.setItem(id, JSON.stringify({
            image: info.image.small,
            USD: info.market_data.current_price.usd,
            EUR: info.market_data.current_price.eur,
            ILS: info.market_data.current_price.ils,
            date: d.getTime()
        }))
    })
}










