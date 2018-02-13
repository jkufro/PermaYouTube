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
	lastSave: 0
};

var pytInject;
var PYT;

function insertJq() {
	var jq = document.createElement('script');
	jq.type = 'text/javascript';
	jq.src = jqInject;

	var jqui = document.createElement('script');
	jqui.type = 'text/javascript';
	jqui.src = jquiInject;

	//document.body.appendChild(jq);
	//document.body.appendChild(jqui);

	setTimeout(makeDraggable, 1000);
}


function makeDraggable() {
	$( function() {
	    $( "#draggable" ).draggable({ containment: "window", scroll: false });
	} );

	$("#draggable").mousedown(function() {
		document.getElementById("bigDragger").style.display = 'inline';
	});

	$("#draggable").mouseup(function() {
		document.getElementById("bigDragger").style.display = 'none';
	});
}


function insertPYT() {
	pytInject = document.createElement('div');
	pytInject.setAttribute("id", "draggable");
	pytInject.setAttribute("class", "ui-widget-content");
	pytInject.setAttribute("style", "top:70px;right:10px;position:fixed;z-index:99900;width:" + iframeWidth + ";height:227px;background:rgb(193, 47, 51);");

	PYT = document.createElement('iframe');
	PYT.setAttribute("id", "pytPlayer");
	PYT.setAttribute("type", "text/html");
	PYT.setAttribute("style", "width:" + iframeWidth + ";height:197px;margin-top:15px;z-index:100100");
	PYT.setAttribute("src", "https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1");
	PYT.setAttribute("frameborder","0");

	minimizer = document.createElement('div');
	minimizer.setAttribute("id", "minimizer");
	minimizer.setAttribute("type", "text/html");
	minimizer.setAttribute("style", "cursor:pointer;position:absolute;font-size:10pt;color:white;padding-left:5px;font-weight:900;")
	minimizer.appendChild(document.createTextNode(">"));

	closer = document.createElement("div");
	closer.setAttribute("id", "closer");
	closer.setAttribute("type", "text/html");
	closer.setAttribute("style", "cursor:pointer;position:absolute;right:5px;;font-size:10pt;color:white;padding-left:5px;font-weight:900;");
	closer.appendChild(document.createTextNode("X"));

	bigDragger = document.createElement('div');
	bigDragger.setAttribute("id", "bigDragger");
	bigDragger.setAttribute("type", "text/html");
	bigDragger.setAttribute("style", "margin-top:30px;z-index:100000;position:absolute;width:" + iframeWidth + ";height:197px");

	pytInject.appendChild(minimizer);
	pytInject.appendChild(closer);
	pytInject.appendChild(bigDragger);
	pytInject.appendChild(PYT);
	document.body.appendChild(pytInject);
	document.getElementById("draggable").style.visibility = 'hidden';
	document.getElementById("bigDragger").style.display = 'none';
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
	var curLeft = getIframeLeft();
	curLeft = parseInt(curLeft.slice(0, curLeft.length - 2), 10).toString() + "px";
	var minLeft = "0px";
	stdVals = stdPixelValues(curLeft, minLeft);
	curLeft = stdVals.v1;
	minLeft = stdVals.v2;

	var maxLeft = parseInt(window.innerWidth - iframeWidthInt) + "px";
	stdVals = stdPixelValues(curLeft, maxLeft);
	curLeft = stdVals.v1;
	minLeft = stdVals.v2;


	var curTop = getIframeTop();
	curTop = parseInt(curTop.slice(0, curTop.length - 2), 10).toString() + "px";
	var minTop = "0px";
	stdVals = stdPixelValues(curTop, minTop);
	curTop = stdVals.v1;
	minTop = stdVals.v2;

	var curBottom = getIframeBottom();
	curBottom = parseInt(curBottom.slice(0, curBottom.length - 2), 10).toString() + "px";
	var minBottom = "0px";
	stdVals = stdPixelValues(curBottom, minBottom);
	curBottom = stdVals.v1;
	minBottom = stdVals.v2;


	// compare current right/bottom to max right/bottom
	if (curLeft > maxLeft) {
		document.getElementById("draggable").style.left = maxLeft;
	}
	if (curBottom < minBottom) {
		document.getElementById("draggable").style.top = null;
		document.getElementById("draggable").style.bottom = minBottom;
	}

	curLeft = parseInt(curLeft.slice(0, curLeft.length - 2), 10).toString() + "px";
	var minLeft = "0px";
	stdVals = stdPixelValues(curLeft, minLeft);

	// compare current left/top to max left/top
	if (curLeft < minLeft) {
		document.getElementById("draggable").style.right = null;
		document.getElementById("draggable").style.left = minLeft;
	}
	if (curTop < minTop) {
		document.getElementById("draggable").style.bottom = null;
		document.getElementById("draggable").style.top = minTop;
	}
}


// inserts the iFrame and everything needed to support it
function preparePlayback() {
	insertPYT();
	insertJq();
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
		lastSave: (new Date().getTime() / 1000)
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
}


function getChromeData() {
	chrome.storage.local.get("embedUrl", function(result){ lastVid.embedUrl = result.embedUrl; });
	chrome.storage.local.get("time", function(result){ lastVid.time = result.time; });
	chrome.storage.local.get("paused", function(result){ lastVid.paused = result.paused; });
	chrome.storage.local.get("left", function(result){ lastVid.left = result.left; });
	chrome.storage.local.get("top", function(result){ lastVid.top = result.top; });
	chrome.storage.local.get("minimized", function(result){ lastVid.minimized = result.minimized; });
	chrome.storage.local.get("lastSave", function(result){ lastVid.lastSave = result.lastSave; });
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
function initIframeData() {
	var difference = startTime - lastVid.lastSave;
	var maxDifference = 1800;

	// set the link
	document.getElementById("pytPlayer").src = lastVid.embedUrl;

	// set the position
	setIframePos(lastVid.left, lastVid.top);

	// set the visibility
	if (isOnVideo() == false){
		document.getElementById("draggable").style.visibility = 'visible';
	} else {
		hideIframe();
	}

	// need to hide if user came back after a while
	if (difference > maxDifference) {
		console.log("timeout")
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


// minimizing functionality
function allowMinimize() {
	$("#minimizer").click(function() {
		lastVid.minimized = ! lastVid.minimized;
		if (lastVid.minimized == true) {
			document.getElementById("minimizer").innerHTML = "&lt;";
			document.getElementById("draggable").style.left = (window.innerWidth - 40) + "px";
		} else {
			document.getElementById("minimizer").innerHTML = "&gt;";
			document.getElementById("draggable").style.left = parseInt(window.innerWidth - iframeWidthInt - 20) + "px";
		}
	});

	$("#draggable").click(function() {
		if (lastVid.minimized == true) {
			document.getElementById("minimizer").innerHTML = "&gt;";
			document.getElementById("draggable").style.left = parseInt(window.innerWidth - iframeWidthInt - 20) + "px";
			lastVid.minimized = false;
		}
	}).children().click(function(e) {
	  return false;
	});;
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

	      initIframeData();
	      clearInterval(iFrameExists);
	      setTimeout(function() {
	      	  mainLoop();
	      }, 750);
	   }
	}, 100); // check every 100ms
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

setTimeout(function() {
	getChromeData();
	preparePlayback();
	allowMinimize();
	allowClose();
	waitForIframeThenRun();
}, 500)


