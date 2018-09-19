chromium --user-data-dir="/home/cadence/LunaBot" --disable-web-security &
xterm -e python smtpserver &
while true; do xterm -e python LunaBotDiscord.py; done