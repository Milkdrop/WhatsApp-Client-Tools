// ==UserScript==
// @name         LunaBot
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  A funky bot
// @author       Loona
// @match        https://web.whatsapp.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

//GLOBALS//
var initialized = 0;
var botnet = setInterval(checkmsg, 50);
var initer = setInterval(init, 1000);
var bann = setInterval(refresher, 21600000);
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
var responser;
var obj;
var badbot = 0;
var goodbot = 0;
var listening = 0;
var seamless = 0;
var waitforclever = 0;
var usedumb = 0;
var responsechance = 3;

var lastmail = 0;

var debuggroupname = "LunaBot Boot Camp";
var prefix = "!Luna";
var jokereplies = ["Ok here's a funny one:", "Ok here's a good one:", "I don't know about this one...", "For giggles:"];
var gotit = ["Noted!", "Got it.", "mhm", "yup", "continue", "go on", "heard you"];
var awake = ["Yes?", "I'm here", "Listening"];

var InputMsgEvent;
var ClickEvent;
var GeneralXMLHTTPRequest;

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
		defaultmsg = "LunaBot *v3.0* " + Emoji_amyPC + Emoji_blueHeart + "\n\n";
		
		GeneralXMLHTTPRequest = new XMLHttpRequest();
		
		InputMsgEvent = new InputEvent('input', {
			bubbles: true,
			composer: true
		});
		
		ClickEvent = new MouseEvent('mousedown', {
			bubbles: true,
			composed: true,
			button: 0,
			buttons: 1
		});
						
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

