// ==UserScript==
// @name         LunaBot
// @namespace    http://tampermonkey.net/
// @version      2.4
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
var clever;

var msgside;
var Emoji_amyPC;
var Emoji_blueHeart;
var Emoji_redCross;

var defaultmsg;
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
var listening = 0;
var seamless = 0;
var waitforclever = 0;
var usedumb = 0;

var debuggroupname = "LunaBot Boot Camp";
var prefix = "!Luna";
var jokereplies = ["Ok here's a funny one:", "Ok here's a good one:", "I don't know about this one...", "For giggles:"];
var gotit = ["Noted!", "Got it.", "mhm", "yup", "continue", "go on", "heard you"];
var awake = ["Yes?", "I'm here", "Listening"];

function init() {
	if(document.getElementsByClassName("app-wrapper-web bFqKf")[0] != null && initialized == 0){
		msgside = document.querySelector("#side > div._1vDUw > div > div > div");

        initialized = 1;
		Emoji_amyPC = String.fromCodePoint(0x1F469);
		Emoji_amyPC += String.fromCodePoint(0x1F3FB);
		Emoji_amyPC += String.fromCodePoint(0x200D);
		Emoji_amyPC += String.fromCodePoint(0x1F4BB);
		Emoji_blueHeart = String.fromCodePoint(0x1F499);
		Emoji_redCross = String.fromCodePoint(0x274C);
		defaultmsg = "LunaBot *v2.4* " + Emoji_amyPC + Emoji_blueHeart + "\n\n";
		
		//Spawn the Clever boi
		var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://www.cleverbot.com/");
        ifrm.style.width = "0px";
        ifrm.style.height = "0px";
        document.querySelector("#app").appendChild(ifrm);
		clearInterval(initer);
	} else {
        console.log("LunaBot: [INFO] WAITING FOR MESSAGE FEED.");
	}
}

function annoyware() {
	if (initialized == 1) {
		var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input
		var evt = new InputEvent('input', {
			bubbles: true,
			composer: true
		});

		input.innerHTML = Emoji_amyPC + Emoji_blueHeart + " " + "Want to check out LunaBot? Type *" + prefix + " help* for a list of commands!";
		input.dispatchEvent(evt);
		var SendButts = document.querySelector("#main > footer > div._3pkkz > div:nth-child(3) > button");  // Select the button Kek
		SendButts.click();
	}
}

