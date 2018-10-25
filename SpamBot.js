// ==UserScript==
// @name         SpamBot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Simple WhatsApp Spambot
// @author       You
// @match        https://web.whatsapp.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

var initTimer = setInterval(init, 1000);
var running = false;

var SendMSG;
var InputEvt;

function init(){
	if(document.getElementsByClassName("app-wrapper-web bFqKf")[0] != null){
		var style = document.createElement('style');
		style.innerHTML = '.MODDED { background-color: #00000000; width: 100%; height: 100%}';
		document.head.appendChild(style);
		document.querySelector("#app > div").className = "MODDED app-wrapper-web bFqKf";
		document.body.style.backgroundImage = 'url(https://github.com/MoonfireSeco/puteri2/raw/master/bg_sakura.png)'; //Set a nice Background

		var SpamGUI = document.createElement("header");
		SpamGUI.className = "_3auIg";
		SpamGUI.innerHTML = `With love from Amy 💙`;
		SpamGUI.innerHTML += `<input type='text' id='SpamMessage' placeholder='Message to Spam' size='19' class='selectable-text invisible-space copyable-text'>`;
		SpamGUI.innerHTML += `<div id='StopSpam' title='Stop' style='margin-left: 10px; cursor:pointer;'> <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='30' height='30'> <path opacity='.45' fill='#263238' d='M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z'></path></svg></div>`;
		SpamGUI.innerHTML += `<div id='StartSpam' title='Start' style='margin-left: 10px;cursor:pointer;'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path opacity=".4" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg></div>`;
		
		document.querySelector("#side").insertBefore(SpamGUI, document.querySelector("#side > header").nextSibling);
		
		document.getElementById("StartSpam").addEventListener("click", StartSpam);
		document.getElementById("StopSpam").addEventListener("click", StopSpam);
		
		InputEvt = new InputEvent('input', {
			bubbles: true,
			composer: true
		});
		
		clearInterval(initTimer);
	}
}

function StopSpam () {
	running = false;
	clearInterval(SendMSG);
}

function SendMessage () {
	var LastMessageTime = document.querySelector("#main > div._3zJZ2 > div.copyable-area > div._2nmDZ > div._9tCEa > div.vW7d1:last-child > div._3_7SH._3DFk6.message-out > div > div._2f-RV > div > span");
	
	var OK = false;
	if (LastMessageTime != null) { //If message is ours
		LastMessageTime.innerHTML = "Spam";
		var MessageStatus = document.querySelector("#main > div._3zJZ2 > div.copyable-area > div._2nmDZ > div._9tCEa > div.vW7d1:last-child > div > div > div._2f-RV > div > div > span");
		if (MessageStatus.getAttribute("data-icon") != "msg-time") {
			OK = true;
		}
	} else { //If message is not ours
		OK = true;
	}
	
	if (OK) {
		var message = document.getElementById("SpamMessage").value; // Get text to spam
		if (message == "")
			message = "‫"; //Hidden Char
			
		var input = document.querySelector("#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text");  // Select the input box
		input.innerHTML = message; 
		input.dispatchEvent(InputEvt);
			
		var SendButton = document.querySelector("#main > footer > div._3pkkz > div.weEq5 > button._35EW6");
		SendButton.click();
	}
}

function StartSpam(){
	if (running == false) {
		running = true;
		SendMessage();
		SendMSG = setInterval(SendMessage, 10);
	}
}

})();