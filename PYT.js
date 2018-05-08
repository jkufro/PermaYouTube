// PYT.js
// Justin Kufro
// Started 11/1/2017
var iframeWidthInt = 350;
var iframeWidth = iframeWidthInt + "px"

var jqInject = "https://code.jquery.com/jquery-1.12.4.js";
var jquiInject = "https://code.jquery.com/ui/1.12.1/jquery-ui.js";

var lastVid = {
	embedUrl: "https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1",
	time: "0",
	paused: false,
	left: "0",
	top: "0",
	minimized: false,
	lastSave: 0,
	width: "350px",
	height: "227px"
};


function makeDraggable() {
    // make the viewing window draggable with these options
    $( "#draggable" ).draggable({ containment: "window", scroll: false }).resizable({maxHeight: 563,
																			         maxWidth: 1000,
																			         minHeight: 200,
																			         minWidth: 300,
																			     	 alsoResize: "#pytPlayer"});

	// this makes it so that when the user is dragging the window
	// around the mouse doesn't get caught inside the iframe
	// and stop the dragging abruptly
	$("#draggable").mousedown(function() {
		document.getElementById("bigDragger").style.display = 'inline';
	});
	$("#draggable").mouseup(function() {
		document.getElementById("bigDragger").style.display = 'none';
	});
}


function insertPYT(callback) {
	var pytInject = document.createElement('div');
	pytInject.setAttribute("id", "draggable");
	pytInject.setAttribute("class", "ui-widget-content");
	pytInject.setAttribute("style", "top:70px;right:10px;position:fixed;z-index:99900;width:" + iframeWidth + ";height:227px;background:rgba(218, 42, 42, 0.9);");

	var PYT = document.createElement('iframe');
	PYT.setAttribute("id", "pytPlayer");
	PYT.setAttribute("type", "text/html");
	PYT.setAttribute("style", "width:100%;height:87%;margin-top:15px;z-index:100100");
	PYT.setAttribute("src", "https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1");
	PYT.setAttribute("frameborder","0");

	minimizer = document.createElement('div');
	minimizer.setAttribute("id", "minimizer");
	minimizer.setAttribute("type", "text/html");
	minimizer.setAttribute("style", "cursor:pointer;position:absolute;font-size:10pt;color:white;padding-left:5px;padding-right:5px;font-weight:900;")
	minimizer.appendChild(document.createTextNode(">"));

	closer = document.createElement("div");
	closer.setAttribute("id", "closer");
	closer.setAttribute("type", "text/html");
	closer.setAttribute("style", "cursor:pointer;position:absolute;right:5px;;font-size:10pt;color:white;padding-left:5px;font-weight:900;");
	closer.appendChild(document.createTextNode("X"));

	resizer = document.createElement("img");
	resizer.setAttribute("id", "resizer");
	resizer.setAttribute("type", "text/html");
	resizer.setAttribute("style", "cursor:pointer;position:absolute;right:0px;bottom:0px;color:white;padding-left:5px;font-weight:900;");
	resizer.setAttribute("src", chrome.extension.getURL("resizable.png"));

	bigDragger = document.createElement('div');
	bigDragger.setAttribute("id", "bigDragger");
	bigDragger.setAttribute("type", "text/html");
	bigDragger.setAttribute("style", "margin-top:30px;z-index:100000;position:absolute;width:100%;height:100%");

	pytInject.appendChild(minimizer);
	pytInject.appendChild(closer);
	pytInject.appendChild(resizer);
	pytInject.appendChild(bigDragger);
	pytInject.appendChild(PYT);
	document.body.appendChild(pytInject);
	document.getElementById("draggable").style.visibility = 'hidden';
	document.getElementById("bigDragger").style.display = 'none';

    // do the callback
    callback();
}


function stdPixelValues(v1, v2) {
	var result = {
		v1: v1,
		v2: v2
	}
	stdlength = Math.max(v1.length, v2.length);
	while (result.v1.length < stdlength) { result.v1 = "0" + result.v1; }
	while (result.v2.length < stdlength) { result.v2 = "0" + result.v2; }
	return result;
}


function intToPixelValue(int) {
	return int.toString() + "px";
}


