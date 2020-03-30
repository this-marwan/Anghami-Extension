//This script is triggered whenever you visi a youtube page
youtubeKey = "AIzaSyAbCjKQT1A126NKe-EvOz4y8RUUv70N6GA"; //this our Youtube API key

url = window.location.href; //get the url of the current page - it holds the video ID
//get the video ID from the url:
videoID = getParameterByName('v',url);
console.log(videoID);

//get information about video, specifically we want to know if it is a music video and the video title as well
request = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+videoID+"&key=" + youtubeKey;

//generic http request
var xhr = new XMLHttpRequest();
xhr.open('GET', request, true);
xhr.send();
xhr.addEventListener("readystatechange", processRequest, false);
 
function processRequest(e) {
  if (xhr.readyState == 4 && xhr.status == 200) { //good request
        var response = JSON.parse(xhr.responseText);

        console.log(response); //for debugging

        categoryId = response["items"][0]["snippet"]["categoryId"];
        title = response["items"][0]["snippet"]["title"];
        //categoryId 10 is youtube's category for music videos
        if (categoryId == 10) //if the video is a music video
        {
          console.log("Sending message");
          //search for it on anghami now
          //we have to devote the anghami search request to the background script to comply with chrome's security policy
          //check it out: https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
          chrome.runtime.sendMessage({title: title}, function(response) {
          console.log(response.farewell);
          });
        }
        else {
          console.log("Not a song");
        }
      }
}
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
