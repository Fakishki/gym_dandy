from flask import request, make_response, abort, session, jsonify, Flask
from flask_restful import Resource
from werkzeug.exceptions import NotFound, Unauthorized
from flask_cors import CORS
from config import app, db, api
from models import Workout, StrengthExercise, CardioExercise, Strength, Cardio, User

CORS(app)

@app.before_request
def check_if_logged_in():
    open_access_list = [
        "signup",
        "login",
        "logout",
        "authorized"
    ]

    if (request.endpoint) not in open_access_list and (not session.get("user_id")):
        return {"error": "401 Unauthorized - Log in to access"}, 401

@app.route("/workouts", methods=["GET", "POST"])
def workouts():
    if request.method == "GET":
        user_id = request.args.get("user_id")
        if user_id:
            workouts = Workout.query.filter_by(user_id=user_id).all()
            return [workout.to_dict() for workout in workouts]
        else:
            return [workout.to_dict() for workout in Workout.query.all()]
    elif request.method == "POST":
        fields = request.get_json()
        weigh_in = fields.get("weigh_in")
        try:
            weigh_in_int = int(weigh_in)
            workout = Workout(
                weigh_in=weigh_in_int
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
            #! Currently not allowing users to delete strengths
        #     db.session.delete(strength)
        #     db.session.commit()
        #     return {"message": f"Strength {strength.id} {strength.name} Deleted"}, 200
            return {"error": "405: Users not allowed to delete strengths"}, 405
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
                strength.favorite = fields["favorite"]
            db.session.commit()
            return strength.to_dict(), 200
        else:
            return {"error": "404: Strength not found"}, 404

@app.route("/cardios", methods=["GET", "POST"])
def cardios():
    if request.method == "GET":
        return [cardio.to_dict() for cardio in Cardio.query.all()]
    elif request.method == "POST":
        fields = request.get_json()
        try:
            cardio = Cardio(
                name=fields.get("name"),
                equipment=fields.get("equipment"),
                favorite=fields.get("favorite")
            )
            db.session.add(cardio)
            db.session.commit()
            return cardio.to_dict(), 201
        except ValueError:
            return {"error": "400: Cardio POST Validation Error"}, 400

@app.route("/cardios/<int:id>", methods=["GET", "DELETE", "PATCH"])
def cardio_by_id(id):
    cardio = Cardio.query.filter(Cardio.id == id).one_or_none()
    if request.method == "GET":
        if cardio:
            return cardio.to_dict()
        else:
            return {"error": "404: Cardio not found"}, 404
    elif request.method == "DELETE":
        if cardio:
            #! Currently not allowing users to delete cardios
        #     db.session.delete(cardio)
        #     db.session.commit()
        #     return {"message": f"Cardio {cardio.id} {cardio.name} Deleted"}, 200
            return {"error": "405: Users not allowed to delete cardios"}, 405
        return {"error": "404: Cardio not found"}, 404            
    elif request.method == "PATCH":
        fields = request.get_json()
        if fields is None:
            return {"error": "400: PATCH request body missing"}, 400
        if cardio:
            if "name" in fields:
                cardio.name = fields["name"]
            if "equipment" in fields:
                cardio.equipment = fields["equipment"]
            if "favorite" in fields:
                cardio.favorite = fields["favorite"]
            db.session.commit()
            return cardio.to_dict(), 200
        else:
            return {"error": "404: Cardio not found"}, 404
    
@app.route("/strength_exercises", methods=["GET", "POST"])
def strength_exercises():
    if request.method == "GET":
        user_id = session.get("user_id")
        strength_exercises = StrengthExercise.query.join(Workout).filter(Workout.user_id == user_id).all()
        return [strength_exercise.to_dict() for strength_exercise in strength_exercises]
    elif request.method == "POST":
        fields = request.get_json()
        try:
            strength_exercise = StrengthExercise(
                weight=fields.get("weight"),
                sets=fields.get("sets"),
                reps=fields.get("reps")
            )
            db.session.add(strength_exercise)
            db.session.commit()
            return strength_exercise.to_dict(), 201
        except ValueError:
            return {"error": "400: StrengthExercise POST Validation Error"}, 400

@app.route("/strength_exercises/<int:id>", methods=["GET", "DELETE", "PATCH"])
def strength_exercise_by_id(id):
    strength_exercise = StrengthExercise.query.filter(StrengthExercise.id == id).one_or_none()
    if request.method == "GET":
        if strength_exercise:
            return strength_exercise.to_dict()
        else:
            return {"error": "404: StrengthExercise not found"}, 404
    elif request.method == "DELETE":
        if strength_exercise:
            #! Currently not allowing users to delete strength_exercises
        #     db.session.delete(strength_exercise)
        #     db.session.commit()
        #     return {"message": f"StrengthExercise {strength_exercise.id} Deleted"}, 200
            return {"error": "405: Users not allowed to delete strength_exercises"}, 405
        return {"error": "404: StrengthExercise not found"}, 404            
    elif request.method == "PATCH":
        fields = request.get_json()
        if fields is None:
            return {"error": "400: PATCH request body missing"}, 400
        if strength_exercise:
            if "weight" in fields:
                strength_exercise.weight = fields["weight"]
            if "sets" in fields:
                strength_exercise.sets = fields["sets"]
            if "reps" in fields:
                strength_exercise.reps = fields["reps"]
            db.session.commit()
            return strength_exercise.to_dict(), 200
        else:
            return {"error": "404: StrengthExercise not found"}, 404

@app.route("/cardio_exercises", methods=["GET", "POST"])
def cardio_exercises():
    if request.method == "GET":
        user_id = session.get("user_id")
        cardio_exercises = CardioExercise.query.join(Workout).filter(Workout.user_id == user_id).all()
        return [cardio_exercise.to_dict() for cardio_exercise in cardio_exercises]
        return [cardio_exercise.to_dict() for cardio_exercise in CardioExercise.query.all()]
    elif request.method == "POST":
        fields = request.get_json()
        try:
            cardio_exercise = CardioExercise(
                distance=fields.get("distance"),
                units=fields.get("units"),
                _time=fields.get("_time")
            )
            db.session.add(cardio_exercise)
            db.session.commit()
            return cardio_exercise.to_dict(), 201
        except ValueError:
            return {"error": "400: CardioExercise POST Validation Error"}, 400

@app.route("/cardio_exercises/<int:id>", methods=["GET", "DELETE", "PATCH"])
def cardio_exercise_by_id(id):
    cardio_exercise = CardioExercise.query.filter(CardioExercise.id == id).one_or_none()
    if request.method == "GET":
        if cardio_exercise:
            return cardio_exercise.to_dict()
        else:
            return {"error": "404: CardioExercise not found"}, 404
    elif request.method == "DELETE":
        if cardio_exercise:
            #! Currently not allowing users to delete cardio_exercises
        #     db.session.delete(cardio_exercise)
        #     db.session.commit()
        #     return {"message": f"CardioExercise {cardio_exercise.id} Deleted"}, 200
            return {"error": "405: Users not allowed to delete cardio_exercises"}, 405
        return {"error": "404: CardioExercise not found"}, 404            
    elif request.method == "PATCH":
        fields = request.get_json()
        if fields is None:
            return {"error": "400: PATCH request body missing"}, 400
        if cardio_exercise:
            if "distance" in fields:
                cardio_exercise.distance = fields["distance"]
            if "units" in fields:
                cardio_exercise.units = fields["units"]
            if "_time" in fields:
                cardio_exercise._time = fields["_time"]
            db.session.commit()
            return cardio_exercise.to_dict(), 200
        else:
            return {"error": "404: CardioExercise not found"}, 404

@app.route("/users", methods=["GET", "POST"])
def users():
    if request.method == "GET":
        return [user.to_dict() for user in User.query.all()]
    elif request.method == "POST":
        fields = request.get_json()
        try:
            user = User(
                username=fields.get("username"),
                _password_hash=fields.get("_password_hash"),
                email=fields.get("email"),
                first_name=fields.get("first_name"),
                last_name=fields.get("last_name"),
                admin=fields.get("admin")
            )
            db.session.add(user)
            db.session.commit()
            return user.to_dict(), 201
        except ValueError:
            return {"error": "400: User POST Validation Error"}, 400

@app.route("/users/<int:id>", methods=["GET", "DELETE", "PATCH"])
def user_by_id(id):
    user = User.query.filter(User.id == id).one_or_none()
    if request.method == "GET":
        if user:
            return user.to_dict()
        else:
            return {"error": "404: User not found"}, 404
    elif request.method == "DELETE":
        if user:
            #! Currently not allowing users to delete users
        #     db.session.delete(user)
        #     db.session.commit()
        #     return {"message": f"User {user.id} {user.name} Deleted"}, 200
            return {"error": "405: Users not allowed to delete users"}, 405
        return {"error": "404: User not found"}, 404            
    elif request.method == "PATCH":
        fields = request.get_json()
        if fields is None:
            return {"error": "400: PATCH request body missing"}, 400
        if user:
            if "username" in fields:
                user.username = fields["username"]
            if "_password_hash" in fields:
                user._password_hash = fields["_password_hash"]
            if "email" in fields:
                user.email = fields["email"]
            if "first_name" in fields:
                user.first_name = fields["first_name"]
            if "last_name" in fields:
                user.last_name = fields["last_name"]
            if "admin" in fields:
                user.admin = fields["admin"]
            db.session.commit()
            return user.to_dict(), 200
        else:
            return {"error": "404: User not found"}, 404
        
# Authenticaiton / Authorization
class Signup(Resource):
    def post(self):
        form_json = request.get_json()
        new_user = User(
            # first_name=form_json["first_name"],
            # last_name=form_json["last_name"],
            username=form_json["username"],
            password_hash=form_json["password"],
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

class Login(Resource):
    def post(self):
        user = User.query.filter_by(username=request.get_json()["username"]).one_or_none()
        if user and user.authenticate(request.get_json()["password"]):
            session["user_id"] = user.id
            response = make_response(user.to_dict(), 200)
            return response
        else:
            return {"Unauthorized": "You must use a valid login"}, 401
api.add_resource(Login, "/login")

class AuthorizedSession(Resource):
    def get(self):
        try:
            user = User.query.filter_by(id=session["user_id"]).first()
            response = make_response(
                user.to_dict(),
                200
            )
            return response
        except:
            return {"Unauthorized": "You must be logged in to make that request"}, 401
api.add_resource(AuthorizedSession, "/authorized")

class Logout(Resource):
    def delete(self):
        session["user_id"] = None
        response = make_response("Logged out", 204)
        return response
api.add_resource(Logout, "/logout")

if __name__ == "__main__":
    app.run(port=5000, debug=True)