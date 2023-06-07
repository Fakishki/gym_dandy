from flask import request, make_response, abort, session, jsonify, current_app
from flask_restful import Resource
from werkzeug.exceptions import NotFound, Unauthorized
from flask_cors import CORS
from config import app, db, api, Flask
from models import Workout, StrengthExercise, CardioExercise, Strength, Cardio, User
from sqlalchemy import func, and_
from sqlalchemy.orm import contains_eager, joinedload
from datetime import datetime, timedelta
import logging

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
        user_id = fields.get("user_id")
        try:
            weigh_in_int = None if weigh_in is None else int(weigh_in)
            workout = Workout(
                weigh_in=weigh_in_int,
                user_id=user_id
            )
            db.session.add(workout)
            db.session.commit()
            return workout.to_dict(), 201
        except ValueError:
            return {"error": "400: Workout POST Validation Error"}, 400

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
                # workout.weigh_in = fields["weigh_in"]                
                try:
                    weigh_in = None if fields["weigh_in"] is None else int(fields["weigh_in"])
                    workout.weigh_in = weigh_in

                    db.session.commit()
                    return workout.to_dict(), 200
                except ValueError:
                    return {"error": "400: Invalid weigh_in value"}, 400
        else:
            return {"error": "404: Workout not found"}, 404

