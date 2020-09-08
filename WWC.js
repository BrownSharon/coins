let checkedTogglesArray = []
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
        let coinInList = false

        // Check all coins in page 
        for (const coin of coins) {

            let coinTitle = $(coin).find(".card-title")[0]
            coinTitle = $(coinTitle).text();

            // If the string in input is part of the coin name 
            if ((coinTitle.indexOf(e.target.value) > -1) || e.target == "") {
                // Shoe the coin that match
                $(coin).show()
                $(".msg").remove()
                coinInList = true
            } else {
                // Hide the coin if not
                $(coin).hide()
            }

        }
        // If the string in input not match to any coin in page, display error msg
        if (!coinInList) {
            $("main").html("")

            let msg = $("<p></p>").addClass("msg").text("Oooopss... No result found, tray something else")

            $("main").append(msg)
        }
    })

    console.log(checkedTogglesArray);

})

// // // // // // Home page function // // // // // //

// Creating the home page\coins page from API 

function creatHomPage() {
    let idNum = 0
    console.log(checkedTogglesArray)
    $(document).ready(function () {

        // Clean the main section from other page content
        $("main").html("")

        // Activate the search field 
        $(".searchINP").attr("disabled", false)

        // Pop the waiting popup while getting the data from API
        creatWaitingPopup()

        // Getting the data from API
        $.get("https://api.coingecko.com/api/v3/coins/list", function (data) {
            for (let i = 0; i < 100; i++) {
                let currentCoin = $(data)[i];

                // Make sure the coins that shows in the page will be with More Info data from the beginning 
                $.get("https://api.coingecko.com/api/v3/coins/" + currentCoin.id, function (info) {

                    if (info.market_data.current_price.usd || info.market_data.current_price.eur || info.market_data.current_price.ils) {

                        // Creating the coins cards 
                        creatCoin(currentCoin, idNum)
                        idNum++
                    }
                })

            }
            let coins = $(".card-body")
            for (const toggle of checkedTogglesArray) {
                let num = toggle.number.replace(/\D/g, '')
                let coin = coins[num]
                coin = $(coin).find("input")
                $(coin).prop("checked", true)
            }

            // Delete the waiting popup 
            $(".waiting-popup").remove()
        })
    })
}

// Creating the pop up the pop while waiting to fetch the data from API 
function creatWaitingPopup() {
    let div = $("<div></div>").addClass("waiting-popup")
    let img = $("<img>").addClass("waiting-coin").attr("src", "images/1716e77877197a3958cd656574820ee1.gif").attr("alt", "progress bar")

    $("body").prepend(div)
    $(div).append(img)
}

