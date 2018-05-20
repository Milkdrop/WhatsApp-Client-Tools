var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.MODDED { background-color: #00000000; width: 100%; height: 100%; overflow: hidden; }';
document.querySelector("#side > header > div._2umId > div._1WliW > img").src = "https://raw.githubusercontent.com/MoonfireSeco/hello-world/master/ezgif.com-crop%20(1).gif";
document.getElementsByTagName('head')[0].appendChild(style);

document.getElementsByTagName('body')[0].style.backgroundImage='url(https://i.imgur.com/yv71iCt.jpg)' //Set BG :^)
document.getElementById('app').firstChild.className = 'MODDED app-wrapper-web bFqKf ';

var BGimg = document.createElement('img'); // is a node
//BGimg.src = "https://raw.githubusercontent.com/MoonfireSeco/hello-world/master/profilium.png";
var timer = setInterval(general,1000);
var botnet = setInterval(setbotnet,250);
var SpamTimer = 0;
var ChillABit = 0;
var Sending = 0;
//simulate(document.querySelector("#side > header > div._20NlL > div > span > div.rAUz7:last-child > div"), "click");
//simulatedClick(document.getElementById("btn"));
//document.querySelector("#side > header > div._20NlL > div > span > div.rAUz7:last-child > span > div > ul > li:nth-child(1) > div").innerHTML = "freesex"

function setbotnet() {
	var imag = document.querySelector("#app > div > div > div.MZIyP > div._3q4NP.k1feT > span > div > div > div > div._12fSF > div > div > div > div > div > img");
	var chatBG = document.querySelector("#main > div._3zJZ2");
	if (chatBG != null) {
		if (chatBG.childElementCount < 3)
			chatBG.appendChild(BGimg);
	}
	if (imag != null)
	if (imag.src != "https://raw.githubusercontent.com/MoonfireSeco/hello-world/master/ezgif.com-crop%20(1).gif")
		imag.src = "https://raw.githubusercontent.com/MoonfireSeco/hello-world/master/ezgif.com-crop%20(1).gif";
}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

    function general(){
        if(document.getElementsByClassName("app-wrapper-web bFqKf")[0] != null){
            var item2 = document.getElementsByClassName("_3auIg")[0];
            var panel = document.getElementsByClassName("swl8g")[0];
            var SpamBot = item2.cloneNode(true);
            //var MakeGroup = SpamBot.cloneNode(true);
            SpamBot.style.zIndex = 0;                // This way the menu doesn't go below our app
            SpamBot.innerHTML = "With Love from Cad3nce (^˵◕ω◕˵^) <input type='text' id='mensaje' placeholder='Message to Spam' size='19' class='selectable-text invisible-space copyable-text'> <div id='CancelButt' title='PAUSE BOT' data-icon='x' class='' style='margin-left: 10px;cursor:pointer;'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='30' height='30'> <path opacity='.45' fill='#263238' d='M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z'></path></svg></div> <div id='spam' title='START BOT' data-icon=\"send\" class=\"img icon icon-send\" style='margin-left: 10px;cursor:pointer;'><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path opacity=\".4\" d=\"M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z\"></path></svg></div>";
			//MakeGroup.innerHTML += "<br> <br> <br> <div id = 'MakeGR' data-icon='chat' class=''><svg id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path opacity='.55' fill='#263238' d='M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z'></path></svg></div>";
            panel.insertBefore(SpamBot, panel.childNodes[1]);					  // Insert everything we have created
			//panel.insertBefore(MakeGroup, panel.childNodes[2]);					  // Insert everything we have created
            document.getElementById("spam").addEventListener("click", spam);     // Assign a function to the botton
			document.getElementById("CancelButt").addEventListener("click", CancelBoi);
            clearInterval(timer);
        }else{
            console.log("WS Spam: Waiting for whatsapp to load...");
        }
    }
	
	function CancelBoi () {
		Sending = 0;
		clearInterval(dispatch);
	}
	
	function SendMessage () {
		if (Sending == 1) {
			InputEvent = Event || InputEvent;
			var message = document.getElementById("mensaje").value;       // Get text to spam
			var input = document.querySelector("#main > footer > div._3oju3 > div._2bXVy > div > div._2S1VP.copyable-text.selectable-text");  // Select the input
			var evt = new InputEvent('input', {						// Create a new event from type "input"
				bubbles: true,
			composer: true
			});
			input.innerHTML = message;								// Get text to spam
			input.dispatchEvent(evt);								// Fire the event (inserts text) in the input field.
			var SendButts = document.querySelector("#main > footer > div._3oju3 > button._2lkdt");  // Select the button Kek
			SendButts.click();
		}
	}
	
    async function dispatch() {
		ChillABit = 0;
		var LastMessageTime = document.querySelector("#main > div._3zJZ2 > div.copyable-area > div._2nmDZ > div._9tCEa > div.vW7d1:last-child > div._3_7SH._3DFk6.message-out > div > div._2f-RV > div > span");
		if (LastMessageTime != null) {
			if (Sending == 1)
				LastMessageTime.innerHTML = "SCANN3D";
			var MessageSent = document.querySelector("#main > div._3zJZ2 > div.copyable-area > div._2nmDZ > div._9tCEa > div.vW7d1:last-child > div > div > div._2f-RV > div > div > span");
			if (MessageSent.getAttribute("data-icon") == "msg-time") {
				ChillABit = 1;
			}
		}
		
		if (!ChillABit) {
			SendMessage();
		}
    }

    function spam(){
		Sending = 1;
		SendMessage();
		SpamTimer = setInterval(dispatch,10)
    }
	