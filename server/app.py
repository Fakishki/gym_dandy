from flask import Flask, request, make_response, abort, session, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound, Unauthorized
from flask_cors import CORS

from config import app, db, api

CORS(app)
# Authenticaiton / Authorization

#1. Creating my user class
class Signup(Resource):
    def post(self):
        form_json = request.get_json()
        new_user = User(
            username=form_json["username"],
            email=form_json["email"]
        )
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id # sessions hash holds my new user between requests
        response = make_response(
            new_user.to_dict(),
            201
        )
        return response
api.add_resource(Signup, "/signup")


if __name__ == "__main__":
    app.run(port=5000, debug=True)