var timer = setInterval(general,1000);
var SpamTimer = 0;
var ChillABit = 0;
var Sending = 0;

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

    function general(){
        if(document.getElementsByClassName("_1FKgS app-wrapper-web bFqKf")[0] != null){
            var item2 = document.getElementsByClassName("_3auIg")[0];
            var panel = document.getElementsByClassName("swl8g")[0];
            var element = item2.cloneNode(true);							  // Create text and reps inputs
            element.style.zIndex = 0;                // This way the menu doesn't go below our app
            element.innerHTML = "<br> <br> With Love from Cad3nce (^˵◕ω◕˵^) <br><br><br> <input type='text' id='mensaje' placeholder='Message To Spam' style='margin-right:10px' size='19' class='align-left'> <div id='CancelButt' data-icon='x' class='' style='margin-left: 10px;cursor:pointer;'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='30' height='30'> <path opacity='.45' fill='#263238' d='M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z'></path></svg></div> <div id='spam' data-icon=\"send\" class=\"img icon icon-send\" style='margin-left: 10px;cursor:pointer;'><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path opacity=\".4\" d=\"M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z\"></path></svg></div>";
            panel.insertBefore(element, panel.childNodes[1]);					  // Insert everything we have created
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
	