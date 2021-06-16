/**
 * Steve's yuptude fork v1
 * yuptude is a tiny bookmarklet that you can use to speed up or slow down videos in your browser.
 */

//getElementById helper function
function dg(ID) {
    return document.getElementById(ID);
}

if (dg("yptd") !== null) {
  console.log("yuptude's already running!");
  return;
}
console.log('Starting yuptude!');

//Videos on the page
var videos;
//Individual video element
var v;
//Speed value from manual input field
var inputval;
//Container for yuptude widget
var ytw = document.createElement("div");
//Minified contents of the yuptude css & html files
ytw.innerHTML = '<style id="yptd-style">\
            #yptd span,#yptd-box{float:left;padding:0 .5em;display:block}#yptd span em,#yptd-bottom,#yptd-in{vertical-align:middle}#yptd-pit,#yptd-pit input{float:right}#yptd a,#yptd-bar{background-color:#fd0d5d}#yptd{z-index:9999999999;position:fixed;bottom:0;left:6px;font:16px Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}#yptd *{margin:0}#yptd a{border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;float:left;margin:0 .5em 0 0;padding:.25em 1em;font-weight:700;color:#FFF}#yptd a em{font-size:.9em}#yptd a:active,#yptd a:focus,#yptd a:hover{outline:0;color:#fd0d5d;background-color:#FFF;text-decoration:none}#yptd span{border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;margin:.5em;width:2.5em;border-bottom:2px solid rgba(0,0,0,.25);text-decoration:none;color:#000;background-color:#FFF;cursor:pointer;text-align:center}#yptd span em{font-size:.75em}#yptd span:active,#yptd span:focus,#yptd span:hover{color:#fd0d5d}#yptd-bar{border-radius:3px 3px 0 0;-moz-border-radius:3px 3px 0 0;-webkit-border-radius:3px 3px 0 0;height:2.25em}#yptd-bar:after,#yptd-bottom:after{content:"";display:block;clear:both}#yptd-controls{float:right;height:2.25em;border-left:2px solid rgba(0,0,0,.33)}#yptd-box{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;width:4em;min-width:4em;height:100%;background-color:rgba(0,0,0,.15)}#yptd-in{width:100%;height:100%;border:0;text-align:center;font:14px Helvetica,Arial,sans-serif;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#FFF;background-color:transparent}#yptd-bottom{padding:.75em;font-size:.75em;background-color:rgba(0,0,0,.8)}#yptd-pit{position:relative;padding:.25em 0}#yptd-pit label{margin-right:.5em;color:#FFF}#yptd-pit em{display:none}#yptd-pit:active em,#yptd-pit:focus em,#yptd-pit:hover em{display:block;position:absolute;top:-2.5em;left:0;padding:.5em;white-space:pre;font-size:.8em;background-color:#fd0d5d}\
            </style>\
        <div id="yptd"><div id="yptd-bar"><span id="yptd-off"><em>Hide</em></span><div id="yptd-controls"><span id="yptd-dwn">-</span><div id="yptd-box"><input id="yptd-in" type="text" value="1.0"></div><span id="yptd-up">+</span></div></div><div id="yptd-bottom"><a href="http://yuptude.com" target="_blank"><em>yuptude</em></a><div id="yptd-pit"><label for="yptd-pin"> Shift Pitch <em>(Firefox &amp; Safari only)</em></label><input type="checkbox" name="yptd-pin" id="yptd-pin" value="1"></div></div></div>\
';
document.body.appendChild(ytw);

var ytw = dg("yptd");
var yts = dg("yptd-style");
var yti_in = dg("yptd-in");
var yti_off = dg("yptd-off");
var yti_pit = dg("yptd-pin");
var yti_up = dg("yptd-up");
var yti_dwn = dg("yptd-dwn");

