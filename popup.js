function getURL() {
    chrome.runtime.sendMessage({greeting: "GetURL"}, function(response){respond(response)})
  function respond (response) {
    console.log(response);
          if (response.STATUS == "success"){
            tabURL = response.URL;
            document.getElementById("link").innerHTML = "Continue jamming on the go right here : <a href=" + tabURL + ">" + tabURL + "</a>";
          }
          else if (response.STATUS == "youtube"){
            document.getElementById("link").innerHTML = "Not a valid youtube link";
          }
          else if (response.STATUS == "notsong"){
            document.getElementById("link").innerHTML = "Doesn't seem to be a song";
          }
          else if (response.STATUS == "error"){
            document.getElementById("link").innerHTML = "Woops something went wrong :/";
          }
          else{
            document.getElementById("link").innerHTML = "Just a sec";
          }
        };
}
getURL();
