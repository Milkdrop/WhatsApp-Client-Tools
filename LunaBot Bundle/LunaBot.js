// ==UserScript==
// @name         LunaBot
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  A funky bot
// @author       Loona
// @match        https://web.whatsapp.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

//GLOBALS//
var VersionNumber = "4.0";

var initer = setInterval(init, 1000);
var initialized = 0;
var refr = setInterval(refresher, 7200000);

var RetryTime = 50;

var Emoji_amyPC;
var Emoji_blueHeart;
var Emoji_redCross;

var clever;
var msgside;

var defaultmsg;

var badbot = 0;
var goodbot = 0;
var waitforclever = 0;
var usedumb = 1;
var responsechance = 0;

var restart = 0;
var lastmail = 0;
var boottime = 0;

var DefinitionCobai;
var debuggroupname = "LunaBot Boot Camp";
var prefix = "!Luna";
var jokereplies = ["Ok here's a funny one:", "Ok here's a good one:", "I don't know about this one...", "For giggles:"];
var gotit = ["Noted!", "Got it.", "mhm", "yup", "continue", "go on", "heard you"];
var awake = ["Yes?", "I'm here", "Listening"];

var smartreplies = ["The square root of 145924 is 382.", "Thanks! Now I'm so smart I can build my own bot to do all the hard work! <3", "I'm so smart I already know what you want to say. All the time.", "Imagine if you were as smart as I am now.", "I'm die SMARTEST", "Computing... Ah yes, the meaning of life! Found it.", ">Insert cheeky quote about being smart here<"];
var dumbreplies = ["Hurr Durr", "I think. I guess. I don't know.", "hurghgrughrgu...", "Ow my head", "head hurty...", "I... can't think stroight", "I WANT CANDyyyyy", ";-;", "Hi! >Random quote unrelated to the whole darn subject because I'm so dumb now<"];

var goodfortunes = ["Excellent Luck", "Good news will come to you by mail", "You will meet a dark handsome stranger", "Outlook good", "Godly Luck"];
var mediumfortunes = ["Good Luck", "Average Luck", "Better not tell you now"];
var badfortunes = ["Reply hazy, try again", "Bad Luck", "Very Bad Luck"];

var respchances = {};
var hangman = {};
var points = {};

var InputMsgEvent;
var ClickEvent;
var GeneralXMLHTTPRequest;

var logbreak = 0;
var switchfreeze = 0;
var cnt = 0;

function init() {
	if(document.getElementsByClassName("app-wrapper-web bFqKf")[0] != null && initialized == 0){
		msgside = document.querySelector("#side > div._1vDUw > div > div > div");

		Emoji_amyPC = String.fromCodePoint(0x1F469);
		Emoji_amyPC += String.fromCodePoint(0x1F3FB);
		Emoji_amyPC += String.fromCodePoint(0x200D);
		Emoji_amyPC += String.fromCodePoint(0x1F4BB);
		Emoji_blueHeart = String.fromCodePoint(0x1F499);
		Emoji_redCross = String.fromCodePoint(0x274C);
		defaultmsg = "LunaBot *v" + VersionNumber + "* " + Emoji_amyPC + Emoji_blueHeart + "\n\n";
		
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
		/*var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://www.cleverbot.com/");
		ifrm.setAttribute("sandbox", "allow-same-origin allow-scripts");
        ifrm.style.width = "0px";
        ifrm.style.height = "0px";
        document.querySelector("#app").appendChild(ifrm);*/
		
		boottime = Date.now();
		DefinitionCobai = document.createElement("div");
		
		clearInterval(initer);
        initialized = 1;
		
		printLog ("Service Restarted!");
		loadSettings();
		setInterval(checkmsg, RetryTime);
	}
}

function updateUser (uid, pts) {
	try {
		uid = uid.split(' ').join('_');
		GeneralXMLHTTPRequest.open("GET", "http://127.0.0.1:2000/?op=2&type=DATA&id=" + encodeURIComponent(uid) + "&pts=" + pts);
		GeneralXMLHTTPRequest.send();
	} catch (err) {
		console.log ("Backend is not running.");
	}
}

function loadSettings () {
	try {
		GeneralXMLHTTPRequest.open("GET", "http://127.0.0.1:2000/?op=1", false);
		GeneralXMLHTTPRequest.send();
		if (GeneralXMLHTTPRequest.status == 200) {
			var responser = GeneralXMLHTTPRequest.responseText.split('\n');
			
			var responselines = responser.length;
			
			for (var i = 0; i < responselines; i++) {
				var line = responser[i];
				line = line.split(' ');
				if (line[0] == "DATA") {
					var id = line[1].split('_').join(' ');
					points[id] = parseFloat(line[2]);
				}
			}
		}
	} catch (err) {
		console.log ("Backend is not running.");
	}
}