function checkmsg() {
    if (initialized == 1) {
		children = msgside.children;
		
		for (i = 0; i < children.length; i++) {
            activity = children[i].querySelector ("div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span");
			if (activity.children.length == 1) {
				newmsgbubble = activity.querySelector ("div > span");
				newmsgcount = newmsgbubble.innerHTML;
				
				if (newmsgcount != "READ" && waitforclever == 0) {
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
		}
    }
}

function engage () {
    var chatname = document.querySelector("#main > header > div._1WBXd > div._2EbF- > div > span"); //GET CHATNAME
	chatname = chatname.innerHTML;
	chatname = chatname.substring(0,26); //TRIM CHATNAME
	var textr = document.querySelector ("#main > div._3zJZ2 > div.copyable-area > div._2nmDZ > div._9tCEa > div.vW7d1:nth-last-child(1) > div > div > div.copyable-text > div > span");
	var prevind = 2;
	var previoustextr = document.querySelector ("#main > div._3zJZ2 > div > div > div._9tCEa > div.vW7d1:nth-last-child(" + prevind + ")");
	if (previoustextr == null) { //IF *1 NEW MESSAGE* APPEARS IN THE LIST
		prevind = 3;
		var previoustextr = document.querySelector ("#main > div._3zJZ2 > div > div > div._9tCEa > div.vW7d1:nth-last-child(" + prevind + ")");
	}
	
	//while (previoustextr.querySelector ("div.message-out") != null) { //ITERATE UNTIL WE FIND A MESSAGE THAT'S NOT THE BOT'S
	while (previoustextr.innerHTML.indexOf(defaultmsg.substring(0,13)) != -1 && previoustextr.innerHTML.indexOf(prefix) != -1) {
		prevind = prevind + 1;
		previoustextr = document.querySelector ("#main > div._3zJZ2 > div > div > div._9tCEa > div:nth-last-child(" + prevind + ")");
		if (previoustextr == null)
			break;
	}
	
	if (previoustextr != null) {
		previoustextr = previoustextr.querySelector ("div > div > div.copyable-text > div > span");
		if (previoustextr == null) { //unexpected result ?
			resp("", textr.innerHTML, chatname);
		} else {
			if (previoustextr.innerHTML.indexOf("Acest mesaj a fost") == -1) { //ROMANIAN
				resp(previoustextr.innerHTML, textr.innerHTML, chatname);
			} else {
				resp("", textr.innerHTML, chatname); //Previous text was deleted
			}
		}
	} else {
		resp("", textr.innerHTML, chatname); //Previous text is literally nothing
	}
}

function resp (prevstr, str, chatname) {
	console.log ("LunaBot: [INFO] Received Message: " + str + " From Chat: " + chatname + " With Previous Message: " + prevstr);
	
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
	
	if (str.indexOf(defaultmsg.substring(0,13)) == -1 && waitforclever == 0) { //IF MESSAGE IS FROM THE BOT ITSELF
		if (str.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase()) {
			interacted = 1;
			str = str.substring (prefix.length + 1, 512);
			
			str = str.trim();
			if (str.substring(0, 4).toLowerCase() == "help" || str.substring(0, 4).toLowerCase() == "info") {
				printer += "Hi there! You can talk to me by saying *" + prefix + " _message_.* If the message is a command from the list below, I will execute it.\n\n";
				printer += "*Command List:*\n";
				printer += "*" + prefix + " ping*: Check if the LunaBot service is online.\n";
				printer += "*" + prefix + " weather _city_*: Check weather in any city you like.\n";
				printer += "*" + prefix + " say _something_*: Make LunaBot say anything you want! Don't be too silly tho\n";
				printer += "*" + prefix + " ask _question_*: Send WolframAlpha Query (can also solve equations)\n";
				printer += "*" + prefix + " quote*: Get a random quote\n";
				printer += "*" + prefix + " joke*: Laugh a bit!\n";
				//printer += "*!Luna dumb*: Talk with an 100% user-trained Luna chatbot! Weird stuff may happen, so take care.\n";

				printer += "\n\n\n_Let me know how I'm doing by replying with *good bot*/*headpat* if I did something nice, or with *bad bot*/*critique* if I did something silly._\n\n";
				printer += "*In this update:*\n";
				printer += "I received " + "*" + goodbot + "*" + " headpats " + Emoji_blueHeart + "\n";
				printer += "And " + "*" + badbot + "*" + " critiques! " + Emoji_redCross + "\n\n";
				if (goodbot >= badbot) {
					printer += "Yay!";
				} else {
					printer += "Awf...";
				}
			} else if (str.substring(0, 5).toLowerCase() == "debug") {
				printer += "Welcome to the debugging commands list. Take care.\n\n";
				printer += "Listening mode: ";
				if (listening == 1) {
					printer += "*ON*\n";
				} else {
					printer += "*OFF*\n";
				}
				
				printer += "Seamless mode: ";
				if (seamless == 1) {
					printer += "*ON*\n";
				} else {
					printer += "*OFF*\n";
				}
				
				printer += "Seamless mode type: ";
				if (usedumb == 1) {
					printer += "*DUMB*\n";
				} else {
					printer += "*SMART*\n";
				}
				printer += '\n';
				printer += "*Command List:*\n";
				printer += "*" + prefix + " dumb*: Talk with an user-trained version of Luna! Beware.\n";
				printer += "*" + prefix + " listen on/off*: Turn the Listening mode On/Off\n";
				printer += "*" + prefix + " seamless on/off*: Seamless Conversation mode On/Off\n";
				printer += "*" + prefix + " seammode dumb/smart*: Change seamless bot mode\n";
				printer += "*" + prefix + " changePrefix _newPrefix_*: Change The Prefix\n";
				
				printer += "\n\n";
				printer += "*NOTICE:* LunaBot dumb mode is down for maintenance.";
				
			} else if (str.length == 0) { //JUST PREFIX
				printer += awake[Math.floor(Math.random() * awake.length)];
				
			} else if (str.substring(0, 4).toLowerCase() == "ping") { //CHECK IF SERVICE IS ONLINE
				printer += "PONG!";
				
			} else if (str.substring(0, 4).toLowerCase() == "pong") { //SILLY PONG
				printer += "No silly, you are supposed to say ping and I'm supposed to say pong!";
				
			} else if (str.substring(0, 7).toLowerCase() == "weather") { //CHECK WEATHER (RO)
				str = str.substring (8);
				if (str.length == 0) {
					printer += "Usage: " + prefix + " weather City";
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
					printer = Emoji_amyPC + Emoji_blueHeart + " " + str;
				}
				
			} else if (str.substring(0, 3).toLowerCase() == "ask") {
				xmlHttp = new XMLHttpRequest();
				str = str.substring (4);

				var checker = str.toLowerCase();
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
				}
				if (printer.indexOf ("current geoIP location") != -1) {
					printer = defaultmsg + "Sorry, I did not understand the question.";
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
				
			} else if (str.substring(0, 4).toLowerCase() == "dumb") {
				str = str.substring(5);
				xmlHttp = new XMLHttpRequest();
				xmlHttp.open('GET', 'http://192.168.1.106:8081/?msg=' + encodeURIComponent(str) + '&prevmsg=' + encodeURIComponent(prevstr) + '&listening=0' + '&chatname=' + encodeURIComponent(chatname), false);
				//xmlHttp.send();
				//printer += xmlHttp.responseText;
				
				//DEBUG FEATURES START HERE
			} else if (str.substring(0, 6).toLowerCase() == "listen") {
				if (chatname != debuggroupname) {
					printer += "Sorry, debug features are only allowed on my debug group.";
				} else {
					str = str.substring(7);
					if (str.toLowerCase() == "off") {
						if (listening == 0) {
							printer += "LISTENING MODE. IT'S ALREADY *OFF*!";
						} else {
							listening = 0;
							printer += "LISTENING MODE. OFF!";
						}
					} else if (str.toLowerCase() == "on") {
						if (listening == 1) {
							printer += "LISTENING MODE. IT'S ALREADY *ON*!";
						} else {
							listening = 1;
							printer += "LISTENING MODE. ON!\n";
						}
					} else {
						printer += "Usage: " + prefix + " listen on/off";
					}
				}
				
			} else if (str.substring(0, 8).toLowerCase() == "seamless") {
				if (chatname != debuggroupname) {
					printer += "Sorry, debug features are only allowed on my debug group.";
				} else {
					str = str.substring(9);
					if (str.toLowerCase() == "off") {
						if (seamless == 0) {
							printer += "SEAMLESS MODE. IT'S ALREADY *OFF*!";
						} else {
							seamless = 0;
							printer += "SEAMLESS MODE. OFF!";
						}
					} else if (str.toLowerCase() == "on") {
						if (seamless == 1) {
							printer += "SEAMLESS MODE. IT'S ALREADY *ON*!";
						} else {
							seamless = 1;
							printer += "SEAMLESS MODE. ON!\n";
						}
					} else {
						printer += "Usage: " + prefix + " seamless on/off";
					}
				}
			}  else if (str.substring(0, 8).toLowerCase() == "seammode") {
				if (chatname != debuggroupname) {
					printer += "Sorry, debug features are only allowed on my debug group.";
				} else {
					str = str.substring(9);
					if (str.toLowerCase() == "dumb") {
						printer += "Seamless mode is now on DUMB MODE! Beep Boop.";
						if (usedumb == 1) {
							printer += "Notice: Seamless mode was already on Dumb mode.";
						}
						usedumb = 1;
						
					} else if (str.toLowerCase() == "smart") {
						printer += "Seamless mode is now on SMART MODE! Beep Boop.";
						if (usedumb == 0) {
							printer += "Notice: Seamless mode was already on Smart mode!";
						}
						usedumb = 0;
					} else {
						printer += "Usage: " + prefix + " seammode dumb/smart";
					}
				}
			} else if (str.substring(0, 12).toLowerCase() == "changeprefix") {
				if (chatname != debuggroupname) {
					printer += "Sorry, debug features are only allowed on my debug group.";
				} else {
					str = str.substring(13);
					if (str == "") {
						printer += "Usage: " + prefix + " ChangePrefix _NewPrefix_";
					} else {
						prefix = str;
						printer += "Prefix Changed to " + prefix;
					}
				}
			} else {
				//DIALOG FLOW
				/*xmlHttp = new XMLHttpRequest();
				var params = '{"lang": "en", "query": "' + str + '", "sessionId": "12345", "timezone": "America/New_York"}';
				xmlHttp.open('POST', 'https://api.dialogflow.com/v1/query', false);
				xmlHttp.setRequestHeader("Authorization", "Bearer 9efd8171fb104a3da2b5f99fb86b5feb");
				xmlHttp.setRequestHeader('Content-type', 'application/json');
				xmlHttp.send(params);
				obj = JSON.parse(xmlHttp.responseText);
				console.log(obj["result"]);
				printer += obj["result"]["speech"];*/

				/*//CHATTERBOT MACHINE LEARNING
				xmlHttp = new XMLHttpRequest();
				//xmlHttp.timeout = 10000;
				xmlHttp.open('GET', 'http://192.168.1.106:8080/?msg=' + encodeURIComponent(str) + '&prevmsg=' + encodeURIComponent(prevstr) + '&listening=0' + '&chatname=' + encodeURIComponent(chatname), false);
				xmlHttp.send();
				printer += xmlHttp.responseText;*/
				
				document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
				
				waitforclever = 1;
				clever = setInterval(clevercheck, 100);
			}
			
		} else if (interacted != 1) {
			if (listening == 1) {
				xmlHttp = new XMLHttpRequest();
				xmlHttp.open('GET', 'http://192.168.1.106:8081/?msg=' + encodeURIComponent(str) + '&prevmsg=' + encodeURIComponent(prevstr) + '&listening=1' + '&chatname=' + encodeURIComponent(chatname), false);
				//xmlHttp.send();
				printer = "";
				
				if (seamless == 1 && usedumb == 0) {
					document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
					
					waitforclever = 1;
					clever = setInterval(clevercheck, 100);
					interacted = 1;
				}
			} else if (seamless == 1) {
				if (usedumb == 0) {
					document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
					
					waitforclever = 1;
					clever = setInterval(clevercheck, 100);
				} else {
					xmlHttp = new XMLHttpRequest();
					xmlHttp.open('GET', 'http://192.168.1.106:8081/?msg=' + encodeURIComponent(str) + '&prevmsg=' + encodeURIComponent(prevstr) + '&listening=0' + '&chatname=' + encodeURIComponent(chatname), false);
					//xmlHttp.send();
					//printer = xmlHttp.responseText;
				}
				interacted = 1;
			}
		}
	}
	
	if (interacted == 1 && waitforclever == 0) {
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

function clevercheck () {
	if (waitforclever == 1) {
		if (document.querySelector("#app > iframe").contentWindow.cleverbot.aistate == 0) {
			waitforclever = 0;
			
			var printer = "";
			if (seamless == 0) {
				printer = defaultmsg + document.querySelector("#app > iframe").contentWindow.cleverbot.reply;
			} else {
				printer = document.querySelector("#app > iframe").contentWindow.cleverbot.reply;
			}
			var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input
			var evt = new InputEvent('input', {
				bubbles: true,
				composer: true
			});

			input.innerHTML = printer;
			input.dispatchEvent(evt);
			var SendButts = document.querySelector("#main > footer > div._3pkkz > div:nth-child(3) > button");  // Select the button Kek
			SendButts.click();
			
			clearInterval(clever);
		}
	}
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

})();