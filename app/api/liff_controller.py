from flask_restful import Resource

print("liff")
class LiffController(Resource):
    def get(self):
        return 200
    def post(self):
        return 200