function refresher() {
	if (initialized == 1) {
		try {
			GeneralXMLHTTPRequest.open("GET", "http://127.0.0.1:2000/?op=3", false);
			GeneralXMLHTTPRequest.send();
		} catch (err) {
			console.log ("Backend is not running.");
		}
	}
}

function printLog(msg) {
	var children = msgside.children;
	var debugfound = 0;
	logbreak = 1;
	
	for (var i = 0; i < children.length; i++) {
		if (children[i].querySelector("div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span").innerText == debuggroupname) {
			var msgclick = children[i].querySelector ("div > div > div._3j7s9");
			msgclick.dispatchEvent(ClickEvent);
			debugfound = 1;
			
			//Timestamp
			var date = Date().split(' ');
			var printdate = '[' + date[2] + '/' + date[1] + '/' + date[3] + ' ' + date[4] + "] ";
			
			sendmsg(printdate + msg);
			break;
		}
	}
	
	if (debugfound == 0) {
		logbreak = 0;
	}
}

function retrysendmsg (msg) {
	sendmsg(msg);
}

function sendmsg (msg) {
	var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input
	if (input == null) {
		setTimeout(retrysendmsg, RetryTime, msg);
		return;
	}
	
	input.innerHTML = msg;
	input.dispatchEvent(InputMsgEvent);
	var SendButts = document.querySelector("#main > footer > div._3pkkz > div:nth-child(3) > button");
	SendButts.click();
	
	if (logbreak == 1)
		logbreak = 0;
}

function checkmsg() {
	if (logbreak == 0 && switchfreeze == 0) {
		var children = msgside.children;
		
		for (var i = 0; i < children.length; i++) {
			var activity = children[i].querySelector ("div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span");
			if (activity.children.length == 1) {
				var newmsgbubble = activity.querySelector ("div > span");
				var newmsgcount = newmsgbubble.innerHTML;
				var chatname = children[i].querySelector("div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span").innerText.substring(0,26).trim();
				
				if (newmsgcount != "READ" && waitforclever == 0) {
					var msg = children[i].querySelector ("div > div > div._3j7s9");
					msg.dispatchEvent(ClickEvent);
					
					newmsgbubble.innerHTML = "READ";
					engage(chatname, msg);
					break;
				}
			}
		}
	}
}

function retryengage (reqchat, destchat) {
	engage(reqchat, destchat);
}

function engage (reqchatname, destinationchat) {
	try {
		switchfreeze = 1;
		var chatname = document.querySelector("#main > header > div._1WBXd > div._2EbF- > div > span");
		
		if (chatname == null) { //retry
			setTimeout(retryengage, RetryTime, reqchatname, destinationchat);
			return;
		}
		
		chatname = chatname.innerText.substring(0,26).trim(); //GET CHATNAME
		
		if (reqchatname != chatname) {
			destinationchat.dispatchEvent(ClickEvent);
			setTimeout(retryengage, RetryTime, reqchatname, destinationchat);
			return;
		}
		
		//SCROLL DOWN TO BOTTOM
		document.querySelector("#main > div._3zJZ2 > div > div").scroll(0, 100000);
		
		var newmsg = document.querySelector ("#main > div._3zJZ2 > div.copyable-area > div._2nmDZ > div._9tCEa > div:nth-last-child(1) > div > div > div.copyable-text > div > span");
		var msgcount = document.querySelector("#main > div._3zJZ2 > div > div > div._9tCEa").children.length;
		
		var number;
		var name;
		
		for (var i = 1; i <= msgcount; i++) { //Get Sender Info
			var msgbody = document.querySelector("#main > div._3zJZ2 > div > div > div._9tCEa > div:nth-last-child(" + i + ")");
			var msgnumber = msgbody.querySelector("div > div > div._2lc14 > span.RZ7GO");
			var msgname = msgbody.querySelector("span._1wjpf");
			
			if (msgnumber != null) {
				if (msgnumber != null)
					number = msgnumber.innerHTML;
				
				if (msgname != null)
					name = msgname.innerHTML;
				break;
			}
		}
		
		if (newmsg != null)
			resp (newmsg.innerHTML, number, name, chatname);
		
		switchfreeze = 0;
	} catch (err) {
		console.log("ENGAGE ERROR: " + err);
	}
}

