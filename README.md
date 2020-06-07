# Anghami-Extension

This chrome extension detects when you visit a Youtube music video and generates a link to the song in Anghami.
To use it just open the youtube music video and the extension will run on its own, you can also click the extension icon to run the script.

To get this wroking you need to fill in the variables at the top of background.js with:
1. Anghami API key
2. Youtube API key

### How to install
This is extension isn't published, so we need to load it as an unpacked chrome extension. To do that visit the extensions settings page -> enable developer mode -> load unpacked extension -> load extension folder

Things to improve would be:
+ refining search even more (utilize artist name for instance), as it stands this script trys to clean video titles from irrelevant info but is not prefect (it removes phrases like "Official Music Video", "Audio", etc...).
+ valdiating the right song before suggesting it
