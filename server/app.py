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

#! NEED TO FIGURE OUT HOW TO GET THE POST METHOD TO WORK WITH THE USER
@app.route("/workouts/<int:id>", methods=["GET", "DELETE", "PATCH"])
def workout_by_id(id):
    workout = Workout.query.filter(Workout.id == id).one_or_none()
    if request.method == "GET":
        if workout:
            return workout.to_dict()
        else:
            return {"error": "404: Workout not found"}, 404
    elif request.method == "DELETE":
        if workout:
            db.session.delete(workout)
            db.session.commit()
            return {"message": f"Workout {workout.id} Deleted"}, 200
        return {"error": "404: Workout not found"}, 404
    elif request.method == "PATCH":
        fields = request.get_json()
        if fields is None:
            return {"error": "400: PATCH request body missing"}, 400
        if workout:
            if "weigh_in" in fields:
                workout.weigh_in = fields["weigh_in"]
            db.session.commit()
            return workout.to_dict(), 200
        else:
            return {"error": "404: Workout not found"}, 404

@app.route("/strengths", methods=["GET", "POST"])
def strengths():
    if request.method == "GET":
        return [strength.to_dict() for strength in Strength.query.all()]
    elif request.method == "POST":
        fields = request.get_json()
        try:
            strength = Strength(
                name=fields.get("name"),
                equipment=fields.get("equipment"),
                favorite=fields.get("favorite")
            )
            db.session.add(strength)
            db.session.commit()
            return strength.to_dict(), 201
        except ValueError:
            return {"error": "400: Strength POST Validation Error"}, 400

#! NEED TO FIGURE OUT HOW TO GET THE POST METHOD TO WORK WITH THE USER
@app.route("/strengths/<int:id>", methods=["GET", "DELETE", "PATCH"])
def strength_by_id(id):
    strength = Strength.query.filter(Strength.id == id).one_or_none()
    if request.method == "GET":
        if strength:
            return strength.to_dict()
        else:
            return {"error": "404: Strength not found"}, 404
    elif request.method == "DELETE":
        if strength:
            db.session.delete(strength)
            db.session.commit()
            return {"message": f"Strength {strength.id} {strength.name} Deleted"}, 200
        return {"error": "404: Strength not found"}, 404
    elif request.method == "PATCH":
        fields = request.get_json()
        if fields is None:
            return {"error": "400: PATCH request body missing"}, 400
        if strength:
            if "name" in fields:
                strength.name = fields["name"]
            if "equipment" in fields:
                strength.equipment = fields["equipment"]
            if "favorite" in fields:
                strength.name = fields["favorite"]
            db.session.commit()
            return strength.to_dict(), 200
        else:
            return {"error": "404: Strength not found"}, 404
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