@app.route("/strengths", methods=["GET", "POST"])
def strengths():
    if request.method == "GET":
        return [strength.to_dict() for strength in Strength.query.all()]
    elif request.method == "POST":
        fields = request.get_json()
        name = fields.get("name")
        equipment = fields.get("equipment")
        favorite = fields.get("favorite")
        if not name or not isinstance(name, str):
            return {"error": "400: Invalid name field"}, 400
        if not equipment or not isinstance(equipment, str):
            return {"error": "400: Invalid equipment field"}, 400
        if not isinstance(favorite, bool):
            return {"error": "400: Invalid favorite field"}, 400
        try:
            strength = Strength(
                name=name,
                equipment=equipment,
                favorite=favorite
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
            name = fields.get("name")
            equipment = fields.get("equipment")
            favorite = fields.get("favorite")            
            if name is not None:
                if not name or not isinstance(name, str):
                    return {"error": "400: Invalid name field"}, 400
                strength.name = name               
            if equipment is not None:
                if not equipment or not isinstance(equipment, str):
                    return {"error": "400: Invalid equipment field"}, 400
                strength.equipment = equipment               
            if favorite is not None:
                if not isinstance(favorite, bool):
                    return {"error": "400: Invalid favorite field"}, 400
                strength.favorite = favorite
            db.session.commit()
            return strength.to_dict(), 200
        else:
            return {"error": "404: Strength not found"}, 404

@app.route("/strength_equipment", methods=["GET"])
def get_strength_equipment():
    return {"equipment": Strength.strength_equipment}, 200

@app.route("/equipment_strength", methods=["GET"])
def get_equipment_strength():
    return {"equipment": Strength.equipment_strength}, 200

@app.route("/cardios", methods=["GET", "POST"])
def cardios():
    if request.method == "GET":
        return [cardio.to_dict() for cardio in Cardio.query.all()]
    elif request.method == "POST":
        fields = request.get_json()
        name = fields.get("name")
        equipment = fields.get("equipment")
        favorite = fields.get("favorite")
        if not name or not isinstance(name, str):
            return {"error": "400: Invalid name field"}, 400
        if not equipment or not isinstance(equipment, str):
            return {"error": "400: Invalid equipment field"}, 400
        if not isinstance(favorite, bool):
            return {"error": "400: Invalid favorite field"}, 400
        try:
            cardio = Cardio(
                name=name,
                equipment=equipment,
                favorite=favorite
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
            name = fields.get("name")
            equipment = fields.get("equipment")
            favorite = fields.get("favorite")            
            if name is not None:
                if not name or not isinstance(name, str):
                    return {"error": "400: Invalid name field"}, 400
                cardio.name = name               
            if equipment is not None:
                if not equipment or not isinstance(equipment, str):
                    return {"error": "400: Invalid equipment field"}, 400
                cardio.equipment = equipment               
            if favorite is not None:
                if not isinstance(favorite, bool):
                    return {"error": "400: Invalid favorite field"}, 400
                cardio.favorite = favorite
            db.session.commit()
            return cardio.to_dict(), 200
        else:
            return {"error": "404: Cardio not found"}, 404
        
@app.route("/cardio_equipment", methods=["GET"])
def get_cardio_equipment():
    return {"equipment": Cardio.cardio_equipment}, 200

@app.route("/equipment_cardio", methods=["GET"])
def get_equipment_cardio():
    return {"equipment": Cardio.equipment_cardio}, 200

@app.route("/strength_exercises", methods=["GET", "POST"])
def strength_exercises():
    if request.method == "GET":
        user_id = session.get("user_id")
        strength_exercises = StrengthExercise.query.join(Workout).filter(Workout.user_id == user_id).all()
        return [strength_exercise.to_dict() for strength_exercise in strength_exercises]
    elif request.method == "POST":
        fields = request.get_json()
        workout_id = fields.get("workout_id")
        strength_id = fields.get("strength_id")
        weight = fields.get("weight")
        sets = fields.get("sets")
        reps = fields.get("reps")
        if not workout_id:
            return {"error": "400: Invalid workout_id"}, 400
        if not strength_id:
            return {"error": "400: Invalid strength_id"}, 400
        if not weight:
            return {"error": "400: Invalid weight"}, 400
        if not sets:
            return {"error": "400: Invalid sets"}, 400
        if not reps:
            return {"error": "400: Invalid reps"}, 400
        try:
            strength_exercise = StrengthExercise(
                workout_id=workout_id,
                strength_id=strength_id,
                weight=weight,
                sets=sets,
                reps=reps
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
            db.session.delete(strength_exercise)
            db.session.commit()
            return {"message": f"StrengthExercise {strength_exercise.id} Deleted"}, 200
            #! For if we don't want to allow users to delete strength_exercises
            # return {"error": "405: Users not allowed to delete strength_exercises"}, 405
        return {"error": "404: StrengthExercise not found"}, 404            
    elif request.method == "PATCH":
        fields = request.get_json()
        if fields is None:
            return {"error": "400: PATCH request body missing"}, 400
        if strength_exercise:
            weight = fields.get("weight")
            sets = fields.get("sets")
            reps = fields.get("reps")
            if weight is not None:
                if not weight:
                    return {"error": "400: Invalid weight field"}, 400
                strength_exercise.weight = weight
            if sets is not None:
                if not sets:
                    return {"error": "400: Invalid sets field"}, 400
                strength_exercise.sets = sets
            if reps is not None:
                if not reps:
                    return {"error": "400: Invalid reps field"}, 400
                strength_exercise.reps = reps
            db.session.commit()
            return strength_exercise.to_dict(), 200
        else:
            return {"error": "404: StrengthExercise not found"}, 404

#!Added to make AddStrengthExercise.js work
@app.route("/unique_strength_exercises/<int:id>", methods=["GET"])
def get_unique_strength_exercises(id):
    user_id = id
    # user_id = request.args.get("user_id")
    strength_exercises = db.session.query(StrengthExercise).join(
        Workout,
        StrengthExercise.workout_id == Workout.id
    ).filter(
        Workout.user_id == user_id
    ).all()
    seen = set()
    unique_strength_exercises = []
    for exercise in strength_exercises:
        if exercise.strength is None:
            current_app.logger.info(f'Exercise: {exercise} has no associated strength')
            continue
        current_app.logger.info(f'Exercise: {exercise}, Strength: {exercise.strength}')
        # create a tuple with name and equipment
        name_equipment_tuple = (exercise.strength.name, exercise.strength.equipment)
        if name_equipment_tuple not in seen:
            unique_strength_exercises.append(exercise)
            seen.add(name_equipment_tuple)
    #! OLD VERSION
    # for exercise in strength_exercises:
    #     # Debugging
    #     if exercise.strength is None:
    #         current_app.logger.info(f'Exercise: {exercise} has no associated strength')
    #         continue
    #     current_app.logger.info(f'Exercise: {exercise}, Strength: {exercise.strength}')
    #     if exercise.strength.name not in seen:
    #         unique_strength_exercises.append(exercise)
    #         seen.add(exercise.strength.name)
    response = make_response([exercise.to_dict() for exercise in unique_strength_exercises], 200)
    return response

@app.route("/cardio_exercises", methods=["GET", "POST"])
def cardio_exercises():
    if request.method == "GET":
        user_id = session.get("user_id")
        cardio_exercises = CardioExercise.query.join(Workout).filter(Workout.user_id == user_id).all()
        return [cardio_exercise.to_dict() for cardio_exercise in cardio_exercises]
    elif request.method == "POST":
        fields = request.get_json()
        workout_id = fields.get("workout_id")
        cardio_id = fields.get("cardio_id")
        distance = fields.get("distance")
        units = fields.get("units")
        _time = fields.get("_time")
        if not workout_id:
            return {"error": "400: Invalid workout_id"}, 400
        if not cardio_id:
            return {"error": "400: Invalid cardio_id"}, 400
        if not distance:
            return {"error": "400: Invalid distance"}, 400
        if not units:
            return {"error": "400: Invalid units"}, 400
        if not _time:
            return {"error": "400: Invalid time"}, 400
        try:
            cardio_exercise = CardioExercise(
                workout_id=workout_id,
                cardio_id=cardio_id,
                distance=distance,
                units=units,
                _time=_time
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
            db.session.delete(cardio_exercise)
            db.session.commit()
            return {"message": f"CardioExercise {cardio_exercise.id} Deleted"}, 200
            #! For if we don't want to allow users to delete cardio_exercises
            # return {"error": "405: Users not allowed to delete cardio_exercises"}, 405
        return {"error": "404: CardioExercise not found"}, 404            
    elif request.method == "PATCH":
        fields = request.get_json()
        if fields is None:
            return {"error": "400: PATCH request body missing"}, 400
        if cardio_exercise:
            distance = fields.get("distance")
            units = fields.get("units")
            _time = fields.get("_time")
            if distance is not None:
                if not distance:
                    return {"error": "400: Invalid distance field"}, 400
                cardio_exercise.distance = distance
            if units is not None:
                if not units:
                    return {"error": "400: Invalid units field"}, 400
                cardio_exercise.units = units
            if _time is not None:
                if not _time:
                    return {"error": "400: Invalid _time field"}, 400
                cardio_exercise._time = _time
            db.session.commit()
            return cardio_exercise.to_dict(), 200
        else:
            return {"error": "404: CardioExercise not found"}, 404

#!Added to make AddCardioExercise.js work
@app.route("/unique_cardio_exercises/<int:id>", methods=["GET"])
def get_unique_cardio_exercises(id):
    user_id = id
    # user_id = request.args.get("user_id")
    cardio_exercises = db.session.query(CardioExercise).join(
        Workout,
        CardioExercise.workout_id == Workout.id
    ).filter(
        Workout.user_id == user_id
    ).all()
    seen = set()
    unique_cardio_exercises = []
    for exercise in cardio_exercises:
        if exercise.cardio is None:
            current_app.logger.info(f'Exercise: {exercise} has no associated cardio')
            continue
        current_app.logger.info(f'Exercise: {exercise}, Cardio: {exercise.cardio}')
        # create a tuple with name and equipment
        name_equipment_tuple = (exercise.cardio.name, exercise.cardio.equipment)
        if name_equipment_tuple not in seen:
            unique_cardio_exercises.append(exercise)
            seen.add(name_equipment_tuple)
    #! OLD VERSION
    # for exercise in cardio_exercises:
    #     # Debugging
    #     if exercise.cardio is None:
    #         current_app.logger.info(f'Exercise: {exercise} has no associated cardio')
    #         continue
    #     current_app.logger.info(f'Exercise: {exercise}, Cardio: {exercise.cardio}')
    #     if exercise.cardio.name not in seen:
    #         unique_cardio_exercises.append(exercise)
    #         seen.add(exercise.cardio.name)
    response = make_response([exercise.to_dict() for exercise in unique_cardio_exercises], 200)
    return response

@app.route("/cardio_exercise_units", methods=["GET"])
def get_cardio_exericse_units():
    return {"cardio_exercise_units": CardioExercise.cardio_units}, 200

# Two prev weights Step 4 (Steps 1-3 are in AddStrengthExercise.js)
#! THIS IS GOING TO BE USEFUL FOR CHARTS AND GRAPHS -- ALSO MAYBE THE ACCOMPANYING JS/JSX
@app.route("/previous_strength_exercise_weights/<int:user_id>/<int:strength_id>", methods=["GET"])
def get_previous_weights(user_id, strength_id):
    try:
        weights = StrengthExercise.query.join(Workout).filter(Workout.user_id == user_id, StrengthExercise.strength_id == strength_id).order_by(Workout.created_at.desc()).all()
        if weights:
            return [weight.to_dict() for weight in weights]
        else:
            return {"error": "No previous data"}, 404
    except Exception as e:
        app.logger.error(f"Error fetching weights: {e}")
        return {"error": str(e)}, 500

@app.route("/previous_strength_strength_exercises/<int:user_id>/<int:strength_id>", methods=["GET"])
def get_previous_strength_exercises(user_id, strength_id):
    try:
        weights = StrengthExercise.query.join(Workout).filter(Workout.user_id == user_id, StrengthExercise.strength_id == strength_id).order_by(Workout.created_at.asc()).all()
        if weights:
            return [weight.to_dict() for weight in weights]
        else:
            return {"error": "No previous data"}, 404
    except Exception as e:
        app.logger.error(f"Error fetching weights: {e}")
        return {"error": str(e)}, 500

@app.route("/previous_cardio_cardio_exercises/<int:user_id>/<int:cardio_id>", methods=["GET"])
def get_previous_cardio_exercises(user_id, cardio_id):
    try:
        exercises = CardioExercise.query.join(Workout).filter(
            Workout.user_id == user_id, 
            CardioExercise.cardio_id == cardio_id
        ).order_by(Workout.created_at.desc()).all()

        if exercises:
            return [exercise.to_dict() for exercise in exercises]
        else:
            return {"error": "No previous data"}, 404
    except Exception as e:
        app.logger.error(f"Error fetching cardio exercises: {e}")
        return {"error": str(e)}, 500


@app.route("/analytics_previous_cardio_cardio_exercises/<int:user_id>/<int:cardio_id>", methods=["GET"])
def analytics_get_previous_cardio_exercises(user_id, cardio_id):
    try:
        exercises = CardioExercise.query.join(Workout).filter(
            Workout.user_id == user_id, 
            CardioExercise.cardio_id == cardio_id
        ).order_by(Workout.created_at.asc()).all()

        if exercises:
            return [{
                'distance': exercise.distance,
                'time': exercise.time,
                'units': exercise.units,
                'created_at': exercise.created_at,
                'workout_created_at': exercise.workout.created_at,
                'cardio': {
                    'name': exercise.cardio.name,
                    'equipment': exercise.cardio.equipment
                }
            } for exercise in exercises]
        else:
            return {"error": "No previous data"}, 404
    except Exception as e:
        app.logger.error(f"Error fetching cardio exercises: {e}")
        return {"error": str(e)}, 500

@app.route("/overdue_exercises/<int:user_id>", methods=["GET"])
def get_overdue_exercises(user_id):
    try:
        fourteen_days_ago = datetime.now() - timedelta(days=14)

        # Subqueries to get the most recent workout date for each strength and cardio exercise
        most_recent_strength_workout = db.session.query(StrengthExercise.strength_id, func.max(Workout.created_at).label('max_date')).join(Workout, Workout.id == StrengthExercise.workout_id).filter(Workout.user_id == user_id).group_by(StrengthExercise.strength_id).subquery()
        most_recent_cardio_workout = db.session.query(CardioExercise.cardio_id, func.max(Workout.created_at).label('max_date')).join(Workout, Workout.id == CardioExercise.workout_id).filter(Workout.user_id == user_id).group_by(CardioExercise.cardio_id).subquery()

        # Main queries
        overdue_strengths = Strength.query.filter(
            Strength.id == most_recent_strength_workout.c.strength_id,
            most_recent_strength_workout.c.max_date < fourteen_days_ago,
            Strength.favorite == True
        ).all()

        overdue_cardios = Cardio.query.filter(
            Cardio.id == most_recent_cardio_workout.c.cardio_id,
            most_recent_cardio_workout.c.max_date < fourteen_days_ago,
            Cardio.favorite == True
        ).all()

        return {
            'strengths': [strength.to_dict() for strength in overdue_strengths],
            'cardios': [cardio.to_dict() for cardio in overdue_cardios]
        }
    except Exception as e:
        app.logger.error(f"Error fetching overdue exercises: {e}")
        return {"error": str(e)}, 500


# @app.route("/overdue_exercises/<int:user_id>", methods=["GET"])
# def get_overdue_exercises(user_id):
#     try:
#         fourteen_days_ago = datetime.now() - timedelta(days=14)
        
#         overdue_strengths = Strength.query.join(StrengthExercise).join(Workout).filter(
#             Workout.user_id == user_id, 
#             Workout.created_at < fourteen_days_ago,
#             Strength.favorite == True
#         ).group_by(Strength.id).having(func.max(Workout.created_at) < fourteen_days_ago).all()

#         overdue_cardios = Cardio.query.join(CardioExercise).join(Workout).filter(
#             Workout.user_id == user_id, 
#             Workout.created_at < fourteen_days_ago,
#             Cardio.favorite == True
#         ).group_by(Cardio.id).having(func.max(Workout.created_at) < fourteen_days_ago).all()

#         return {
#             'strengths': [strength.to_dict() for strength in overdue_strengths],
#             'cardios': [cardio.to_dict() for cardio in overdue_cardios]
#         }
#     except Exception as e:
#         app.logger.error(f"Error fetching overdue exercises: {e}")
#         return {"error": str(e)}, 500


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