function keepIframeInWindow() {
	iframeWidthInt = parseInt(lastVid.width.slice(0, lastVid.width.length - 2)) + 20
	// find where the window currently is, saving the integer version and the string version
	// also find the min and max values that the window can be in
	var curLeft = getIframeLeft();
	var curLeftInt = parseInt(curLeft.slice(0, curLeft.length - 2), 10);

	var minLeft = "0px";
	var minLeftInt = 0;

	var maxLeft = parseInt(window.innerWidth - iframeWidthInt) + "px";
	var maxLeftInt = parseInt(window.innerWidth - iframeWidthInt);

	var curTop = getIframeTop();
	var curTopInt = parseInt(curTop.slice(0, curTop.length - 2), 10);

	var minTop = "0px";
	var minTopInt = 0;

	var curBottom = getIframeBottom();
	var curBottomInt = parseInt(curBottom.slice(0, curBottom.length - 2), 10);

	var minBottom = "0px";
	var minBottomInt = 0;

	// compare current left/bottom to maximum left/bottom
	if (curLeftInt > maxLeftInt) {
		document.getElementById("draggable").style.left = maxLeft;
	}
	if (curBottomInt < minBottomInt) {
		document.getElementById("draggable").style.top = null;
		document.getElementById("draggable").style.bottom = minBottom;
	}

	// compare current the left/top to minimum left/top
	if (curLeftInt < minLeftInt) {
		document.getElementById("draggable").style.right = null;
		document.getElementById("draggable").style.left = minLeft;
	}
	if (curTopInt < minTopInt) {
		document.getElementById("draggable").style.bottom = null;
		document.getElementById("draggable").style.top = minTop;
	}
}


// inserts the iFrame and everything needed to support it
function preparePlayback() {
	insertPYT();
	makeDraggable();
}


//http://jsfiddle.net/isherwood/cH6e8/
function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}


function playIframe() {
	document.getElementById("pytPlayer").contentWindow.document.body.getElementsByTagName("video")[0].play();
}


function pauseIframe() {
	document.getElementById("pytPlayer").contentWindow.document.body.getElementsByTagName("video")[0].pause();
}


function seekToIframe(time) {
	document.getElementById("pytPlayer").contentWindow.document.body.getElementsByTagName("video")[0].currentTime = time;
}


function getIframePaused() {
	var isPaused = document.getElementById("pytPlayer").contentWindow.document.body.getElementsByTagName("video")[0].paused;

	return isPaused;
}


function getIframeTime() {
	var time = document.getElementById("pytPlayer").contentWindow.document.body.getElementsByTagName("video")[0].currentTime;

	return time;
}


function getIframeLeft() {
	var element = document.getElementById("draggable"),
    style = window.getComputedStyle(element);
    return style.left;
}


function getIframeTop() {
	var element = document.getElementById("draggable"),
    style = window.getComputedStyle(element);
    return style.top;
}

function getIframeRight() {
	var element = document.getElementById("draggable"),
    style = window.getComputedStyle(element);
    return style.right;
}


function getIframeBottom() {
	var element = document.getElementById("draggable"),
    style = window.getComputedStyle(element);
    return style.bottom;
}


function setIframePos(l, t) {
	document.getElementById("draggable").style.left = l;
	document.getElementById("draggable").style.top = t;
}


function saveTinyPlaybackStats() {
	// update the local data
	ebLink = getEmbedlink();
	if (ebLink == 'error') {
		ebLink = lastVid.embedUrl;
	}

	lastVid = {
		embedUrl: ebLink,
		time: getIframeTime(),
		paused: getIframePaused(),
		left: getIframeLeft(),
		top: getIframeTop(),
		minimized: lastVid.minimized,
		lastSave: (new Date().getTime() / 1000),
		width: document.getElementById("draggable").style.width,
		height: document.getElementById("draggable").style.height
	};

	// save to chrome data
	saveChromeData();
}