//Speed at which to play
var s = window.sessionStorage.getItem('yuptudeSpeed');
if (s === null) {
  s = 1.0;
} else {
  console.log('Recovered speed ' + s);
  dg("yptd-in").value = s;
}
//Pitch shifting off/on
var p = window.sessionStorage.getItem('yuptudePitch');
if (p === null) {
  p = false;
} else {
  console.log('Recovered pitch ' + p);
  dg("yptd-pin").checked = p;
}

//Update the speed variable when the input field changes
yti_in.addEventListener("input", yte_in);
function yte_in() {
    s = dg("yptd-in").value;
    window.sessionStorage.setItem('yuptudeSpeed', s);
}

//Unload yuptude
yti_off.addEventListener("click", yte_off);
function yte_off() {
    yti_in.removeEventListener("input", yte_in);
    yti_off.removeEventListener("click", yte_off);
    yti_pit.removeEventListener("click", yte_pit);
    yti_up.removeEventListener("click", yte_up);
    yti_dwn.removeEventListener("click", yte_dwn);
    window.removeEventListener("keypress", yte_keypress_handler);

    ytw.parentNode.removeChild(ytw);
    yts.parentNode.removeChild(yts);

    clearInterval(interval);
    
    //Don't reset speed on close.
}

//Toggle pitch-shifting
yti_pit.addEventListener("click", yte_pit);
function yte_pit() {
    p = dg("yptd-pin").checked;
    window.sessionStorage.setItem('yuptudePitch', p);
}

//Increase video playback speed up to the standard cutoff of 4.0
yti_up.addEventListener("click", yte_up);
function yte_up() {
    inputval = dg("yptd-in").value;
    inputval = inputval ? parseFloat(inputval) : 1;
    inputval = (inputval <= 3.9 ? inputval + 0.1 : inputval);
    yte_setSpeed(inputval);
}

//Decrease video playback speed down to the standard cutoff of 0.5
yti_dwn.addEventListener("click", yte_dwn);
function yte_dwn() {
    inputval = dg("yptd-in").value;
    inputval = inputval ? parseFloat(inputval) : 1;
    inputval = (inputval >= 0.6 ? inputval - 0.1 : inputval);
    yte_setSpeed(inputval);
}

function yte_setSpeed(speed) {
    s = speed.toFixed(1);
    dg("yptd-in").value = s;
    window.sessionStorage.setItem('yuptudeSpeed', s);
}

//Apply speed & pitch changes with a running internal to catch videos that are
//appended to the page or loaded after yuptude starts.
var interval = setInterval(function() { apply() }, 100);

function apply(ns) {
    videos = document.querySelectorAll("video");
    for(var i = 0; i < videos.length; i++) {
        v = videos[i];
        if(v && v.readyState >= 2) {
            v.playbackRate = (ns || (s || 1));
            v.mozPreservesPitch = v.webkitPreservesPitch = v.preservePitch = !p;
        }
    }
}

function yte_changeTime(delta_sec) {
    videos = document.querySelectorAll("video");
    for(var i = 0; i < videos.length; i++) {
        v = videos[i];
        if(v && v.readyState >= 2) {
            v.currentTime += delta_sec;
        }
    }
}

function yte_togglePlayback() {
    videos = document.querySelectorAll("video");
    all_paused = true;
    // Pause any videos that are playing.
    for(var i = 0; i < videos.length; i++) {
        v = videos[i];
        if(v && v.readyState >= 2) {
            if(!v.paused) {
                all_paused = false;
                v.pause();
            }
        }
    }
    // Only if everything was already paused, play the first video that is ready.
    if(all_paused) {
        for(var i = 0; i < videos.length; i++) {
            v = videos[i];
            if(v && v.readyState >= 2) {
                v.play();
            }
        }
    }
}

window.addEventListener("keypress", yte_keypress_handler, false);
function yte_keypress_handler(e) {
  if(e.key==="d") yte_up();
  else if(e.key==="s") yte_setSpeed(1.0);
  else if(e.key==="a") yte_dwn();
  else if(e.key==="q") yte_changeTime(-10.0);
  else if(e.key==="w") yte_togglePlayback();
  else if(e.key==="e") yte_changeTime(10.0);
}