// Creating each coin with all it's fetchers
function creatCoin(currentCoin, idNum) {

    // Create all the elements in the task
    let coin = $("<div></div>").addClass("card-body").attr("id", `coin${idNum}`)
    let coinRow = $("<div></div>").addClass("row")
    let coinSymbol = $("<h5></h5>").addClass("card-title").text(currentCoin.symbol)
    let switchToggle = $("<div></div>").addClass("control-div")
    let toggleInp = $("<input>").addClass("coinToggle").attr("type", "checkbox").attr("id", `live_reports${idNum}`)
    let toggleLabel = $("<label></label>").addClass("switch").attr("for", `live_reports${idNum}`)
    let slider = $("<span></span>").addClass("slider round")
    let coinName = $("<p></p>").addClass("card-text").text(currentCoin.name)
    let moreInfoBTN = $("<button></button>").addClass("btn btn-warning moreInfoBTN").text("More Info").attr("data-toggle", "collapse").attr("data-target", "#more_info").attr("aria-controls", "more_info").attr("aria-expanded", "false")
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
    $(switchToggle).append(toggleLabel)
    $(toggleLabel).append(toggleInp)
    $(toggleLabel).append(slider)
    $(coin).append(coinName)
    $(coin).append(moreInfoBTN)
    $(coin).append(moreInfoCollapse)
    $(moreInfoCollapse).append(moreInfoContainer)
    $(moreInfoContainer).append(contCoin)
    $(contCoin).append(coinToUSD)
    $(contCoin).append(coinToEUR)
    $(contCoin).append(coinToILS)
    $(moreInfoContainer).append(imageCoin)

    // Handle More Info button

    $(moreInfoBTN).click(function (e) {
        // Creat array from localStorage keys
        let keys = Object.keys(localStorage)

        // Extract coin name of the card been clicked
        let thisCoinName = $(e.target).prev().text()


        // If localStorage empty, fetch the info from API
        if (keys.length == 0) {
            getMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)
        } else {
            // If localStorage full, check if there is a key with the same name of the coin been clicked 
            let found = false
            keys.forEach(key => {
                if (key == thisCoinName) {
                    found = true
                    // If found extract data from localStorage
                    let value = JSON.parse(localStorage.getItem(key))

                    let localStorageDate = new Date(value.date).getTime()

                    let nowDate = new Date().getTime()


                    console.log(localStorageDate, nowDate);
                    // Check if passed less then 2 minutes 
                    if ((localStorageDate + 120000) >= nowDate) {
                        console.log("value")
                        // Create data from localStorage
                        $(imageCoin).attr("src", value.image)
                        $(coinToUSD).text(`USD: ${value.USD}$`)
                        $(coinToEUR).text(`EUR: ${value.EUR}£`)
                        $(coinToILS).text(`ILS: ${value.ILS}₪`)
                    } else {
                        // If passed more then 2 minutes create the data from API
                        getMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)

                    }
                }
            })

            // If there wasn't any key equal to coin name been clicked
            if (!found) {
                console.log("test2");
                getMoreInfoFromAPI(currentCoin.id, currentCoin.name, imageCoin, coinToUSD, coinToEUR, coinToILS)
            }

        }

        // Show/hide the collapse element
        $(moreInfoCollapse).toggle()

    })

    // Handle the toggle switch

    handleHomepageToggles(toggleInp)

}

// Fetch and place in variable the data from API and save to localStorage 
function getMoreInfoFromAPI(id, name, imageCoin, coinToUSD, coinToEUR, coinToILS) {
    
    $(document).ready(function () {
        // Pop the waiting popup while fetching the data from Api
        creatWaitingPopup()

        // Go to the API
        $.get("https://api.coingecko.com/api/v3/coins/" + id, function (info) {

            // Placing the data API in the collapse elements 
            $(imageCoin).attr("src", info.image.small)
            $(coinToUSD).text(`USD: ${info.market_data.current_price.usd}$`)
            $(coinToEUR).text(`EUR: ${info.market_data.current_price.eur}£`)
            $(coinToILS).text(`ILS: ${info.market_data.current_price.ils}₪`)

            // Save to localStorage with date 
            let dateInfo = new Date()
            dateInfo = dateInfo.toString()

            localStorage.setItem(name, JSON.stringify({
                date: dateInfo,
                USD: info.market_data.current_price.usd,
                EUR: info.market_data.current_price.eur,
                ILS: info.market_data.current_price.ils,
                image: info.image.small
            }))

            // Remove the waiting popup 
            $(".waiting-popup").remove()
        })
    })


}

// Managing the toggles status checked\not in array and pop the toggles manage popup in the 6th checked toggle   
function handleHomepageToggles(thisToggle) {
    
    // Creat empty array to manage the checked toggles
    checkedTogglesArray = []

    // When clicking and changing toggle status
    $(thisToggle).change(e => {

        // Place in the array all the toggles that checked in the var
        checkedTogglesArray = creatArrayOfCheckedToggles()

        // Check if the array contain more then 5 elements 
        if (checkedTogglesArray.length == 6) {

            // Creat an object that contain the last coin that it's toggle was prest for canceling option  
            let name = $(e.target).parent().parent().parent().next().text()

            let lastChecked = { name: name, number: e.target.id }

            // Pop the managing toggles popup
            creatPopUpToggleHandler(lastChecked, checkedTogglesArray)
        }

    })

}

