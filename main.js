// main.js
// Justin Kufro
// Started 11/1/2017

var iframeWidthInt = 350;
var iframeWidth = iframeWidthInt + "px"
var minimizedWidth = 30;  // pixels

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
																			     	 alsoResize: "#pvvPlayer"});

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


function insertPVV(callback) {
	var pvvInject = document.createElement('div');
	pvvInject.setAttribute("id", "draggable");
	pvvInject.setAttribute("class", "ui-widget-content");
	pvvInject.setAttribute("style", "top:70px;right:10px;position:fixed;z-index:99900;width:" + iframeWidth + ";height:227px;background:rgba(218, 42, 42, 0.9);");

	var PVV = document.createElement('iframe');
	PVV.setAttribute("id", "pvvPlayer");
	PVV.setAttribute("type", "text/html");
	PVV.setAttribute("style", "width:100%;height:87%;margin-top:15px;z-index:100100");
	PVV.setAttribute("src", "https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1");
	PVV.setAttribute("frameborder","0");

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
	resizer.setAttribute("src", chrome.extension.getURL("resizable_white.png"));

	bigDragger = document.createElement('div');
	bigDragger.setAttribute("id", "bigDragger");
	bigDragger.setAttribute("type", "text/html");
	bigDragger.setAttribute("style", "margin-top:30px;z-index:100000;position:absolute;width:100%;height:100%");

	pvvInject.appendChild(minimizer);
	pvvInject.appendChild(closer);
	pvvInject.appendChild(resizer);
	pvvInject.appendChild(bigDragger);
	pvvInject.appendChild(PVV);
	document.body.appendChild(pvvInject);
	document.getElementById("draggable").style.visibility = 'hidden';
	document.getElementById("bigDragger").style.display = 'none';

    // do the callback
    callback();
}


function intToPixelValue(int) {
	return int.toString() + "px";
}

function pixelToIntValue(value) {
	return parseInt(value.slice(0, value.length - 2), 10);
}


function keepIframeInWindow() {
	iframeWidthInt = parseInt(lastVid.width.slice(0, lastVid.width.length - 2))
	// find where the window currently is, saving the integer version and the string version
	// also find the min and max values that the window can be in
	var curLeft = getIframeLeft();
	var curLeftInt = pixelToIntValue(curLeft);

	var minLeft = "0px";
	var minLeftInt = 0;

	var maxLeft = parseInt(window.innerWidth - iframeWidthInt) + "px";
	var maxLeftInt = parseInt(window.innerWidth - iframeWidthInt);

	var curTop = getIframeTop();
	var curTopInt = pixelToIntValue(curTop);

	var minTop = "0px";
	var minTopInt = 0;

	var curBottom = getIframeBottom();
	var curBottomInt = pixelToIntValue(curBottom);

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


function getIframe() {
	iframe = document.getElementById("pvvPlayer").contentWindow.document.body;
	if (iframe) {
		return iframe.getElementsByTagName("video")[0];
	}
    return null
}

function playIframe() {
	getIframe().play();
}


function pauseIframe() {
	getIframe().pause();
}


function seekToIframe(time) {
	getIframe().currentTime = time;
}


function getIframePaused() {
	return getIframe().paused
}


function getIframeTime() {
	return getIframe().currentTime;
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
	chrome.storage.local.set(lastVid, function(){ });
}


function getChromeData(callback) {
	// if width is undefined in the chrome data then we can assume that nothing is set
	// if this is true we just need to skip until the script does set the values
	chrome.storage.local.get("width", function(result){
		if (result.width) {
			keys = ["embedUrl", "time", "paused", "left", "top", "minimized", "lastSave", "width", "height"]
			chrome.storage.local.get(keys, function(result){ lastVid = result; });
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
	document.getElementById("pvvPlayer").style.height = (parseInt(lastVid.height.slice(0, lastVid.height.length - 2)) - 28) + "px";

	// set the link
	document.getElementById("pvvPlayer").src = lastVid.embedUrl;

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
		lastVid.embedUrl = null;
	}

	// can't display null video
	if (lastVid.embedUrl == null) {
		hideIframe();
	}
	else {
		var neededTime = lastVid.time;
		var initSeek = setInterval(function() {
			var element = getIframeTime();
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
				var element = getIframePaused();
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
	if ((getEmbedlink() != document.getElementById("pvvPlayer").src) && (lastVid.embedUrl != null)) {
		document.getElementById("pvvPlayer").src = getEmbedlink();
	}
}


// set the position of the window off to the side and change the icon
function minimize() {
    document.getElementById("minimizer").innerHTML = "&lt;";
    document.getElementById("draggable").style.left = (window.innerWidth - minimizedWidth) + "px";
    lastVid.minimized = true;
}


// set the position of the window back into view and change the icon
function unminimize() {
    document.getElementById("minimizer").innerHTML = "&gt;";
    document.getElementById("draggable").style.left = parseInt(window.innerWidth - iframeWidthInt) + "px";
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
		// if we're on a video, or we dont have a set video that means the iframe should be hidden
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
				document.getElementById("draggable").style.left = (window.innerWidth - minimizedWidth) + "px";
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
	   var element = getIframe();

	   // if the #pvvPlayer (the iframe) element exists then break and start the main loop
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
                    insertPVV( function() {
                    	makeDraggable();
                    	allowMinimize();
						allowClose();
						waitForIframeThenRun();
                    });
				});
});
