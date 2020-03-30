const regex = RegExp(".*://.*\.youtube\.com/.*"); //regex to checjk if we vist youtube
youtubeKey = ""; //this our Youtube API key
anghamiKey = "";
var finalLink = "";
//Our event listeners 1. button click 2.we visit youtube
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

    let url = tabs[0].url;
    if (regex.test(url)) { //check if we visted youtube
      console.log("Button triggered : " + url);
      videoID = getParameterByName('v',url);
      console.log("Youtube! ID " + videoID);
      if (videoID != null){
      //get video title
      getYoutubeTitle(videoID);

    }
    else {
      console.log("Not valid url !");
    }
    }
    else
    {
      console.log("Not valid url !");
    }

    });
});

//called whenever the URL changes (new tab, redirect, ...)
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log(changeInfo.url);
    if (regex.test(changeInfo.url)) { //check if the new URL is on youtube or not
      //get the video ID from the url:
      videoID = getParameterByName('v',changeInfo.url);
      console.log("Youtube! ID " + videoID);
      if (videoID != null){
      //get video title
      getYoutubeTitle(videoID);
    }
      else {
        console.log("Not valid url!");
      }
    }
    else
    {
      console.log("Not valid url!");
    }
});

//searchAnghami
function searchAnghami(title)
 {
   console.log("Searching Anghami for :" + title);
   request ='https://bus.anghami.com/public/search?query=' + title + "&searchtype=song";

   var xhr = new XMLHttpRequest();
   xhr.open('GET', request, true);
   xhr.setRequestHeader("XAT", 'interns');
   xhr.setRequestHeader("XATH", anghamiKey);
   xhr.send();
   xhr.addEventListener("readystatechange", processRequest, false);
       
   function processRequest(e) {
     if (xhr.readyState == 4 && xhr.status == 200) {
         console.log(xhr.responseText);
           var response = JSON.parse(xhr.responseText);
           // console.log(response["results"][0]["title"]);
           // console.log(response["results"][0]["id"]);

          // shareURL = "https://play.anghami.com/song/" + response["results"][0]["id"];
           shareURL = "https://play.anghami.com/song/" + response["results"][0]["id"];
           window.open("popup.html", "extension_popup", "width=300,height=50,status=no,scrollbars=yes,resizable=no");
           finalLink = shareURL;
          console.log(shareURL);
         }
   }
 }

function getYoutubeTitle(videoID)
{
  //get information about video, specifically we want to know if it is a music video and the video title as well
  request = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+ videoID + "&key=" + youtubeKey;
  //generic http request
  var xhr = new XMLHttpRequest();
  xhr.open('GET', request, true);
  xhr.send();
  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) { //good request
          var response = JSON.parse(xhr.responseText);
          //console.log(response); //for debugging

          categoryId = response["items"][0]["snippet"]["categoryId"];
          title = response["items"][0]["snippet"]["title"];
          //categoryId 10 is youtube's category for music videos
          if (categoryId == 10) //if the video is a music video
          {
            console.log("TITLE : " + title);
            //we have to devote the anghami search request to the background script to comply with chrome's security policy
            //check it out: https://www.chromium.org/Home/chromium-security/extension-content-script-fetches

            //search for it on anghami
            console.log("Going to search for : " + title);
            searchAnghami(title);
          }
          else {
            console.log("Not a song");
          }
        }

  }

}
//eventlistener to popup.js
chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "GetURL" )
    {
            sendResponse( {URL:finalLink} );
    }
});


//HELPER FUCNTIONS SLEEP HERE IN THE BASEMENT
 //pulled from stackoverflow : https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 function getParameterByName(name, url) {
     if (!url) url = window.location.href;
     name = name.replace(/[\[\]]/g, '\\$&');
     var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
         results = regex.exec(url);
     if (!results) return null;
     if (!results[2]) return '';
     return decodeURIComponent(results[2].replace(/\+/g, ' '));
 }