// Creat array of checked toggles in coin page
function creatArrayOfCheckedToggles() {
    // Creat an empty array
    let togglesArray = []

    let toggles = $(`.coinToggle`)

    // Check all toggles status of the coins in page 
    for (const toggle of toggles) {
        
        // If the toggle status is checked 
        if (toggle.checked) {

            // Push the specific coin data to array
            let name = $(toggle).parent().parent().parent().next().text()
            togglesArray.push({ name: name, number: toggle.id })
        }

    }
    // Return the array
    return togglesArray
}

// creat the managing toggles popup 
function creatPopUpToggleHandler(lastChecked, checkedTogglesArray) {

    let container = $("<div></div>").addClass("screen-container")
    let popupT = $("<div></div>").addClass("handle-toggle")
    let title = $("<h3></h3>").text("Choose 5 out of 6 for Live reports")
    let choices = $("<div></div>").addClass("choices")

    $("body").append(container)
    $(container).append(popupT)
    $(popupT).append(title)
    $(popupT).append(choices)

    // Creat the list of coins from the checked toggle array
    for (let i = 0; i < checkedTogglesArray.length; i++) {
        let toggleItem = checkedTogglesArray[i];
        creatToggleItemList(toggleItem)
    }


    let buttonsDiv = $("<div></div>").addClass("decision-buttons")
    let saveBTN = $("<button></button>").addClass("saveBTN btn-success").text("save")
    let cancelBTN = $("<button></button>").addClass("cancelBTN btn-danger").text("cancel")

    $(popupT).append(buttonsDiv)
    $(buttonsDiv).append(saveBTN)
    $(buttonsDiv).append(cancelBTN)

    // All the managing of the coins in the popup
    handlePopupToggle(lastChecked, checkedTogglesArray)

}

// Creat the coin item from array in the popup managing toggles 
function creatToggleItemList(toggleItem) {

    let choice = $("<div></div>").addClass("coin-choice")
    let coinName = $("<p></p>").text(toggleItem.name)
    let switchT = $("<div></div>").addClass("control-div")
    let inpT = $("<input>").addClass("toggle-item").attr("type", "checkbox").attr("id", `item${toggleItem.number}`).attr("checked", "true")
    let labelT = $("<label></label>").addClass("switch").attr("for", `item${toggleItem.number}`)
    let slider = $("<span></span>").addClass("slider round")


    $(".choices").append(choice)
    $(choice).append(coinName)
    $(choice).append(switchT)
    $(switchT).append(labelT)
    $(labelT).append(inpT)
    $(labelT).append(slider)

}

// Manege the managing toggles popup 
function handlePopupToggle(lastChecked, checkedToggleArray) {
    // creating an empty array to manege the toggles coin status in the popup
    let currentCheckedTogglesArray = []
    
    // When toggle coin status change
    $(".toggle-item").change(() => {

        // Empty the array
        currentCheckedTogglesArray = []
        let toggles = $(`.toggle-item`)

        // Check all the status toggle in popup
        for (const toggle of toggles) {
            
            // If the specific toggle is checked
            if (toggle.checked) {

                // Push the toggle data to array
                let name = $(toggle).parent().parent().prev().text()

                currentCheckedTogglesArray.push({ name: name, number: toggle.id })
            }
        }
        
    })

    // When clicking on the save button 
    $(".saveBTN").click(() => {

        // If there is more then 5 coins toggle in status checked
        if (currentCheckedTogglesArray.length > 5) {
            // In-light the instruction in the title
            $("h3").css("color", "red").css("font-weight", 900)
        }
        // If there is less then 5 coins toggle in status checked
        else {

            // Remove the managing toggles popup
            $(".screen-container").remove()

            // Clear all toggles from page
            let coins = $(".card-body")
            // Going on just on the coins that saved in the array of the main page managing array
            for (const toggle of checkedToggleArray) {
                let num = toggle.number.replace(/\D/g, '')
                let coin = coins[num]
                coin = $(coin).find("input")
                $(coin).prop("checked", false)
            }

            // Clear the main array
            checkedToggleArray = []

            // Change the status coins toggles to check just in the coins from the array of managing toggle popup 
            for (const toggle of currentCheckedTogglesArray) {
                let num = toggle.number.replace(/\D/g, '')
                let coin = coins[num]
                coin = $(coin).find("input")
                $(coin).prop("checked", true)
            }

        }
        // Remove the managing toggles popup
        $(".screen-container").remove()


    })

    // When cancel button is clicked
    $(".cancelBTN").click(() => {

        // Change the status of the last coin toggle that was checked back to unchecked
        let coins = $(".card-body")
        let num = lastChecked.number.replace(/\D/g, '')
        let coin = coins[num]

        coin = $(coin).find("input")

        $(coin).prop("checked", false)

        // Remove the managing toggles popup
        $(".screen-container").remove()

        checkedToggleArray = []
    })

}

