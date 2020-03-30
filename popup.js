function getURL() {
    chrome.runtime.sendMessage({greeting: "GetURL"},
        function (response) {
            tabURL = response.URL;
            console.log(tabURL);
            console.log("We're here");
            document.getElementById("link").innerHTML = document.getElementById("link").innerHTML + "<a href=" + tabURL + ">" + tabURL + "</a>";
        });
}

getURL();
