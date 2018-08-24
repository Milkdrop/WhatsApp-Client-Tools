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
var bann = setInterval(annoyware, 7200000);

var msgside;
var defaultmsg = "LunaBot v1.3 👩🏻‍💻💙\n\n";
//CHECK MSG//
var i;
var children;
var activity;
var newmsgbubble;
var newmsgcount;
var msg;
var xmlHttp;
var responser;
var obj;
var badbot = 0;
var goodbot = 0;

var jokereplies = ["Ok here's a funny one:", "Ok here's a good one:", "I don't know about this one...", "For giggles:"];

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
            //if (children[i].style.transform == "translate3d(0px, 0px, 0px)" || children[i].style.transform == "translateY(0px)") {
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
                        setTimeout(function() { engage(); }, 50);
					}
				}
            //}
		}
    }
}

function engage () {
	var textr = document.querySelector ("#main > div._3zJZ2 > div.copyable-area > div._2nmDZ > div._9tCEa > div.vW7d1:last-child > div > div > div.copyable-text > div > span");
    resp(textr.innerHTML);
}

function resp (str) {
	console.log ("Received Message: " + str);
	var printer = defaultmsg;
	var interacted = 0;
	
	//Feedback
	if (str.substring(0,8).toLowerCase() == "good bot" || str.substring(0,7).toLowerCase() == "headpat") {
		printer += "Thanks! I'm happy to help <3";
		goodbot = goodbot + 1;
		interacted = 1;
	} else if (str.substring(0,7).toLowerCase() == "bad bot" || str.substring(0,8).toLowerCase() == "critique") {
		printer += "Aww... I hope I'll be able to help you better next time.";
		badbot = badbot + 1;
		interacted = 1;
	}
	
	if (str.substring(0, 7).toLowerCase() == "lunabot" || str.substring(0, 4).toLowerCase() == "luna") {
		interacted = 1;
		if (str.substring(0, 7).toLowerCase() != "lunabot") {
			str = str.substring (5, 512);
		} else {
			str = str.substring (8, 512);
		}
		str = str.trim();
		if (str.substring(0, 4).toLowerCase() == "help" || str.substring(0, 4).toLowerCase() == "info") {
			printer += "Hi there! You can talk to me by saying *LunaBot _message_.* If the message is a command from the list below, I will execute it.\n\n";
			printer += "*Command List:*\n";
			printer += "*LunaBot ping*: Check if the LunaBot service is online.\n";
			printer += "*LunaBot time*: Check time.\n";
			printer += "*LunaBot weather _city_*: Check weather in any city you like.\n";
			printer += "*LunaBot say _something_*: Make LunaBot say anything you want! Don't be too silly tho\n";
			printer += "*LunaBot ask/solve _question_*: Send WolframAlpha Query\n";
			printer += "*LunaBot quote*: Get a random quote\n";
			printer += "*LunaBot joke*: Laugh a bit!\n";
			
			printer += "\n\n\n_Let me know how I'm doing by replying with *good bot*/*headpat* if I did something nice, or with *bad bot*/*critique* if I did something silly._\n\n";
			printer += "*In this update:*\n";
			printer += "I received " + "*" + goodbot + "*" + " headpats 💙\n";
			printer += "And " + "*" + badbot + "*" + " critiques! ❌\n\n";
			if (goodbot >= badbot) {
				printer += "Yay!";
			} else {
				printer += "Awf...";
			}
		} else if (str.length == 0) {
			printer += "Yes?";
		} else if (str.substring(0, 4).toLowerCase() == "ping") {
			printer += "PONG!";
		} else if (str.substring(0, 4).toLowerCase() == "pong") {
			printer += "No silly, you are supposed to say ping and I'm supposed to say pong!";
		} else if (str.substring(0, 4).toLowerCase() == "time") {
			printer += "Current Date is: " + Date();
		} else if (str.substring(0, 7).toLowerCase() == "weather") {
			str = str.substring (8);
			if (str.length == 0) {
				printer += "Usage: LunaBot weather City";
			} else {
				xmlHttp = new XMLHttpRequest();
				xmlHttp.open("GET", "https://cors-anywhere.herokuapp.com/https://vremeainpulamea.sirb.net/?oras=" + encodeURIComponent(str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")), false);
				xmlHttp.send();
				responser = xmlHttp.responseText;
				if (responser.indexOf ("Ai stricat pagina,") != -1) {
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
		} else if (str.substring(0, 3).toLowerCase() == "say") {
			str = str.substring (4);
			if (str == "") {
				printer += "Tell me something to say, too!";
			} else {
				if (str.toLowerCase().indexOf ("mihnea") != -1 ||str.toLowerCase().indexOf ("mihneª") != -1) {
					printer = "👩🏻‍💻💙 Nu ai voie sa te iei de Mihnea! 👺";
				} else {
					printer = "👩🏻‍💻💙 " + str;
				}
			}
		} else if (str.substring(0, 3).toLowerCase() == "ask" || str.substring(0, 5).toLowerCase() == "solve") {
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
				n = responser.indexOf("title");
				var lastTitle = n;
				while (lastTitle != -1) {
					responser = responser.substring(n + 9);
					
					fin = responser.indexOf ("\"");
					var title = responser.substring(0, fin);
					if (title == "" || title == "Image" || title == "Timeline" || title == "Wikipedia page hits history" || title == "Number line" || title == "Manipulatives illustration" || title == "Illustration" || title == "Estimated current age distribution" || title == "History for births" || title == "Structure diagram" || title == "3D structure") {
						
					} else {
						printer += "*" + title + "*";
						printer += "\n";
					}
					
					n = responser.indexOf("plaintext");
					responser = responser.substring(n + 13);
					n = responser.indexOf("\"");
					var wolfmsg = responser.substring(0, n).replace(new RegExp("\\\\n", 'g'), "\n");
					if (wolfmsg != "") {
						printer += wolfmsg;
						printer += "\n\n";
					}
					n = responser.indexOf("title");
					lastTitle = n;
				}
				
				//printer += "\n\n";
				//printer += "_Computed using WolframAlpha_";
			}
		} else if (str.substring(0, 5).toLowerCase() == "quote") {
			xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", "https://talaikis.com/api/quotes/random/", false);
			xmlHttp.send();
			responser = xmlHttp.responseText;
			obj = JSON.parse(responser);
			
			printer += "*Quote By*: " + obj["author"] + "\n\n";
			printer += "_" + obj["quote"] + "_" + "\n";
		} else if (str.substring(0, 4).toLowerCase() == "joke") {
			xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", "https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke", false);
			xmlHttp.send();
			responser = xmlHttp.responseText;
			obj = JSON.parse(responser);
			printer += jokereplies[Math.floor(Math.random() * jokereplies.length)];
			printer += "\n\n";
			printer += "*" + obj["setup"] + "*";
			printer += "\n";
			printer += "_" + obj["punchline"] + "_";
		} else {
			xmlHttp = new XMLHttpRequest();
			var params = '{"lang": "en", "query": "' + str + '", "sessionId": "12345", "timezone": "America/New_York"}';
			xmlHttp.open('POST', 'https://api.dialogflow.com/v1/query', false);
			xmlHttp.setRequestHeader("Authorization", "Bearer e7cca61131504a5487d09a15b69c13f1");
			xmlHttp.setRequestHeader('Content-type', 'application/json');
			xmlHttp.send(params);
			obj = JSON.parse(xmlHttp.responseText);
			console.log(obj["result"]);
			printer += obj["result"]["speech"];
		}
	}
	
	if (interacted == 1) {
		if (printer == defaultmsg)
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