function refresher() {
	if (initialized == 1) {
		document.location.reload();
		/*var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input
		input.innerHTML = Emoji_amyPC + Emoji_blueHeart + " " + "Want to check out LunaBot? Type *" + prefix + " help* for a list of commands!";
		input.dispatchEvent(InputMsgEvent);
		var SendButts = document.querySelector("#main > footer > div._3pkkz > div:nth-child(3) > button");  // Select the button Kek
		SendButts.click();*/
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
					msg.dispatchEvent(ClickEvent);
					
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
	//console.log ("LunaBot: [INFO] Received Message: " + str + " From Chat: " + chatname + " With Previous Message: " + prevstr);
	
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
			if (str.substring(0, 4).toLowerCase() == "help") {
				printer += "Hi there! You can talk to me by saying *" + prefix + " _message_*, or simply *!message*. If the message is a command from the list below, I will execute it.\n\n";
				printer += "*Command List:*\n";
				printer += "*" + prefix + " ping*: Check if the LunaBot service is online.\n";
				printer += "*" + prefix + " weather _city_*: Check weather in any city you like.\n";
				printer += "*" + prefix + " say _something_*: Make LunaBot say anything you want! Don't be too silly tho\n";
				printer += "*" + prefix + " ask _question_*: Send WolframAlpha Query (can also solve equations)\n";
				printer += "*" + prefix + " sendmail: Send an e-mail from any address, to any address, with any message. (I take 0 responsability for any damage done)\n";
				printer += "*" + prefix + " quote*: Get a random quote\n";
				printer += "*" + prefix + " joke*: Laugh a bit!\n";

				printer += "\n\n\n_Let me know how I'm doing by replying with *good bot*/*headpat* if I did something nice, or with *bad bot*/*critique* if I did something silly._\n\n";
				printer += "*In this update:*\n";
				printer += "I received " + "*" + goodbot + "*" + " headpats " + Emoji_blueHeart + "\n";
				printer += "And " + "*" + badbot + "*" + " critiques! " + Emoji_redCross + "\n\n";
				if (goodbot >= badbot) {
					printer += "Yay!";
				} else {
					printer += "Awf...";
				}
			} else if (str.substring(0,4).toLowerCase() == "info") {
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
				
				printer += "Random Response Chance: *" + responsechance + "%*";
			} else if (str.substring(0, 5).toLowerCase() == "debug") {
				printer += "Welcome to the debugging commands list. Take care.\n\n";
				
				printer += "*Command List:*\n";
				printer += "*" + prefix + " info*: Display config variables.\n";
				printer += "*" + prefix + " dumb*: Talk with an user-trained version of Luna! Beware.\n";
				//printer += "*" + prefix + " listen on/off*: Turn the Listening mode On/Off\n";
				printer += "*" + prefix + " seamless on/off*: Seamless Conversation mode On/Off _[DEPRECATED]_\n";
				//printer += "*" + prefix + " seammode dumb/smart*: Change seamless bot mode _[DEPRECATED]_\n";
				printer += "*" + prefix + " responsechance _integer_*: Change the random response chance. _[WORKS ANYWHERE]_\n";
				printer += "*" + prefix + " changeprefix _newPrefix_*: Change The Prefix\n";
				
				printer += "\n\n";
				printer += "*NOTICE:* LunaBot dumb mode is down for maintenance.\n";
				printer += "*NOTICE:* Seamless mode is deprecated, use random message chances.\n";
				
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
					GeneralXMLHTTPRequest.open("GET", "https://cors-anywhere.herokuapp.com/https://vremeainpulamea.sirb.net/?oras=" + encodeURIComponent(str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")), false);
					GeneralXMLHTTPRequest.send();
					responser = GeneralXMLHTTPRequest.responseText;
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
				str = str.substring (4);

				var checker = str.toLowerCase();
				var url = "https://www.wolframalpha.com/input/apiExplorer.jsp?input=" + encodeURIComponent(str) + "&format=minput,plaintext&output=JSON&type=full";
				GeneralXMLHTTPRequest.open("GET", url, false);
				GeneralXMLHTTPRequest.send();
				responser = GeneralXMLHTTPRequest.responseText;
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
						var wolfmsg = responser.substring(0, n).replace(RegExp("\\\\n", 'g'), "\n");
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
				GeneralXMLHTTPRequest.open("GET", "https://talaikis.com/api/quotes/random/", false);
				GeneralXMLHTTPRequest.send();
				responser = GeneralXMLHTTPRequest.responseText;
				obj = JSON.parse(responser);

				printer += "*Quote By*: " + obj["author"] + "\n\n";
				printer += "_" + obj["quote"] + "_" + "\n";
				
			} else if (str.substring(0, 4).toLowerCase() == "joke") {
				GeneralXMLHTTPRequest.open("GET", "https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke", false);
				GeneralXMLHTTPRequest.send();
				responser = GeneralXMLHTTPRequest.responseText;
				obj = JSON.parse(responser);
				printer += jokereplies[Math.floor(Math.random() * jokereplies.length)];
				printer += "\n\n";
				printer += "*" + obj["setup"] + "*";
				printer += "\n";
				printer += "_" + obj["punchline"] + "_";
				
			} else if (str.substring(0, 8).toLowerCase() == "sendmail") {
				str = str.substring(9);
				var frm;
				var to;
				var msg;
				
				if (str.toLowerCase().indexOf("from:") < str.toLowerCase().indexOf("to:")) {
					frm = str.substring(str.toLowerCase().indexOf("from:"), str.indexOf("\n")).substring(5).trim();
					str = str.substring(str.indexOf("\n")+1);
					to = str.substring(str.toLowerCase().indexOf("to:"), str.indexOf("\n")).substring(3).trim();
				} else {
					to = str.substring(str.toLowerCase().indexOf("to:"), str.indexOf("\n")).substring(3).trim();
					str = str.substring(str.indexOf("\n")+1);
					frm = str.substring(str.toLowerCase().indexOf("from:"), str.indexOf("\n")).substring(5).trim();
				}
				
				str = str.substring(str.indexOf("\n")+1);
				msg = str;
				
				var sent = 0;
				if (frm != "" && to != "" && msg != "") {
					if (frm.indexOf("href=") != -1) {
						frm = frm.substring(frm.indexOf(">") + 1);
						frm = frm.substring(0, frm.indexOf("<"));
					}
					
					if (to.indexOf("href=") != -1) {
						to = to.substring(to.indexOf(">") + 1);
						to = to.substring(0, to.indexOf("<"));
					}
					
					console.log(frm);
					console.log(to);
					if (frm.indexOf("@") != -1 && to.indexOf("@") != -1) {
						if (Date.now() - lastmail <= 150000) {
							if ((60 - Math.floor(((Date.now() - lastmail)/1000)%60)) >= 10) {
								printer += "Please wait *[0" + (2 - Math.floor(((Date.now() - lastmail)/1000)/60)) + ":" + (60 - Math.floor(((Date.now() - lastmail)/1000)%60)) + "]* before sending a new e-mail.";
							} else {
								printer += "Please wait *[0" + (2 - Math.floor(((Date.now() - lastmail)/1000)/60)) + ":0" + (60 - Math.floor(((Date.now() - lastmail)/1000)%60)) + "]* before sending a new e-mail.";
							}
							sent = 1;
						} else {
							GeneralXMLHTTPRequest.open("GET", "http://127.0.0.1:2000/?frm=" + encodeURIComponent(frm) + "&to=" + encodeURIComponent(to) + "&msg=" + encodeURIComponent(msg), false);
							GeneralXMLHTTPRequest.send();
							sent = 1;
							lastmail = Date.now();
							printer += "Mail sent!\n\nFrom: *" + frm + "*\n" + "To: *" + to + "*";
						}
					}
				}
				
				if (sent == 0) {
					printer += "Usage:\n\n" + prefix + " sendmail\nFrom: *from@address*\nTo: *to@address*\n_message_";
				}
				
			}  else if (str.substring(0, 3).toLowerCase() == "dex") {
				str = str.substring(4);
				GeneralXMLHTTPRequest.open("GET", "https://dexonline.ro/definitie/" + encodeURIComponent(str), false);
				GeneralXMLHTTPRequest.send();
				var el = document.createElement( 'html' );
				el.innerHTML = GeneralXMLHTTPRequest.responseText;
				var def = el.querySelector("#resultsTab > div:nth-child(7) > p > span");
				
				
			} else if (str.substring(0, 4).toLowerCase() == "dumb") {
				str = str.substring(5);
				GeneralXMLHTTPRequest.open('GET', 'http://192.168.1.106:8081/?msg=' + encodeURIComponent(str) + '&prevmsg=' + encodeURIComponent(prevstr) + '&listening=0' + '&chatname=' + encodeURIComponent(chatname), false);
				//GeneralXMLHTTPRequest.send();
				//printer += GeneralXMLHTTPRequest.responseText;
				
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
							printer += "LISTENING MODE. *OFF*!";
						}
					} else if (str.toLowerCase() == "on") {
						if (listening == 1) {
							printer += "LISTENING MODE. IT'S ALREADY *ON*!";
						} else {
							listening = 1;
							printer += "LISTENING MODE. *ON*!\n";
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
							printer += "SEAMLESS MODE. *OFF*!";
						}
					} else if (str.toLowerCase() == "on") {
						if (seamless == 1) {
							printer += "SEAMLESS MODE. IT'S ALREADY *ON*!";
						} else {
							seamless = 1;
							printer += "SEAMLESS MODE. *ON*!\n";
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
						printer += "Seamless mode is now on *DUMB MODE*! Beep Boop.";
						if (usedumb == 1) {
							printer += "Notice: Seamless mode was already on Dumb mode.";
						}
						usedumb = 1;
						
					} else if (str.toLowerCase() == "smart") {
						printer += "Seamless mode is now on *SMART MODE*! Beep Boop.";
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
						printer += "Usage: " + prefix + " changeprefix _NewPrefix_";
					} else {
						prefix = str;
						printer += "Prefix Changed to " + "*" + prefix + "*";
					}
				}
			} else if (str.substring(0, 14).toLowerCase() == "responsechance") {
				if (chatname != debuggroupname && false) {
					printer += "Sorry, debug features are only allowed on my debug group.";
				} else {
					str = str.substring(15);
					if (str == "" || isNaN(parseInt(str))) {
						printer += "Usage: " + prefix + " responsechance _integer_";
					} else {
						responsechance = parseInt(str);
						if (responsechance > 100)
							responsechance = 100;
						if (responsechance < 0)
							responsechance = 0;
						printer += "Random response chance is now *" + responsechance + "%*";
					}
				}
			} else {
				//DIALOG FLOW
				/*GeneralXMLHTTPRequest = new XMLHttpRequest();
				var params = '{"lang": "en", "query": "' + str + '", "sessionId": "12345", "timezone": "America/New_York"}';
				GeneralXMLHTTPRequest.open('POST', 'https://api.dialogflow.com/v1/query', false);
				GeneralXMLHTTPRequest.setRequestHeader("Authorization", "Bearer 9efd8171fb104a3da2b5f99fb86b5feb");
				GeneralXMLHTTPRequest.setRequestHeader('Content-type', 'application/json');
				GeneralXMLHTTPRequest.send(params);
				obj = JSON.parse(GeneralXMLHTTPRequest.responseText);
				console.log(obj["result"]);
				printer += obj["result"]["speech"];*/

				/*//CHATTERBOT MACHINE LEARNING
				GeneralXMLHTTPRequest = new XMLHttpRequest();
				//GeneralXMLHTTPRequest.timeout = 10000;
				GeneralXMLHTTPRequest.open('GET', 'http://192.168.1.106:8080/?msg=' + encodeURIComponent(str) + '&prevmsg=' + encodeURIComponent(prevstr) + '&listening=0' + '&chatname=' + encodeURIComponent(chatname), false);
				GeneralXMLHTTPRequest.send();
				printer += GeneralXMLHTTPRequest.responseText;*/
				
				document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
				
				waitforclever = 1;
				clever = setInterval(clevercheck, 100);
			}
			
		} else if (str.substring(0,1).toLowerCase() == "!") { //interpret as msg
			str = str.substring(1);
			document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
			
			waitforclever = 1;
			clever = setInterval(clevercheck, 100);
		} else if (interacted != 1) {
			if (listening == 1) {
				GeneralXMLHTTPRequest.open('GET', 'http://192.168.1.106:8081/?msg=' + encodeURIComponent(str) + '&prevmsg=' + encodeURIComponent(prevstr) + '&listening=1' + '&chatname=' + encodeURIComponent(chatname), false);
				//GeneralXMLHTTPRequest.send();
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
					GeneralXMLHTTPRequest.open('GET', 'http://192.168.1.106:8081/?msg=' + encodeURIComponent(str) + '&prevmsg=' + encodeURIComponent(prevstr) + '&listening=0' + '&chatname=' + encodeURIComponent(chatname), false);
					//GeneralXMLHTTPRequest.send();
					//printer = GeneralXMLHTTPRequest.responseText;
				}
				interacted = 1;
			} else if (Math.floor(Math.random() * 100) < responsechance) {
				document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
					
				waitforclever = 1;
				clever = setInterval(clevercheck, 100);
				interacted = 1;
			}
		}
	}
	
	if (interacted == 1 && waitforclever == 0) {
		if (printer == defaultmsg)
			printer += str + " command not found!";

		var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input
		input.innerHTML = printer;
		input.dispatchEvent(InputMsgEvent);
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
				//printer = defaultmsg + document.querySelector("#app > iframe").contentWindow.cleverbot.reply;
			} else {
				printer = document.querySelector("#app > iframe").contentWindow.cleverbot.reply;
			}
			printer = document.querySelector("#app > iframe").contentWindow.cleverbot.reply;
			
			var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input

			input.innerHTML = printer;
			input.dispatchEvent(InputMsgEvent);
			var SendButts = document.querySelector("#main > footer > div._3pkkz > div:nth-child(3) > button");  // Select the button Kek
			SendButts.click();
			
			clearInterval(clever);
		}
	}
}
})();