// // // // // // About page // // // // // //

// Creating the about page
function creatAboutPage() {

    $(document).ready(function () {
        
        // Clean the main section from other page content 
        $("main").html("")

        // Disabled the search field 
        $(".searchINP").attr("disabled", true)

        // Creat the elements in the page
        let title = $("<h2></h2>").text("A little bit (coin) About the site author")
        let parallax = $("<div></div>").addClass("parallax2")
        let section = $("<div></div>").addClass("section")
        let spanH = $("<p></p>").text("My name is Sharon Brown,")
        let spanH2 = $("<p></p>").text("Born and raised in Israel Ra'anana.")
        let spanStart = $("<p></p>").text("I started a startup with my best partner in 2002, and from then we had 4 big software products:")
        let dor =$("<p></p>").text("The first one we named “Dor” on behalf of the new generation of products we started. This product has a lot of features in it’s latest release version 16.10. Its specialty is soccer, trampoline flips, hanging with friends and sleep.")
        let spenD =$("<p></p>").text("The second product we made 3 years after the first one to establish our status in the economic world to be a serious company with more than one product.")
        let bnaya =$("<p></p>").text("We named it “Bnaya”. The first couple of releases of this product we had a lot of production bugs. It used to give an output in all sorts of ways we didn't know it could do. After a year we managed to stabilize the versions, and today in version number 13.09 the product is unique , user friendly and smart. We got the best user opinion about it. It's specialty is gaming, soccer and hockey.  These two products complete each other, in there's abilities.")
        let maayan =$("<p></p>").text("After “bnaya” we moved our headquarters to a new building with more work space, and developed our third product we named “ma’ayan”. This product also has its own unique  behavior. We managed to stabilize the last couple of versions, but there are still a couple of production bugs that we don't find the pattern, or the trigger that caused them. With all that been said the product is user friendly with AI and features that only it has. Happiness spreading, artistic tendency, and the power of stand alone products. The last version of “Ma’ayan” is 10.05.pro.")
        let haggay =$("<p></p>").text("The fourth and last product we named “Haggay”, this product is still young, having bugs in sleep mode, and specially in closing releases that need to be done manually, and in the integration in other development environments without our technical support. Last version is 5.06 as a bug in the frontend css in the header tag that lost one present of the attribute “front teeth” ")
        let spanEnd1 = $("<p></p>").text("Hope to have more collaboration with other companies in the future, for further growth of the   company.")
        let spanEnd2 = $("<p></p>").text("Best regards")
        let spanEnd3 = $("<p></p>").text("Sharon Brown CEO")
        
        let mainInfo = $("<div></div>").addClass("about-info")
        

        // Combine everything together
        $("main").append(parallax)
        $(parallax).append(section)
        $(section).append(title)
        // $(section).append(img)
        $(section).append(mainInfo)
        $(mainInfo).append(spanH)
        $(mainInfo).append(spanH2)
        $(mainInfo).append(spanStart)
        $(mainInfo).append(dor)
        $(mainInfo).append(spenD)
        $(mainInfo).append(bnaya)
        $(mainInfo).append(maayan)
        $(mainInfo).append(haggay)
        $(mainInfo).append(spanEnd1)
        $(mainInfo).append(spanEnd2)
        $(mainInfo).append(spanEnd3)

    })
}



















