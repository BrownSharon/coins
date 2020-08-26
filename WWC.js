$(() => {
    $(".waiting-popup").hide()
    $(".screen-container").hide()
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
    let toggleChoice = []
    let notChoose = []
    // Display the coins
    $(document).ready(function () {
        $(".coins").html("")
        $(".waiting-popup").show()
        $.get("https://api.coingecko.com/api/v3/coins/list", function (coins) {
            for (let coin = 0; coin < 100; coin++) {
                let currentCoin = coins[coin];
                $.get("https://api.coingecko.com/api/v3/coins/" + currentCoin.id, function (info) {

                    if (info.market_data.current_price.usd || info.market_data.current_price.eur || info.market_data.current_price.ils) {
                        creatCoin(currentCoin, idNum, toggleChoice, notChoose)
                        idNum++
                    }
                })

            }
            $(".waiting-popup").hide()
        })
    })

    let coins = document.querySelector(".coins").children

    for (const coin of toggleChoice) {
        log(coins.item(coin.number).first().first().next())

    }



    $(".saveBTN").click(e => {
        let coins = document.querySelector(".coins").children



        if (toggleChoice.length == 6) {
            $("h3").css("color", "red").css("font-weight", 900)
        }
        else {
            $(".screen-container").hide()

            for (const coin of toggleChoice) {
                let coo = coins.item(coin.number)
                coo = coo.children.item(0)
                coo = coo.children.item(1)
                coo = coo.children.item(0)
                console.log(coo);
                $(coo).prop("checked", true)
            }
            for (const coin of notChoose) {
                let coo = coins.item(coin.number)
                coo = coo.children.item(0)
                coo = coo.children.item(1)
                coo = coo.children.item(0)
                $(coo).prop("checked", false)
            }

        }
    })

    $(".cancelBTN").click(e => {
        let coins = document.querySelector(".coins").children

        $(".screen-container").hide()

        let coin = toggleChoice[5]
        let coo = coins.item(coin.number)
        coo = coo.children.item(0)
        coo = coo.children.item(1)
        coo = coo.children.item(0)
        $(coo).prop("checked", false)

    })


})

function creatCoin(currentCoin, idNum, toggleChoice, notChoose) {

    // Create all the elements in the task
    let coin = $("<div></div>").addClass("card-body").attr("id", `coin${idNum}`)
    let coinRow = $("<div></div>").addClass("row")
    let coinSymbol = $("<h5></h5>").addClass("card-title").text(currentCoin.symbol)
    let switchToggle = $("<div></div>").addClass("custom-control custom-switch")
    let toggleInp = $("<input>").addClass("custom-control-input").attr("type", "checkbox").attr("id", `live_reports${idNum}`)
    let toggleLabel = $("<label></label>").addClass("custom-control-label").attr("for", `live_reports${idNum}`)
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
    let counter = 0
    $(moreInfoBTN).click(function (e) {
        counter++

        if (counter % 2 == 1) {
            let moreInfoCollapse = e.target.parentElement.lastChild
            $(moreInfoCollapse).show()

            let keys = Object.keys(localStorage)

            let current = $(e.target).prev()
            if (keys.length == 0) {
                creatMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)
            }
            keys.forEach(key => {
                if (keys.find(key => key == $(current).text())) {

                    let value = JSON.parse(localStorage.getItem(key))

                    if ((new Date(value.date).getTime() + 120000) >= new Date().getTime()) {
                        // create more info from localStorage
                        $(imageCoin).attr("src", value.image)
                        $(coinToUSD).text(`USD: ${value.USD}$`)
                        $(coinToEUR).text(`EUR: ${value.EUR}£`)
                        $(coinToILS).text(`ILS: ${value.ILS}₪`)
                    } else {

                        creatMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)

                    }
                } else {
                    creatMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)

                }

            })

        } else {
            $(moreInfoCollapse).hide()
        }

    })

    // Handle the toggle switch
    handleSwitch(toggleInp, toggleChoice, notChoose)

}


function creatMoreInfoFromAPI(id, name, imageCoin, coinToUSD, coinToEUR, coinToILS) {

    $(document).ready(function () {
        $(".waiting-popup").show()
        $.get("https://api.coingecko.com/api/v3/coins/" + id, function (info) {

            $(imageCoin).attr("src", info.image.small)
            $(coinToUSD).text(`USD: ${info.market_data.current_price.usd}$`)
            $(coinToEUR).text(`EUR: ${info.market_data.current_price.eur}£`)
            $(coinToILS).text(`ILS: ${info.market_data.current_price.ils}₪`)

            // save to localStorage
            let d = new Date()

            localStorage.setItem(name, JSON.stringify({

                USD: info.market_data.current_price.usd,
                EUR: info.market_data.current_price.eur,
                ILS: info.market_data.current_price.ils,
                date: d,
                image: info.image.small
            }))
            $(".waiting-popup").hide()
        })
    })


}

function handleSwitch(thisToggle, toggleChoice, notChoose) {

    $(thisToggle).change(e => {
        let curCoinText = e.target.parentElement.parentElement
        curCoinText = $(curCoinText).next().text()
        let curCoinNum = e.target.parentElement.parentElement.parentElement.id.slice(4)


        if (toggleChoice.find(i => i.name == curCoinText)) {
            toggleChoice.splice($.inArray(i, toggleChoice), 1)
        } else {
            toggleChoice.push({ name: curCoinText, number: curCoinNum })
        }

        if (toggleChoice.length >= 6) {
            for (const i of toggleChoice) {

                let choice = $("<div></div>").addClass("coin-choice")
                let coinName = $("<p></p>").text(i.name)
                let switchT = $("<div></div>").addClass("custom-control custom-switch")
                let inpT = $("<input>").addClass("custom-control-input").attr("type", "checkbox").attr("id", i.name).attr("checked", "true")
                let labelT = $("<label></label>").addClass("custom-control-label").attr("for", i.name)

                $(".choices").append(choice)
                $(choice).append(coinName)
                $(choice).append(switchT)
                $(switchT).append(inpT)
                $(switchT).append(labelT)


                let count = 0
                $(inpT).change(e => {
                    count++
                    let name = e.target.parentElement
                    name = $(name).prev().text()

                    if (count % 2 == 1) {
                        toggleChoice.forEach(i => {

                            if (i.name == name) {
                                toggleChoice.splice($.inArray(i, toggleChoice), 1)
                                notChoose.push(i)
                            }
                        })
                    } else {
                        notChoose.forEach(i => {
                            if (i.name == name) {
                                notChoose.splice($.inArray(i, notChoose), 1)
                                toggleChoice.push(i)
                            }
                        })


                    }

                })


            }
            $(".screen-container").show()


        }

    })

}










