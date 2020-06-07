const regex = RegExp(".*://.*\.youtube\.com/.*"); //regex to checjk if we vist youtube
youtubeKey = ""; //this our Youtube API key
anghamiKey = "";
var finalLink = "";
var status;

//searchAnghami
const searchAnghami = function(title){
  console.log("getting title " + title);
  return new Promise(function(resolve, reject) {
   request ='https://bus.anghami.com/public/search?query=' + title + "&searchtype=song";
   shareURL = ""
   var xhr = new XMLHttpRequest();
   xhr.open('GET', request, true);
   xhr.setRequestHeader("XAT", 'interns');
   xhr.setRequestHeader("XATH", anghamiKey);
   xhr.send();
   xhr.addEventListener("readystatechange", processRequest, false);
       
   function processRequest(e) {
     if (xhr.readyState == 4 && xhr.status == 200) {
           var response = JSON.parse(xhr.responseText);
           console.log(response);
           if (!response.hasOwnProperty("results")) {
             status = "error"
             reject({URL:shareURL, STATUS : status})
           }
           shareURL = "https://play.anghami.com/song/" + response["results"][0]["id"];
           status = "success";
           resolve({URL:shareURL, STATUS : status});
         }
       }
     })
}

const getYoutubeTitle = function(videoID) {
  console.log("getting song " + videoID);
  return new Promise(function(resolve, reject) {
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
          console.log(response);
          // if (!response["items"][0]["snippet"]["categoryId"])
          // {
          //   status = "error"
          //   reject({URL:finalLink, STATUS : status})
          // }
          categoryId = response["items"][0]["snippet"]["categoryId"];
          title = response["items"][0]["snippet"]["title"];
          //categoryId 10 is youtube's category for music videos
          if (categoryId == 10) //if the video is a music video
          {
            resolve(titleCleaner(title))
          }
          else {
            console.log("Not song");
            status = "notsong"
            reject({URL:finalLink, STATUS : status})
          }
        }
      }
})
}

//eventlistener to popup.js

chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
  var videoID;
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    if (regex.test(url)) { //check if we visted youtube
      videoID = getParameterByName('v',url);
    }
    else {
      status = "youtube";
      sendResponse( {URL:finalLink, STATUS : status})
      return;
    }

      if (videoID != null){
      //get video title
        getYoutubeTitle(videoID)
                  .then(searchAnghami)
                  .then(sendResponse)
                  .catch(sendResponse)
      }
      else {
      console.log("Not valid url !");
      status = "notsong"
      sendResponse( {URL:finalLink, STATUS : status})
      }

  })

return true;
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

 function titleCleaner(title){
   //this removes uneccessary common elements of a youtube video title - supposedly will improve search results
   title = title.replace(/[[(]?(Official)? (Music )?(Video|Audio)[\])]?/g,"")
   title = title.replace(/\\(Official\\)|\\(Audio\\)/g,"")
   title = title.replace(/\(?Official\)?/g,"")
   title = title.replace(/-/g," ")
   title = title.replace(/\(/g," ")
   title = title.replace(/\)/g," ")
   title = title.replace(/\s+/g," ")
   console.log("title" + title);


   return title;
 }
