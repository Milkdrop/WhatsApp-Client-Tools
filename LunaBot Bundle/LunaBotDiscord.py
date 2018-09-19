import os
import discord, platform, asyncio
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.binary_location = '/bin/chromium'

driver = webdriver.Chrome("chromedriver", chrome_options=chrome_options)
driver.get("https://www.cleverbot.com")

client = discord.Client()
token = "NDg0Nzc0NTIyNjYzNDY5MDU5.Dmm5aw.alf_pgAM85inC_vToYp8kdoB0Eg"

@client.event
async def on_ready():
	print('Logged in as')
	print(client.user.name)
	print(client.user.id)
	print('------')
	await client.change_presence(game=discord.Game(name='say !Luna help'))

plspawgs = ["@Gabies stop", "pls pawg", "that's gay", "butt is for homosex in denial", "no need for butt just go back to work", "stop it", "stop fapping"]
awake = ["Yes?", "I'm here", "Listening", "Hoi", "Ahoy good sir"]

defaultmsg = "LunaBot Discord **v1.1** <:lunabot:484805564996517889>:blue_heart:\n\n";
prefix = "!Luna";

@client.event
async def on_message(message):
	if message.author == client.user:
		return
	
	interacted = 0
	printer = defaultmsg;
	str = message.content
	
	if (message.channel.name == "lust-cave"):
		if (str == "pls pawg" or str == "bbpawg"):
			printer = "<:lunabot:484805564996517889> " + random.choice(plspawgs)
			interacted = 1
			
	elif (str[:len(prefix)].lower() == prefix.lower()):
		interacted = 1
		str = str[len(prefix) + 1:]
		
		if (str[:4].lower() == "help"):
			printer += "Heya I'm LunaBot, and I love to talk to people!\nTalk with me by typing **!message**. I sometimes also reply to peeps whenever I feel like it, so beware! I hope you don't mind.\n\n"
			printer += "**Command List:**\n";
			printer += "**!Luna" + " say _something_**: Make LunaBot say anything you want! Don't be too silly tho\n\n";
			
			printer += "_Also pls don't be rude to me I'm a smol bot._\n"
		elif (str[:3].lower() == "say"):
			str = str[4:]
			print (str)
			if (str == ""):
				printer += "Tell me something to say, too!";
			else:
				printer = "<:lunabot:484805564996517889>:blue_heart: " + str
		elif (str[:4].lower() == "ping"):
			printer += "PONG!"
		elif (str == ""):
			printer += random.choice(awake)
		else:
			interacted = 1
			str = str[1:]
			driver.execute_script('cleverbot.sendAI("' + str + '")')
			while (driver.execute_script('return cleverbot.aistate') != 0):
				pass
			printer = "<:lunabot:484805564996517889> " + driver.execute_script('return cleverbot.reply')
			
	elif (str[:1] == "!"):
		interacted = 1
		str = str[1:]
		driver.execute_script('cleverbot.sendAI("' + str + '")')
		while (driver.execute_script('return cleverbot.aistate') != 0):
			pass
		printer = "<:lunabot:484805564996517889> " + driver.execute_script('return cleverbot.reply')
		
	if interacted == 1:
		await client.send_message(message.channel, printer)
	
client.run(token)
driver.close()