from flask import request, make_response, abort, session, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound, Unauthorized
from flask_cors import CORS
from config import app, db, api
from models import Workout, StrengthExercise, CardioExercise, Strength, Cardio, User

CORS(app)

@app.route("/workouts", methods=["GET", "POST"])
def workouts():
    if request.method == "GET":
        return [workout.to_dict() for workout in Workout.query.all()]
    elif request.method == "POST":
        fields = request.get_json()
        try:
            workout = Workout(
                weigh_in=fields.get("weigh_in")
            )
            db.session.add(workout)
            db.session.commit()
            return workout.to_dict(), 201
        except ValueError:
            return {"error": "400: Workout POST Validation Error"}, 400


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