function saveChromeData() {
	chrome.storage.local.set({ "embedUrl": lastVid.embedUrl}, function(){ });
	chrome.storage.local.set({ "time": lastVid.time}, function(){ });
	chrome.storage.local.set({ "paused": lastVid.paused}, function(){ });
	chrome.storage.local.set({ "left": lastVid.left}, function(){ });
	chrome.storage.local.set({ "top": lastVid.top}, function(){ });
	chrome.storage.local.set({ "minimized": lastVid.minimized}, function(){ });
	chrome.storage.local.set({ "lastSave": lastVid.lastSave}, function(){ });
	chrome.storage.local.set({ "width": lastVid.width}, function(){ });
	chrome.storage.local.set({ "height": lastVid.height}, function(){ });
}


function getChromeData(callback) {
	// if width is undefined in the chrome data then we can assume that nothing is set
	// if this is true we just need to skip until the script does set the values
	chrome.storage.local.get("width", function(result){
		if (result.width) {
			chrome.storage.local.get("embedUrl", function(result){ lastVid.embedUrl = result.embedUrl; });
			chrome.storage.local.get("time", function(result){ lastVid.time = result.time; });
			chrome.storage.local.get("paused", function(result){ lastVid.paused = result.paused; });
			chrome.storage.local.get("left", function(result){ lastVid.left = result.left; });
			chrome.storage.local.get("top", function(result){ lastVid.top = result.top; });
			chrome.storage.local.get("minimized", function(result){ lastVid.minimized = result.minimized; });
			chrome.storage.local.get("lastSave", function(result){ lastVid.lastSave = result.lastSave; });
			chrome.storage.local.get("width", function(result){ lastVid.width = result.width; });
			chrome.storage.local.get("height", function(result){ lastVid.height = result.height; });
		}
	});
	// run the callback
	callback();
}


function saveNormalPlaybackStats() {
	ebLink = getEmbedlink();
	if (ebLink == 'error') {
		ebLink = lastVid.embedUrl;
	}

	// update the local data
	lastVid.embedUrl = ebLink;
	lastVid.time = document.getElementsByTagName("video")[0].currentTime;
	lastVid.paused = document.getElementsByTagName("video")[0].paused;
	lastVid.lastSave = (new Date().getTime() / 1000);

	// save to chrome data
	saveChromeData();
}


function isOnVideo() {
	var videoId = getId(window.location.href);

	if (videoId == 'error') {
		return false;
	}

	return true;
}


var iframeVideo;
var startTime = (new Date().getTime() / 1000);
function initIframeData(callback) {
	var difference = startTime - lastVid.lastSave;
	var maxDifference = 1800;

	// set the width and height
	document.getElementById("draggable").style.width = lastVid.width
	document.getElementById("draggable").style.height = lastVid.height
	document.getElementById("pytPlayer").style.height = (parseInt(lastVid.height.slice(0, lastVid.height.length - 2)) - 28) + "px";

	// set the link
	document.getElementById("pytPlayer").src = lastVid.embedUrl;

	// set the position
	setIframePos(lastVid.left, lastVid.top);

	// set the visibility based on the saved values
	if (isOnVideo() == false){
		document.getElementById("draggable").style.visibility = 'visible';
	} else {
		hideIframe();
	}

	// need to hide if user came back after a while
	if (difference > maxDifference) {
		console.log("PYT timeout")
		lastVid.embedUrl = null;
	}

	// can't display null video
	if (lastVid.embedUrl == null) {
		hideIframe();
	}
	else {
		var neededTime = lastVid.time;
		var initSeek = setInterval(function() {
			var element = document.getElementById("pytPlayer").contentWindow.document.body.getElementsByTagName("video")[0].currentTime;
		    if (element != undefined && element != null) {
		        clearInterval(initSeek);

		        // avoid calling before the video is ready
		        setTimeout(function() {
		        	seekToIframe(neededTime);
		    	}, 500);
			}
		}, 100); // check every 100ms

		// make sure the video pauses before autoplay starts
		if (lastVid.paused == true) {
			var ensurePaused = setInterval(function() {
				// keep checking for it until it exists
				var element = document.getElementById("pytPlayer").contentWindow.document.body.getElementsByTagName("video")[0].paused;
			    if (element == false) {
			        clearInterval(ensurePaused);
			        pauseIframe();
				}
			}, 100); // check every 100ms
		}
	}

	if (lastVid.minimized == true) {
		document.getElementById("minimizer").innerHTML = "&lt;";
		document.getElementById("draggable").style.left = (window.innerWidth - 40) + "px";
	} else {
		document.getElementById("minimizer").innerHTML = "&gt;";
		document.getElementById("draggable").style.left = lastVid.left;
	}

	// run the callback
	callback();
}


