chromium --user-data-dir="/home/cadence/LunaBot" --disable-web-security &
xterm -e python3 smtpserver &
while true; do xterm -e python LunaBotDiscord.py; done
