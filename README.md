# WhatsApp-Client-Tools
For LunaBot:
- Install TamperMonkey and paste the userscript in there, for ease of use. (remember to make it to not interfere with CSP)
- Disable CSP
- Add a custom refferer=https://products.wolframalpha.com/api/explorer/ for http://www.wolframalpha.com
- Allow Mixed Content
- Run your browser with the following parameters: **chromium --user-data-dir="LunaBot" --disable-web-security**
- Also you have to manually set the Origin header as 	https://web.whatsapp.com

For ChatterBot Server:
- pip install chatterbot
- pip install cherrypy

For SMTPspoof:
- sudo apt install expect