function hideIframe() {
	// pause
	pauseIframe();
	// visibility
	document.getElementById("draggable").style.visibility = 'hidden';
}


function showIframe() {
	// play if needed
	if (getIframePaused() == false) {
		playIframe();
	}
	else {
		pauseIframe();
	}
	// visibility
	document.getElementById("draggable").style.visibility = 'visible';
}


function getEmbedlink() {
	var result = getId(window.location.href);
	if (result == 'error'){ return result; }

	return "https://www.youtube.com/embed/" + result + "?enablejsapi=1&autoplay=true";
}

function updateIframeLink() {
	if ((getEmbedlink() != document.getElementById("pytPlayer").src) && (lastVid.embedUrl != null)) {
		document.getElementById("pytPlayer").src = getEmbedlink();
	}
}


// set the position of the window off to the side and change the icon
function minimize() {
    document.getElementById("minimizer").innerHTML = "&lt;";
    document.getElementById("draggable").style.left = (window.innerWidth - 40) + "px";
    lastVid.minimized = true;
}


// set the position of the window back into view and change the icon
function unminimize() {
    document.getElementById("minimizer").innerHTML = "&gt;";
    document.getElementById("draggable").style.left = parseInt(window.innerWidth - iframeWidthInt - 20) + "px";
    lastVid.minimized = false;
}

// minimizing functionality
function allowMinimize() {
    // get the iframe's width as an integer
	iframeWidthInt = parseInt(lastVid.width.slice(0, lastVid.width.length - 2))

    // if the user clicks the minimizer button while not already minimized,
    // then put the window to the right side of the screen only slightly visible.
    // if it is already minimized, then that means the user wants to unminimize
	$("#minimizer").click(function() {
		if (lastVid.minimized == false) {
			minimize();
		} else {
            unminimize();
        }
	});

    // if the user clicks anywhere on the window while it's minimized,
    // then put the window back into view
	$("#draggable").click(function() {
		if (lastVid.minimized == true) {
			unminimize();
		}
	}).children().click(function(e) { // this makes the minimizer easier to click
	  return false;
	});
}


function allowClose() {
	$("#closer").click(function() {
		hideIframe();
		lastVid.embedUrl = null;
	});
}


function mainLoop() {
	// initialize the variable to be used in the loop
	// references if the last check was on a video or not
	var lastIsOnVideo = isOnVideo();
	setInterval(function(){
		// if we're on a video, or we dont have a set video
		if (isOnVideo() == true || lastVid.embedUrl == "" || lastVid.embedUrl == null) {
			// if any of the above are true, then the mini-view shouldnt be showing
			hideIframe();
			// have to be on a video to save any data
			if (isOnVideo() == true) {
				saveNormalPlaybackStats();
				updateIframeLink();
			}
		} else {
			// if we just moved from a video to another page
			if (lastIsOnVideo == true) {
				seekToIframe(lastVid.time);
				if (lastVid.paused == true) { pauseIframe() } else { playIframe() }
			}

			// placement if is or isnt minimized
			if (lastVid.minimized == false) {
				keepIframeInWindow();
			} else {
				document.getElementById("draggable").style.left = (window.innerWidth - 40) + "px";
			}

			showIframe();
			saveTinyPlaybackStats();
		}
		lastIsOnVideo = isOnVideo();
	}, 250);
}


function waitForIframeThenRun() {
	// wait until the iframe is usable to continue
	var iFrameExists = setInterval(function() {
	   var element = document.getElementById("pytPlayer").contentWindow.document.body.getElementsByTagName("video")[0];

	   // if the #pytPlayer (the iframe) element exists then break and start the main loop
	   if (element != undefined) {
	      initIframeData(mainLoop);
	      clearInterval(iFrameExists); // don't let the loop happen again
	   }
	}, 100); // check every 100ms
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

$(document).ready( function() {
	getChromeData( function() {
                    insertPYT( function() {
                    	makeDraggable();
                    	allowMinimize();
						allowClose();
						waitForIframeThenRun();
                    });
				});
});


