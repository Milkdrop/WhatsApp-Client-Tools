from chatterbot import ChatBot
import cherrypy

chatbot = ChatBot(
    'luna',
	logic_adapters=[
        {
            'import_path': 'chatterbot.logic.BestMatch'
        },
        {
            'import_path': 'chatterbot.logic.LowConfidenceAdapter',
            'threshold': 0.90,
            'default_response': "I don't know how to respond to that, YET"
        }
    ],
    trainer='chatterbot.trainers.ChatterBotCorpusTrainer'
)

class SRV(object):
	def index(self, msg):
		return str(chatbot.get_response(msg))
	index.exposed = True
	
conf = {
        '/': {
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/html'), ('Access-Control-Allow-Origin', '*')],
            'server.socket_host': '127.0.0.1',
            'server.socket_port': 8080
        }
    }
	
cherrypy.quickstart(SRV(), '/', conf)

