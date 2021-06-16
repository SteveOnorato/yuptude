# What is this?

A bookmarklet for controlling video playback for almost any website.

This is my fork of yuptude (https://github.com/Pepck/yuptude), adding some features that I wanted:
* Avoid UI getting stuck on page when launched multiple times.
* Keep speed/pitch after closing the UI.
* Restore the previous speed/pitch to the UI when launched again.
* Open yuptude link in a new tab.
* Keyboard shortcuts
  * Q: Skip backward
  * W: Pause/Play
  * E: Skip forward
  * A: Slow down
  * S: Reset to 1x speed
  * D: Speed up

## Install 

https://steveonorato.github.io/yuptude/

## More details

### Known issues

* Doesn't work if the video is within an iframe.  The JavaScript isn't allowed to traverse into that part of the DOM.

### Notes

Would be nice to detect the iframe issue and toggle a little warning icon.

Some sites already map 'f' to 'Toggle Full Screen', so avoid that key mapping.

Really should automate this all soon, but for now I'm using https://chriszarate.github.io/bookmarkleter/ to make the .js files into draggable bookmarklets.
I enable:
* URL-encode reserved characters: [space], %, ", <, >, #, @, &, ?
* Wrap in an IIFE (anonymizing function).
* Minify code using Babel Minify. 
