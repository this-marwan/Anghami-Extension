// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log("Running content script");
  chrome.tabs.executeScript(null, {file :"content.js"});
});

chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.url) {
      // do something here
      console.log(changeInfo.url);

    }
  }
);

console.log("CATCH YOUR ATTENTION")
// console.log(url)
chrome.runtime.onMessage.addListener(function(message, callback) {
         console.log("got message");
         console.log(message["title"]);
         searchAnghami(message["title"]);
 });

var shareURL = "";
 function searchAnghami(title)
 {
   request ='https://bus.anghami.com/public/search?query=' + title + '&searchtype=song';

   var xhr = new XMLHttpRequest();
   xhr.open('GET', request, true);
   xhr.setRequestHeader("XAT", 'interns');
   xhr.setRequestHeader("XATH", '');
   xhr.send();
   xhr.addEventListener("readystatechange", processRequest, false);
   xhr.onreadystatechange = processRequest;
    
   function processRequest(e) {
     if (xhr.readyState == 4 && xhr.status == 200) {
         console.log(xhr.responseText);
           var response = JSON.parse(xhr.responseText);
           console.log("Marwan look here:");
           console.log(response["results"][0]["title"]);
           console.log(response["results"][0]["id"]);

          // shareURL = "https://play.anghami.com/song/" + response["results"][0]["id"];
           shareURL = "https://play.anghami.com/song/" + response["results"][0]["moreVersions"][0]["id"];
           window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");

             // time to partay!!!
             console.log(shareURL);
         }
   }
 }

 chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
 {
     if( request.greeting === "GetURL" )
     {
             sendResponse( {URL:shareURL} );
     }
 });
