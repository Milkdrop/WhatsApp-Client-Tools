#coding=utf-8
import os
import discord, platform, asyncio
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.binary_location = '/usr/bin/chromium-browser'

driver = webdriver.Chrome(executable_path="/usr/lib/chromium-browser/chromedriver", chrome_options=chrome_options)
driver.get("https://www.cleverbot.com")

client = discord.Client()
token = "###"

msgs = ["No hack", "Yes hack", "Maybe hack", "Tomorrow hack", "Take a break"]
plspawgs = ["Nu mai vizionati filmulete pornografice.", "Nu va mai uitati la Pornografie.", "Pornografia va distruge vietile.", "Producatorul tau spune: \"Nu canta! Dezbraca-te!\"", "Ce mizerie! Sa nu vada copiii asa ceva.", "Cu adevarat terific.", "Pinguinul nu este de acord cu acest material."]
awake = ["Salut", "Care-i faza?", "Dap", "Merge treaba?", "Ia spune", "Te ascult", "Salut serifule"]
here = ["Sunt.", "Probă Probă. 1 2 3\nPare să meargă.", "Dap", "Prezent"]

defaultmsg = "Pinguinul Stie-Tot **v1.1**\n\n";
prefix = "pinguinule";

@client.event
async def on_ready():
	print('All good! Name: ' + client.user.name)
	await client.change_presence(game=discord.Game(name='?'))
	
@client.event
async def on_message(message):
	if message.author == client.user:
		return
	
	interacted = 0
	printer = defaultmsg;
	str = message.content
	
	if (message.channel.name == "nsfw"):
		if (len(message.attachments) >= 1):
			printer = random.choice(plspawgs)
			interacted = 1
	elif (message.content == "?"):
		printer = random.choice(msgs)
		interacted = 1
	elif (str[:len(prefix)].lower() == prefix.lower()):
		interacted = 1
		str = str[len(prefix) + 1:]
		
		if (str[:5].lower() == "esti?"):
			printer = random.choice(here)
		elif (str == ""):
			printer = random.choice(awake)
		else:
			interacted = 1
			driver.execute_script('cleverbot.sendAI("' + str + '")')
			while (driver.execute_script('return cleverbot.aistate') != 0):
				pass
			printer = driver.execute_script('return cleverbot.reply')
			
	elif (str[:1] == "!"):
		interacted = 1
		driver.execute_script('cleverbot.sendAI("' + str + '")')
		while (driver.execute_script('return cleverbot.aistate') != 0):
			pass
		printer = driver.execute_script('return cleverbot.reply')
		
	if interacted == 1:
		await client.send_message(message.channel, printer)
	
client.run(token)
driver.close()
