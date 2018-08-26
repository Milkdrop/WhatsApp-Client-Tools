from chatterbot import ChatBot
from chatterbot.conversation import Statement
import cherrypy

debug = 1

chatbot = ChatBot(
    'dumb',
	logic_adapters=[
        {
            'import_path': 'chatterbot.logic.BestMatch'
        },
        {
            'import_path': 'chatterbot.logic.LowConfidenceAdapter',
            'threshold': 0.60,
            'default_response': "I don't know how to respond to that, YET"
        }
    ],
    #trainer='chatterbot.trainers.UbuntuCorpusTrainer'
    #trainer='chatterbot.trainers.ChatterBotCorpusTrainer'
)

#chatbot.train("chatterbot.corpus.english")

class SRV(object):
	def index(self, msg, prevmsg, listening, chatname):
		print (int(listening) == 0)
		if (int(listening) == 0):
			return str(chatbot.get_response(msg))
		else:
			print ("STATEMENT: " + prevmsg + " RESPONSE: " + msg)
			chatbot.learn_response(Statement(msg), Statement(prevmsg))
			return "OK"
	index.exposed = True
	
conf = {
        '/': {
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/html'), ('Access-Control-Allow-Origin', '*')],
            'server.socket_host': '0.0.0.0',
            'server.socket_port': 8081
        }
}

cherrypy.config.update( {'server.socket_host': '0.0.0.0', 'server.socket_port': 8081} )
cherrypy.quickstart(SRV(), '/', conf)

