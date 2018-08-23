// ==UserScript==
// @name         LunaBot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.whatsapp.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

//GLOBALS//
var initialized = 0;
var botnet = setInterval(checkmsg, 50);
var initer = setInterval(init, 1000);
var msgside;

//CHECK MSG//
var i;
var children;
var activity;
var newmsgbubble;
var newmsgcount;
var msg;
var xmlHttp;
var responser;

function init() {
	if(document.getElementsByClassName("app-wrapper-web bFqKf")[0] != null){
		msgside = document.querySelector("#side > div._1vDUw > div > div > div");

        initialized = 1;
		clearInterval(initer);
	} else {
        console.log("LunaBot: WAITING FOR MESSAGE FEED.");
	}
}

function checkmsg() {
    if (initialized == 1) {
    children = msgside.children;
		for (i = 0; i < children.length; i++) {
            if (children[i].style.transform == "translate3d(0px, 0px, 0px)" || children[i].style.transform == "translateY(0px)") {
                activity = children[i].querySelector ("div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span");
				if (activity.children.length == 1) {
					newmsgbubble = activity.querySelector ("div > span");
					newmsgcount = newmsgbubble.innerHTML;
					if (newmsgcount != "READ") {
						msg = children[i].querySelector ("div > div > div._3j7s9 > div._1AwDx > div._itDl > span");
						var clickEvt = new MouseEvent('mousedown', {
							bubbles: true,
							composed: true,
							button: 0,
							buttons: 1
							});
						msg.dispatchEvent(clickEvt);

						newmsgbubble.innerHTML = "READ";
						console.log (msg);
						setTimeout(function() { resp(msg.title); }, 150);
					}
				}
            }
		}
    }
}

function resp (str) {
	console.log ("Received Message: " + str);
	var printer = "LunaBot v1.0 (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧\n\n";
	var luna = str.substring(1, 8);
	console.log (luna);
	console.log (luna == "LunaBot");
	if (luna == "LunaBot") {
		str = str.substring (9, str.length - 1);
		console.log (str);
		if (str.substring(0, 4) == "help") {
			printer += """LunaBot ping: Check if the LunaBot service is online.
			LunaBot
			"""
		} else if (str.substring(0, 4) == "ping") {
			printer += "PONG!";
		} else if (str.substring(0, 4) == "time") {
			printer += "Current Date is: " + Date();
		} else if (str.substring(0, 7) == "weather") {
			str = str.substring (8);
			if (str.length == 0) {
				printer += "Usage: LunaBot weather City";
			} else {
				xmlHttp = new XMLHttpRequest();
				xmlHttp.open("GET", "https://vremeainpulamea.sirb.net/?oras=" + str, false);
				xmlHttp.send();
				responser = xmlHttp.responseText;
				var n = responser.indexOf("class=\"oras\"");
				responser = responser.substring (n + 13);
				var astre = responser.indexOf("Astrele");
				var fin = responser.indexOf("Alege");
				printer += responser.substring(0, astre);
				printer += "\n\n";
				printer += responser.substring(astre, fin);
			}
		} else if (str.substring(0, 3) == "say") {
			printer = str.substring (4);
		} else if (str.substring(0, 3) == "ask") {
			xmlHttp = new XMLHttpRequest();
			str = str.substring (4);
			var url = "http://www.wolframalpha.com/input/?i=" + str;
			xmlHttp.open("GET", url, false);
			xmlHttp.send();
			responser = xmlHttp.responseText;
			printer += responser;

		}

		if (printer == "LunaBot v1.0 (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧\n\n")
			printer += str + " command not found!";

		var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input
		var evt = new InputEvent('input', {
			bubbles: true,
			composer: true
		});

		input.innerHTML = printer;
		input.dispatchEvent(evt);
		var SendButts = document.querySelector("#main > footer > div._3pkkz > div:nth-child(3) > button");  // Select the button Kek
		SendButts.click();
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

})();