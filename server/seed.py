#!/usr/bin/env python3

from random import choice, randint
from faker import Faker

from app import app
from models import db, Workout, StrengthExercise, CardioExercise, Strength, Cardio, User

fake = Faker()

with app.app_context():
    print("Clearing old tables")
    db.session.query(Workout).delete()
    db.session.query(User).delete()
    db.session.query(StrengthExercise).delete()
    db.session.query(CardioExercise).delete()
    db.session.query(Strength).delete()
    db.session.query(Cardio).delete()
    print("Old tables cleared")

    print("Creating Users")
    u01 = User(username="wally", email="wally@wally.com", first_name="Wally", last_name="Pfingsten")
    u02 = User(username="jason", email="jason@jason.com", first_name="Jason", last_name="Post")
    db.session.add_all([u01,u02])
    db.session.commit()
    print("Users Created")

    print("Creating Workouts")
    w01 = Workout(weigh_in=100, user_id=1)
    w02 = Workout(weigh_in=200, user_id=2)
    w03 = Workout(weigh_in=300, user_id=1)
    w04 = Workout(weigh_in=400, user_id=2)
    db.session.add_all([w01,w02,w03,w04])
    db.session.commit()
    print("Workouts created")

    print("Creating Strengths")
    s01 = Strength(name="Preacher Curl", equipment="Cybex", favorite=True)
    s02 = Strength(name="Chin Assist", equipment="Nautilus", favorite=True)
    s03 = Strength(name="Dip Assist", equipment="Precor", favorite=True)
    s04 = Strength(name="Tricep", equipment="Cables", favorite=False)
    db.session.add_all([s01,s02,s03,s04])
    db.session.commit()
    print("Strengths created")

    print("Creating Cardios")
    c01 = Cardio(name="Run", equipment="Track - Indoor", favorite=True)
    c02 = Cardio(name="Walk", equipment="Track - Outdoor", favorite=True)
    c03 = Cardio(name="Swim", equipment="Pool", favorite=True)
    c04 = Cardio(name="Ride", equipment="Bicycle", favorite=False)
    db.session.add_all([c01,c02,c03,c04])
    db.session.commit()
    print("Cardios created")

    print("Creating Strenth Exercises")
    se01 = StrengthExercise(weight=10, sets=3, reps=12, strength_id=1, workout_id=1)
    se02 = StrengthExercise(weight=20, sets=3, reps=12, strength_id=2, workout_id=2)
    se03 = StrengthExercise(weight=30, sets=3, reps=12, strength_id=3, workout_id=3)
    se04 = StrengthExercise(weight=40, sets=3, reps=12, strength_id=4, workout_id=4)
    db.session.add_all([se01,se02,se03,se04])
    db.session.commit()
    print("Strength exercises created")

    print("Creating Cardio Exercises")
    ce01 = CardioExercise(distance=10, units="miles", time="1:11", cardio_id=1, workout_id=1)
    ce02 = CardioExercise(distance=20, units="kilometers", time="2:22", cardio_id=2, workout_id=2)
    ce03 = CardioExercise(distance=30, units="miles", time="3:33", cardio_id=3, workout_id=3)
    ce04 = CardioExercise(distance=40, units="kilometers", time="4:44", cardio_id=4, workout_id=4)
    db.session.add_all([ce01,ce02,ce03,ce04])
    db.session.commit()
    print("Cardio exercises created")

