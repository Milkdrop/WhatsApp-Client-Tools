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
var bunn = setInterval(annoyware, 7200000);

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

function annoyware()
{
	var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input
		var evt = new InputEvent('input', {
			bubbles: true,
			composer: true
		});

		input.innerHTML = "Want to check out LunaBot? Type *LunaBot help* for commands!";
		input.dispatchEvent(evt);
		var SendButts = document.querySelector("#main > footer > div._3pkkz > div:nth-child(3) > button");  // Select the button Kek
		SendButts.click();
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
	if (luna == "LunaBot") {
		str = str.substring (9, str.length - 1);
		console.log (str);
		if (str.substring(0, 4) == "help") {
			printer += "LunaBot ping: Check if the LunaBot service is online.\n\n";
			printer += "LunaBot time: Check time.\n\n";
			printer += "LunaBot weather: Check weather in any city you like.\n\n";
			printer += "LunaBot say: Make LunaBot say anything you want! Don't be too silly tho\n\n";
			printer += "LunaBot ask: [In Construction] Send WolframAlpha Query\n\n";
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
				xmlHttp.open("GET", "https://vremeainpulamea.sirb.net/?oras=" + encodeURIComponent(str), false);
				xmlHttp.send();
				responser = xmlHttp.responseText;
				if (responser.indexOf ("Ai stricat pagina, ţigane.") != -1) {
					printer += "Could not find " + str + " city.";
				} else {
					var n = responser.indexOf("class=\"oras\"");
					responser = responser.substring (n + 13);
					var astre = responser.indexOf("Astrele");
					var fin = responser.indexOf("Alege");
					printer += responser.substring(0, astre);
					printer += "\n\n";
					printer += responser.substring(astre, fin);
				}
			}
		} else if (str.substring(0, 3) == "say") {
			printer = str.substring (4);
		} else if (str.substring(0, 3) == "ask" || str.substring(0, 5) == "solve") {
			xmlHttp = new XMLHttpRequest();
			if (str.substring(0, 3) == "ask")
				str = str.substring (4);
			else
				str = str.substring (6);
			var url = "https://www.wolframalpha.com/input/apiExplorer.jsp?input=" + encodeURIComponent(str) + "&format=minput,plaintext&output=JSON&type=full";
			xmlHttp.open("GET", url, false);
			xmlHttp.send();
			responser = xmlHttp.responseText;
			n = responser.indexOf("\"success\":");
			responser = responser.substring(n + 11);
			if (responser.substring(0, 5) == "false") {
				printer += "Sorry, I did not understand the question.";
			} else {
				n = responser.indexOf("Result");
				responser = responser.substring(n);
				n = responser.indexOf("plaintext");
				responser = responser.substring(n + 13);
				n = responser.indexOf("\"");
				printer += responser.substring(0, n).replace("\\n", "\n");
				printer += "\n\n\n";
				printer += "_Powered by WolframAlpha_";
			}
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