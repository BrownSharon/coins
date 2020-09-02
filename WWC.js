$(() => {

    // Loading/reloading the site 

    creatHomPage()

    // Handle the navigation 
    $(".aboutBTN").click(creatAboutPage)

    $(".homeBTN").click(creatHomPage)

    // Search handle
    // Partial and on-going search

    $(".searchINP").on("input", (e) => {

        let coins = $(".card-body")
        let counter = 0


        for (const coin of coins) {

            let coinTitle = $(coin).find(".card-title")[0]
            coinTitle = $(coinTitle).text();

            if ((coinTitle.indexOf(e.target.value) > -1) || e.target == "") {
                $(coin).show()
                $(".msg").remove()
                counter++
            } else {
                $(coin).hide()
            }

        }

        if (counter == 0) {

            creatErrorSearchMSG()
        }
    })

})

// Creat Functions

function creatHomPage() {
    let idNum = 0

    $(document).ready(function () {
        $("main").html("")
        $(".searchINP").attr("disabled", false)
        creatWaitingPopup()
        $.get("https://api.coingecko.com/api/v3/coins/list", function (coins) {
            for (let coin = 0; coin < 100; coin++) {
                let currentCoin = $(coins)[coin];

                $.get("https://api.coingecko.com/api/v3/coins/" + currentCoin.id, function (info) {

                    if (info.market_data.current_price.usd || info.market_data.current_price.eur || info.market_data.current_price.ils) {
                        creatCoin(currentCoin, idNum)
                        idNum++
                    }
                })

            }
            $(".waiting-popup").remove()
        })
    })
}

function creatAboutPage() {
    $(document).ready(function () {
        $("main").html("")
        $(".searchINP").attr("disabled", true)
        creatWaitingPopup()
        // let container = $("<div></div>").addClass("container")
        let title = $("<h2></h2>").text("A little bit About this site")
        let section = $("<div></div>").addClass("section")
        let img = $("<img>").addClass("about-img").attr("src", "").attr("alt", "")
        let mainInfo = $("<p></p>").addClass("about-info").text("")

        // $("main").append(container)
        $("main").append(title)
        $("main").append(section)
        $(section).append(img)
        $(section).prepend(mainInfo)
        $(".waiting-popup").remove()
    })
}

function creatCoin(currentCoin, idNum) {

    // Create all the elements in the task
    let coin = $("<div></div>").addClass("card-body").attr("id", `coin${idNum}`)
    let coinRow = $("<div></div>").addClass("row")
    let coinSymbol = $("<h5></h5>").addClass("card-title").text(currentCoin.symbol)
    let switchToggle = $("<div></div>").addClass("custom-control custom-switch")
    let toggleInp = $("<input>").addClass("custom-control-input coinToggle").attr("type", "checkbox").attr("id", `live_reports${idNum}`)
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
    $("main").append(coin)
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
                getMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)
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

                        getMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)

                    }
                } else {
                    getMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)

                }

            })

        } else {
            $(moreInfoCollapse).hide()
        }

    })

    // Handle the toggle switch

    handleHomepageToggles(toggleInp)

}

function creatPopUpToggleHandler(lastChecked, checkedTogglesArray) {

    let container = $("<div></div>").addClass("screen-container")
    let popupT = $("<div></div>").addClass("handle-toggle")
    let title = $("<h3></h3>").text("Choose 5 out of 6 for Live reports")
    let choices = $("<div></div>").addClass("choices")

    $("body").append(container)
    $(container).append(popupT)
    $(popupT).append(title)
    $(popupT).append(choices)

    for (let i = 0; i < checkedTogglesArray.length; i++) {
        let toggleItem = checkedTogglesArray[i];
        creatToggleItemList(toggleItem)
    }
    creatToggleItemList(lastChecked)
    checkedTogglesArray.push(lastChecked)

    let buttonsDiv = $("<div></div>").addClass("decision-buttons")
    let saveBTN = $("<button></button>").addClass("saveBTN btn-success").text("save")
    let cancelBTN = $("<button></button>").addClass("cancelBTN btn-danger").text("cancel")

    $(popupT).append(buttonsDiv)
    $(buttonsDiv).append(saveBTN)
    $(buttonsDiv).append(cancelBTN)

    handlePopupToggle(lastChecked, checkedTogglesArray)

}