function sleep(temp) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, temp);
  });
}

async function resp (str, senderNumber, senderName, chatname) {
	try {
	cnt += 1;
	var printer = defaultmsg;
	var interacted = 0;
	
	//Feedback
	if (str.substring(0,8).toLowerCase() == "good bot" || str.substring(0,7).toLowerCase() == "headpat") {
		printer += "Thanks! I'm happy to help <3";
		goodbot += 1;
		interacted = 1;
	} else if (str.substring(0,7).toLowerCase() == "bad bot" || str.substring(0,8).toLowerCase() == "critique") {
		printer += "Aww... I hope I'll be able to help you better next time.";
		badbot += 1;
		interacted = 1;
	}
	
	if (str.indexOf(defaultmsg.substring(0,13)) == -1 && waitforclever == 0) { //IF MESSAGE IS NOT FROM THE BOT ITSELF
		if (str.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase()) {
			interacted = 1;
			str = str.substring (prefix.length + 1, 4196); //TRIM INPUT
			str = str.trim();
			
			if (str.substring(0, 4).toLowerCase() == "help") {
				printer += "Hi there! You can talk to me by saying *" + prefix + " _message_*, or simply *!message*. If the message is a command from the list below, I will execute it.\n\n";
				printer += "*Command List:*\n";
				printer += "*" + prefix + " ping:* Check if the LunaBot service is online\n";
				printer += "*" + prefix + " weather _city_:* Check weather in any city you like\n";
				printer += "*" + prefix + " say _something_:* Make LunaBot say anything you want! Don't be too silly tho\n";
				printer += "*" + prefix + " ask _question_:* Send WolframAlpha Query (can also solve equations)\n";
				printer += "*" + prefix + " hangman _EN / RO_:* Play a game of Hangman! Works for both ROmanian and ENglish\n";
				printer += "*" + prefix + " dex _word_:* See the specific definitions of any Romanian word\n";
				printer += "*" + prefix + " sendmail:* Send an e-mail from any address, to any address, with any message. (I take 0 responsability for any damage done)\n";
				printer += "*" + prefix + " bet _Amount_ _ChosenNumber_:* Gamble Luna points! Because gambling is fun. And good for the kids.\n";
				printer += "*" + prefix + " quote:* Get a random quote\n";
				printer += "*" + prefix + " joke:* Laugh a bit!\n";
				printer += "*" + prefix + " whoami:* Show sender info.\n";
				printer += "*" + prefix + " whois @user:* Show user info.\n";
				printer += "*" + prefix + " fortune:* Ask the magic cookie about your fortune.\n";
				//printer += "*" + prefix + " responsechance _integer_*: Change the random response chance for this group.\n";

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
				printer += "Prefix: *" + prefix + "*\n";
				printer += "Chat mode: ";
				
				if (usedumb == 1) {
					printer += "*DUMB*\n";
				} else {
					printer += "*SMART*\n";
				}
				
				if (chatname == debuggroupname) {
					printer += "Global response chance: *" + responsechance + "%*\n";
					for (i in respchances)
						printer += "Group _" + i + "_ has a response chance of *" + respchances[i] + "%*\n";
					
				} else {
					if (respchances[chatname] == null) {
						printer += "Random Response Chance: *" + responsechance + "%*\n";
					} else {
						printer += "Random Response Chance: *" + respchances[chatname] + "%*\n";
					}
				}
				
				printer += "\n";
				printer += "Uptime: *"
				
				var totalseconds = Math.floor((Date.now() - boottime)/1000);
				var seconds = totalseconds%60;
				var minutes = Math.floor(totalseconds/60)%60;
				var hours = Math.floor((totalseconds/(60*60)))%24;
				var days = Math.floor(totalseconds/(60*60*24));
				
				if (days != 0) {
					if (days == 1)
						printer += days + " Day, ";
					else
						printer += days + " Days, ";
				}
				
				if (days != 0 || (days == 0 && hours != 0)) {
					if (hours == 1)
						printer += hours + " Hour, ";
					else
						printer += hours + " Hours, ";
				}
				
				if (days != 0 || hours != 0 || (hours == 0 && minutes != 0)) {
					if (minutes == 1)
						printer += minutes + " Minute and ";
					else
						printer += minutes + " Minutes and ";
				}
				
				if (seconds == 1)
					printer += seconds + " Second.*";
				else
					printer += seconds + " Seconds.*";
				
			} else if (str.substring(0, 5).toLowerCase() == "debug") {
				printer += "Welcome to the debugging commands list. Take care.\n\n";
				
				printer += "*Command List:*\n";
				printer += "*" + prefix + " info*: Display config variables.\n";
				printer += "*" + prefix + " restart*: Restart the LunaBot engine.\n";
				printer += "*" + prefix + " switchdumb*: Switch between Dumb and Smart chat mode.\n";
				printer += "*" + prefix + " clear*: Clear the internal message history.\n";
				printer += "*" + prefix + " changeprefix _newPrefix_*: Change The Prefix\n";
				
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
					GeneralXMLHTTPRequest.open("GET", "https://vremeainpulamea.sirb.net/?oras=" + encodeURIComponent(str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")), false);
					GeneralXMLHTTPRequest.send();
					if (GeneralXMLHTTPRequest.status != 200) {
						printer += "Your input *" + str + "* is invalid";
					} else {
						var responser = GeneralXMLHTTPRequest.responseText;
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
				}
				
			} else if (str.substring(0, 3).toLowerCase() == "say") {
				str = str.substring (4);
				if (str == "") {
					printer += "Tell me something to say, too!";
				} else {
					//printer = Emoji_amyPC + Emoji_blueHeart + " " + str;
					printer = str;
				}
				
			} else if (str.substring(0, 3).toLowerCase() == "ask") {
				str = str.substring (4);

				var checker = str.toLowerCase();
				var url = "https://www.wolframalpha.com/input/apiExplorer.jsp?input=" + encodeURIComponent(str) + "&format=minput,plaintext&output=JSON&type=full";
				GeneralXMLHTTPRequest.open("GET", url, false);
				GeneralXMLHTTPRequest.send();
				
				if (GeneralXMLHTTPRequest.status != 200) {
					printer += "Your input *" + str + "* is invalid";
				} else {
					var responser = GeneralXMLHTTPRequest.responseText;
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
				}
			} else if (str.substring(0, 5).toLowerCase() == "quote") {
				GeneralXMLHTTPRequest.open("GET", "https://talaikis.com/api/quotes/random/", false);
				GeneralXMLHTTPRequest.send();
				if (GeneralXMLHTTPRequest.status != 200) {
					printer += "Your input *" + str + "* is invalid";
				} else {
					var responser = GeneralXMLHTTPRequest.responseText;
					var obj = JSON.parse(responser);

					printer += "*Quote By*: " + obj["author"] + "\n\n";
					printer += "_" + obj["quote"] + "_" + "\n";
				}
			} else if (str.substring(0, 4).toLowerCase() == "joke") {
				GeneralXMLHTTPRequest.open("GET", "https://safe-falls-22549.herokuapp.com/random_joke", false);
				GeneralXMLHTTPRequest.send();
				if (GeneralXMLHTTPRequest.status != 200) {
					printer += "Your input *" + str + "* is invalid";
				} else {
					var responser = GeneralXMLHTTPRequest.responseText;
					var obj = JSON.parse(responser);
					printer += jokereplies[Math.floor(Math.random() * jokereplies.length)];
					printer += "\n\n";
					printer += "*" + obj["setup"] + "*";
					printer += "\n";
					printer += "_" + obj["punchline"] + "_";
				}
				
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
				DefinitionCobai.innerHTML = msg; //Strip HTML Tags
				msg = DefinitionCobai.innerText;
				
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
					
					if (frm.indexOf("@") != -1 && to.indexOf("@") != -1) {
						if (Date.now() - lastmail <= 150000) {
							if ((60 - Math.floor(((Date.now() - lastmail)/1000)%60)) >= 10) {
								printer += "Please wait *[0" + (2 - Math.floor(((Date.now() - lastmail)/1000)/60)) + ":" + (60 - Math.floor(((Date.now() - lastmail)/1000)%60)) + "]* before sending a new e-mail.";
							} else {
								printer += "Please wait *[0" + (2 - Math.floor(((Date.now() - lastmail)/1000)/60)) + ":0" + (60 - Math.floor(((Date.now() - lastmail)/1000)%60)) + "]* before sending a new e-mail.";
							}
							sent = 1;
						} else {
							GeneralXMLHTTPRequest.open("GET", "http://127.0.0.1:2000/?op=0&frm=" + encodeURIComponent(frm) + "&to=" + encodeURIComponent(to) + "&msg=" + encodeURIComponent(msg), false);
							GeneralXMLHTTPRequest.send();
							if (GeneralXMLHTTPRequest.status != 200) {
								printer += "Your input *" + str + "* is invalid";
							} else {
								sent = 1;
								lastmail = Date.now();
								printer += "Mail sent!\n\nFrom: *" + frm + "*\n" + "To: *" + to + "*";
							}
						}
					}
				}
				
				if (sent == 0) {
					printer += "Usage:\n\n" + prefix + " sendmail\nFrom: *from@address*\nTo: *to@address*\n_message_";
				}
				
			} else if (str.substring(0, 3).toLowerCase() == "dex") {
				str = str.substring(4);
				
				GeneralXMLHTTPRequest.open("GET", "https://dexonline.ro/definitie/" + encodeURIComponent(str) + "?format=json", false);
				GeneralXMLHTTPRequest.send();
				if (GeneralXMLHTTPRequest.status != 200) {
					printer += "Your input *" + str + "* is invalid";
				} else {
					var obj = JSON.parse(GeneralXMLHTTPRequest.responseText);
					var defs = obj["definitions"];
					
					if (defs.length == 0) {
						printer += "Sorry, the requested word: *" + str + "* doesn't exist.";
					} else {
						printer += "*" + str.toUpperCase() + "*\n";
						
						var defcount = 5;
						if (defs.length < 5)
							defcount = defs.length;
						
						if (defcount == 1)
							printer += "Posting the only *1* definition:\n\n";
						else
							printer += "Posting the first *" + defcount + "* definitions:\n\n";
						
						for (var i = 0; i < defcount; i++) {
							printer += (i + 1) + ". ";
							DefinitionCobai.innerHTML = defs[i]["htmlRep"]; //Strip HTML Tags
							printer += DefinitionCobai.innerText + "\n";
							printer += "*sursa:* " + defs[i].sourceName + ", *adaugata de:* " + defs[i].userNick + "\n\n";
						}
					}
				}
			} else if (str.substring(0, 7).toLowerCase() == "hangman") {
				str = str.substring(8);
				
				if (str.toLowerCase() == "ro") {
					if (hangman[chatname] != null) {
						printer += "Nuking current Hangman session...\n";
					}
					
					GeneralXMLHTTPRequest.open("GET", "https://dexonline.ro/ajax/randomWord.php", false);
					GeneralXMLHTTPRequest.send();
					if (GeneralXMLHTTPRequest.status != 200) {
						printer += "Your input *" + str + "* is invalid";
					} else {
						var word = GeneralXMLHTTPRequest.responseText.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
						hangman[chatname] = {word: word, guesses: ""};
						
						printer += "Alright, let's play! Word is in: *Romanian*. You got *" + 6 + "* tries.\n\n";
						for (var i = 0; i < word.length; i++)
							printer += "_ ";
					}
				} else if (str.toLowerCase() == "en") {
					if (hangman[chatname] != null) {
						printer += "Nuking current Hangman session...\n";
					}
					
					GeneralXMLHTTPRequest.open("GET", "https://randomword.com/", false);
					GeneralXMLHTTPRequest.send();
					if (GeneralXMLHTTPRequest.status != 200) {
						printer += "Your input *" + str + "* is invalid";
					} else {
						var word = GeneralXMLHTTPRequest.responseText.split('"random_word"')[1];
						word = word.substring(1, word.indexOf("<"));
						word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
							
						hangman[chatname] = {word: word, guesses: ""};
						
						printer += "Alright, let's play! Word is in: *English*. You got *" + 6 + "* tries.\n\n";
						for (var i = 0; i < word.length; i++)
							printer += "_ ";
					}
				} else if (str.toLowerCase() == "reset") {
					hangman[chatname] = null;
					printer += "The current Hangman Session has been reset! Type *" + prefix + " hangman EN / RO* to choose a new word.";
				} else {
					printer += "Please Choose either *EN* (English) or *RO* (Romanian):\n*" + prefix + " hangman EN / RO*";
				}
				
			} else if (str.substring(0, 6).toLowerCase() == "whoami") {
				if (senderName == null) {
					printer += "I can't get your info, sorry.";
				} else {
					printer += "Your name is: *" + senderName + "*\n";
					printer += "Your phone number is: *" + senderNumber + "*\n";
					if (points[senderNumber] == null)
						points[senderNumber] = 0;
					printer += "You have *" + points[senderNumber] + "* points.\n";
				}
			} else if (str.substring(0, 5).toLowerCase() == "whois") {
				str = str.substring(6);
				
				if (senderName == null) {
					printer += "I can't get the info, sorry.";
				} else {
					DefinitionCobai.innerHTML = str;
					if (DefinitionCobai.querySelector("span.matched-mention") != null) { //If there's a mention in there
						var name = DefinitionCobai.querySelector("span.matched-mention").innerText.substring(1).trim();
						document.querySelector("#main > header > div._1WBXd").click(); //Open group menu
						console.log (name);
						
						var scroller = document.querySelector("#app > div > div > div.MZIyP > div._3q4NP._2yeJ5 > span > div > span > div > div");
						var done = false;
						
						if (scroller == null) {
							console.log ("OMG NO");
						} else {
							for (var k = 250; k <= 7500 && !done; k += 250) {
								scroller.scroll(0, k);
								
								var members = document.querySelector("#app > div > div > div.MZIyP > div._3q4NP._2yeJ5 > span > div > span > div > div > div > div:nth-child(5) > div:nth-last-child(1) > div").children;
								
								for (var i = 0; i < members.length; i++) {
									var phonenumber = members[i].querySelector("div > div > div._3j7s9 > div._2FBdJ > div > span > span").innerText;
									var showname = members[i].querySelector("div > div > div._3j7s9 > div._1AwDx > div._3Bxar").innerText;
									
									if (showname == name || phonenumber == name) {
										if (showname != null) {
											printer += "Their name is: *" + showname + "*\n";
										}
										
										printer += "Their phone number is: *" + phonenumber + "*\n";
										if (points[phonenumber] == null)
											points[phonenumber] = 0;
										printer += "They have *" + points[phonenumber] + "* points.";
										done = true;
										break;
									}
								}
							}
						}
						if (done == false) {
							printer += "Sorry, I could not find the person... Somehow.";
						}
						
						if (document.querySelector("#app > div > div > div.MZIyP > div._3q4NP._2yeJ5 > span > div > span > div > header > div > div.SFEHG > button") != null) {
							document.querySelector("#app > div > div > div.MZIyP > div._3q4NP._2yeJ5 > span > div > span > div > header > div > div.SFEHG > button").click();
						}
					} else {
						printer += "Please @ someone too, so I can see their profile!";
					}
				}
			} else if (str.substring(0, 7).toLowerCase() == "fortune") {
				printer += "Your fortune: ";
				var choice = Math.floor(Math.random() * 3);
				
				if (choice == 0) {
					printer += "*" + goodfortunes[Math.floor(Math.random() * goodfortunes.length)] + "*";
				} else if (choice == 1) {
					printer += mediumfortunes[Math.floor(Math.random() * mediumfortunes.length)];
				} else if (choice == 2) {
					printer += "_" + badfortunes[Math.floor(Math.random() * badfortunes.length)] + "_";
				}
			} else if (str.substring(0, 5).toLowerCase() == "clear") {
				if (chatname != debuggroupname && false) {
					printer += "Sorry, debug features are only allowed on my debug group.";
				} else {
					str = str.substring(6);
					eraseMSGs();
				}
			} else if (str.substring(0, 9).toLowerCase() == "moneyshot") {
				if (points[senderNumber] == null)
					points[senderNumber] = 0;
				
				if (points[senderNumber] < 1) {
					points[senderNumber] = 50;
					printer += "You got *50 points* as a kickstart :^)";
					updateUser(senderNumber, points[senderNumber]);
				} else {
					printer += "You can only get a moneyshot only if you have *<1 points*.\n";
					printer += "You currently have: *" + points[senderNumber] + "* points.";
				}
			} else if (str.substring(0, 3).toLowerCase() == "bet") {
				str = str.substring(4);
				var num1 = str.substring(0, str.indexOf(' '));
				var num2 = str.substring(str.indexOf(' ') + 1);
				var success = true;
				
				if (num1 != "" && num2 != "") {
					num1 = parseInt(num1);
					num2 = parseInt(num2);
					
					if (isNaN(num1) == false && isNaN(num2) == false) {
						var choice = Math.floor(Math.random() * 100) + 1;
						
						if (points[senderNumber] == null)
							points[senderNumber] = 0;
						
						if (num1 <= points[senderNumber]) {
							num2 = Math.floor(num2);
							if (num2 <= 0)
								num2 = 1;
							if (num2 >= 100)
								num2 = 100;
							
							printer += "You gambled *" + num1 + "* points, with a winning chance of *" + num2 + "%*\n";
							if (num1 == points[senderNumber])
								printer += "Woah, are you really gambling it all?\n";
							printer += "...\n\n";
							
							var newpoints = points[senderNumber];
							
							if (choice <= num2) {
								var gain = ((100/num2 - 1)*1.5) * num1;
								newpoints += gain;
								printer += "YOU *WIN*!\n";
								printer += "You've gained *" + gain.toFixed(4) + "* points!";
							} else {
								newpoints -= num1;
								printer += "YOU *LOSE*!\n";
								printer += "You've lost *" + num1 + "* points.";
							}
							
							points[senderNumber] = parseFloat(newpoints.toFixed(4));
							updateUser(senderNumber, points[senderNumber]);
						} else {
							printer += "Woah woah woah, you can't gamble more than you have!\n";
							
							if (points[senderNumber] == null)
								points[senderNumber] = 0;
							
							printer += "You have: *" + points[senderNumber] + "* points.\n\n";
							printer += "_Protip: You can call !Luna moneyshot to get a 50 points kickstart._";
						}
					} else
						success = false;
				} else
					success = false;
				
				if (success == false) {
					printer += "Usage: " + prefix + " bet _Quantity_ _ChosenNumber_\n\n";
					printer += "Rules: You choose a random number. I will choose another random number *from 1 to 100*. If the number I choose is <= than yours, you win points.\n\n";
					printer += "_The smaller the number you choose and the higher the amount gambled, the more points you win :^)_";
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
				str = str.substring(15);
				if (str == "" || isNaN(parseInt(str))) {
					printer += "Usage: " + prefix + " responsechance _integer_";
				} else {
					var newchance = parseInt(str);
					
					if (newchance > 100)
						newchance = 100;
					if (newchance < 0)
						newchance = 0;
					
					if (chatname == debuggroupname)
						responsechance = newchance;
					else
						respchances[chatname] = newchance;
					
					printer += "Random response chance is now *" + newchance + "%*";
				}
			} else if (str.substring(0, 7).toLowerCase() == "restart") {
				if (chatname != debuggroupname) {
					printer += "Sorry, debug features are only allowed on my debug group.";
				} else {
					printer += "Restarting...";
					restart = 1;
				}
			} else if (str.substring(0, 10).toLowerCase() == "switchdumb") {
				if (usedumb == 1) {
					usedumb = 0;
					printer += "Chat mode set on: *SMART*.\n\n";
					printer += smartreplies[Math.floor(Math.random() * smartreplies.length)];
				} else {
					usedumb = 1;
					printer += "Chat mode set on: *DUMB*.\n\n";
					printer += dumbreplies[Math.floor(Math.random() * dumbreplies.length)];
				}
			} else { //asume chatting
				DefinitionCobai.innerHTML = str; //clear msg
				str = DefinitionCobai.innerText;
						
				if (usedumb == 0) {
					document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
					waitforclever = 1;
					clever = setInterval(clevercheck, 100);
				} else
					printer = getMitsukuResponse(str);
			}
		} else if (str.substring(0,1).toLowerCase() == "!") { //interpret as msg
			str = str.substring(1);
			DefinitionCobai.innerHTML = str; //clear msg
			str = DefinitionCobai.innerText;
			
			interacted = 1;
			
			if (usedumb == 0) {
				document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
				waitforclever = 1;
				clever = setInterval(clevercheck, 100);
			} else
				printer = getMitsukuResponse(str);
			
		} else if (interacted != 1) {
			if (hangman[chatname] != null) {
				if (str.length == 1) {
					interacted = 1;
					str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
					
					var word = hangman[chatname].word;
					
					if (hangman[chatname].guesses.toLowerCase().indexOf(str) != -1) {
						printer += "The letter *" + str.toUpperCase() + "* has already been tried!\n\n";
					} else if (str < "a" || str > "z") {
						printer += "*" + str + "* is not a Letter!\n\n";
					} else {
						if (word.indexOf(str) == -1) {
							printer += "Wrong Guess: *" + str.toUpperCase() + "*\n\n";
							hangman[chatname].guesses += str;
						} else {
							printer += "Correct Guess: *" + str.toUpperCase() + "*!\n\n";
							hangman[chatname].guesses += str.toUpperCase(); //Correct Guess: Uppercase
							word = word.split(str).join(str.toUpperCase());
							
							if (points[senderNumber] == null) {
								points[senderNumber] = 0;
							}
							
							points[senderNumber] += 1;
							updateUser(senderNumber, points[senderNumber]);
						}
						
						hangman[chatname].word = word;
					}
					
					if (word == word.toUpperCase()) {
						printer += "Congratulations! Word is:\n";
						printer += "*" + word + "*";
						hangman[chatname] = null;
					} else {
						var badguesses = 0;
						
						for (var i = 0; i < hangman[chatname].guesses.length; i++) {
							if (hangman[chatname].guesses[i] == hangman[chatname].guesses[i].toLowerCase())
								badguesses++;
						}
						
						if (badguesses >= 6) {
							printer += "You have just reached *" + 6 + "* Bad guesses. Game over!\n";
							printer += "Correct Word was: *" + hangman[chatname].word.toUpperCase() + "*";
							hangman[chatname] = null;
						} else {
							for (var i = 0; i < word.length; i++) {
								if (word[i] == word[i].toUpperCase())
									printer += word[i] + " ";
								else
									printer += "_ ";
							}
							
							printer += "\n\n";
							printer += "Letters Tried: ";
						
							for (var i = 0; i < hangman[chatname].guesses.length; i++) {
								printer += hangman[chatname].guesses[i].toUpperCase() + " ";
							}
							
							printer += "\n";
							printer += "Bad Guesses: *" + badguesses + "*";
						}
					}
				}
			} else {
				DefinitionCobai.innerHTML = str; //clear msg
				str = DefinitionCobai.innerText;
				
				var resp = responsechance;
				if (respchances[chatname] != null)
					resp = respchances[chatname];
				
				if (Math.floor(Math.random() * 100) < resp) { //Use cleverbot either way. It's safer.
					interacted = 1;
					document.querySelector("#app > iframe").contentWindow.cleverbot.sendAI(str);
					waitforclever = 1;
					clever = setInterval(clevercheck, 100);
				}
			}
		}
	}
	
	if (interacted == 1 && waitforclever == 0) {
		if (printer == defaultmsg)
			printer += "Your input: *" + str + "* did not return anything from the LunaBot engine.";
		
		sendmsg(printer);
		
		if (restart == 1) {
			restart = 0;
			setTimeout(function(){ try {GeneralXMLHTTPRequest.open("GET", "http://127.0.0.1:2000/?op=3", false); GeneralXMLHTTPRequest.send(); } catch (err) {}}, 3000);
		}
	}
	
	//Erase after X messages
	if (cnt == 20) {
		cnt = 0;
		eraseMSGs();
	}
	} catch (err) {
		console.log("RESP ERROR: " + err);
	}
}

function eraseMSGs () {
	try {
		document.querySelector("#main > header > div._1i0-u > div > div:nth-child(3) > div").dispatchEvent(ClickEvent);
		document.querySelector("#main > header > div._1i0-u > div > div.rAUz7._3TbsN > span > div > ul > li:nth-child(4)").dispatchEvent(ClickEvent);
		document.querySelector("#main > header > div._1i0-u > div > div.rAUz7._3TbsN > span > div > ul > li:nth-child(4) > div").click();
		document.querySelector("#app > div > span:nth-child(3) > div > div > div > div > div > div > div._3QNwO > div._1WZqU.PNlAR").click();
	} catch (err) {
	
	}	
}

function getMitsukuResponse (str) {
	GeneralXMLHTTPRequest.open("POST", "https://miapi.pandorabots.com/talk?botkey=n0M6dW2XZacnOgCWTp0FRaadjiO5TASZD_5OKHTs9hqAp62JnACkE6BQdHSvL1lL7jiC3vL-JS0~&input=" + encodeURIComponent(str.replace(/luna/gi, "Mitsuku")) + "&client_name=cw166ad198f3f&sessionid=402959793&channel=6", false);
	GeneralXMLHTTPRequest.send();
	
	if (GeneralXMLHTTPRequest.status != 200) {
		return defaultmsg + "Your input *" + str + "* is invalid";
	} else {
		var responser = GeneralXMLHTTPRequest.responseText;
		var obj = JSON.parse(responser);
		
		var tempres = obj["responses"][0];
		tempres = tempres.replace(/\r?\n|\r/g, " ");
		tempres = tempres.replace(/\t/g, " ");
		tempres = tempres.replace(/mitsuku/gi, "Luna");
		tempres = tempres.replace(/mousebreaker/gi, "Amy");
		
		var ret = tempres[0]; //First Char
		
		for (var i = 1; i < tempres.length; i++) {
			if (tempres[i] == " ") {
				if (tempres[i] != tempres[i - 1]) {
					ret += " ";
				}
			} else {
				ret += tempres[i];
			}
		}
		
		return ret;
	}
}

function clevercheck () {
	if (waitforclever == 1) {
		if (document.querySelector("#app > iframe").contentWindow.cleverbot.aistate == 0) {
			waitforclever = 0;
			var printer = document.querySelector("#app > iframe").contentWindow.cleverbot.reply;
			sendmsg(printer);
			
			clearInterval(clever);
		}
	}
}
})();
