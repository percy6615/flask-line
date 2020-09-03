from argparse import ArgumentParser
from dotenv import load_dotenv
from app import FlaskApp
load_dotenv()


app = FlaskApp().getApp()
# log = logging.getLogger('werkzeug')
# log.setLevel(logging.ERROR)
if __name__ == '__main__':
    arg_parser = ArgumentParser(
        usage='Usage: python ' + __file__ + ' [--port <port>] [--help]'
    )
    arg_parser.add_argument('-p', '--port', type=int, default=8000, help='port')
    arg_parser.add_argument('-d', '--debug', default=False, help='debug')
    options = arg_parser.parse_args()
    # app.run(host='0.0.0.0', port=8000, debug=True)
    app.run(host='0.0.0.0', debug=options.debug, port=options.port)