function creatToggleItemList(toggleItem) {

    let choice = $("<div></div>").addClass("coin-choice")
    let coinName = $("<p></p>").text(toggleItem.name)
    let switchT = $("<div></div>").addClass("custom-control custom-switch")
    let inpT = $("<input>").addClass("custom-control-input toggle-item").attr("type", "checkbox").attr("id", `item${toggleItem.number}`).attr("checked", "true")
    let labelT = $("<label></label>").addClass("custom-control-label").attr("for", `item${toggleItem.number}`)

    $(".choices").append(choice)
    $(choice).append(coinName)
    $(choice).append(switchT)
    $(switchT).append(inpT)
    $(switchT).append(labelT)
   
}

function creatWaitingPopup() {
    let div = $("<div></div>").addClass("waiting-popup")
    let img = $("<img>").addClass("waiting-coin").attr("src", "images/1716e77877197a3958cd656574820ee1.gif").attr("alt", "progress bar")

    $("body").prepend(div)
    $(div).append(img)
}

function creatErrorSearchMSG() {

    let msg = $("<p></p>").addClass("msg").text("Oooopss... No result found, tray something else")

    $("main").append(msg)


}

function creatArrayOfCheckedToggles() {
    let checkedTogglesArray = []

    let toggles = $(`.coinToggle`)

    for (const toggle of toggles) {
        if (toggle.checked) {
            
            let name = $(toggle).parent().parent().next().text()
            checkedTogglesArray.push({ name: name, number: toggle.id })
        }


    }
    return checkedTogglesArray
}


// Handle Function

function getMoreInfoFromAPI(id, name, imageCoin, coinToUSD, coinToEUR, coinToILS) {

    $(document).ready(function () {
        creatWaitingPopup()
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
            $(".waiting-popup").remove()
        })
    })


}

function handlePopupToggle(lastChecked, checkedToggleArray) {
    let currentCheckedTogglesArray = []
    $(".toggle-item").change(() => {
        currentCheckedTogglesArray = []
        let toggles = $(`.toggle-item`)

        for (const toggle of toggles) {
            if (toggle.checked) {

                let name = $(toggle).parent().prev().text()

                currentCheckedTogglesArray.push({ name: name, number: toggle.id })
            }
        }
        console.log(currentCheckedTogglesArray);
        
        
    })

    $(".saveBTN").click(() => {
       
        if (currentCheckedTogglesArray.length > 5) {
            $("h3").css("color", "red").css("font-weight", 900)
        }
        else {
            $(".screen-container").remove()

            // clear all toggles
            let coins = $(".card-body")
            
            for (const toggle of checkedToggleArray) {
                let num = toggle.number.replace(/\D/g, '')
                let coin = coins[num]
                coin = $(coin).find("input")
                $(coin).prop("checked", false)
            }
            checkedToggleArray = []
            
            for (const toggle of currentCheckedTogglesArray) {
                let num = toggle.number.replace(/\D/g, '')
                let coin = coins[num]
                coin = $(coin).find("input")
                $(coin).prop("checked", true)
            }

        }

        $(".screen-container").remove()
       

    })

    $(".cancelBTN").click(() => {

        let coins = $(".card-body")
        let num = lastChecked.number.replace(/\D/g, '')
        let coin = coins[num]

        coin = $(coin).find("input")

        $(coin).prop("checked", false)

        $(".screen-container").remove()
        
        checkedToggleArray = []
    })

}

function handleHomepageToggles(thisToggle) {
    let checkedTogglesArray = []
    $(thisToggle).change(e => {
        checkedTogglesArray = creatArrayOfCheckedToggles()
        
        if (checkedTogglesArray.length == 6) {
            checkedTogglesArray.pop()
            let name = $(e.target).parent().parent().next().text()

            let lastChecked = { name: name, number: e.target.id}
            console.log(checkedTogglesArray)
            creatPopUpToggleHandler(lastChecked, checkedTogglesArray)
        } 

    })

}











