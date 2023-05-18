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
    u01 = User(username="wally123", email="wally@wally.com", first_name="Wally", last_name="Pfingsten")
    u02 = User(username="jason123", email="jason@jason.com", first_name="Jason", last_name="Post")
    u03 = User(username="jon123", email="jon@jon.com", first_name="Jon", last_name="Parker")
    u04 = User(username="ghia123", email="ghia@ghia.com", first_name="ghia", last_name="Simmons")
    db.session.add_all([u01,u02,u03,u04])
    db.session.commit()
    print("Users Created")

    print("Creating Workouts")
    w01 = Workout(weigh_in=100, user_id=1)
    w02 = Workout(weigh_in=200, user_id=2)
    w03 = Workout(weigh_in=300, user_id=1)
    w04 = Workout(weigh_in=400, user_id=2)
    w05 = Workout(weigh_in=500, user_id=3)
    w06 = Workout(weigh_in=600, user_id=4)
    w07 = Workout(weigh_in=700, user_id=3)
    w08 = Workout(weigh_in=800, user_id=4)
    db.session.add_all([w01,w02,w03,w04,w05,w06,w07,w08])
    db.session.commit()
    print("Workouts created")

    print("Creating Strengths")
    s01 = Strength(name="Preacher Curl", equipment="Cybex", favorite=True)
    s02 = Strength(name="Chin Assist", equipment="Nautilus", favorite=True)
    s03 = Strength(name="Dip Assist", equipment="Precor", favorite=True)
    s04 = Strength(name="Tricep", equipment="Cables", favorite=False)
    s05 = Strength(name="Vertical Press", equipment="Cybex", favorite=True)
    s06 = Strength(name="Leg Extend", equipment="Nautilus", favorite=True)
    s07 = Strength(name="Pullup", equipment="Precor", favorite=True)
    s08 = Strength(name="Overhead", equipment="Cables", favorite=False)
    db.session.add_all([s01,s02,s03,s04,s05,s06,s07,s08])
    db.session.commit()
    print("Strengths created")

    print("Creating Cardios")
    c01 = Cardio(name="Run", equipment="Track - Indoor", favorite=True)
    c02 = Cardio(name="Walk", equipment="Track - Outdoor", favorite=True)
    c03 = Cardio(name="Swim", equipment="Pool", favorite=True)
    c04 = Cardio(name="Ride", equipment="Bicycle", favorite=False)
    c05 = Cardio(name="Hike", equipment="Trail", favorite=True)
    c06 = Cardio(name="Swim", equipment="Open Water", favorite=True)
    c07 = Cardio(name="Stretch", equipment="Pilates", favorite=True)
    c08 = Cardio(name="Sprint", equipment="Track - Outdoor", favorite=False)
    db.session.add_all([c01,c02,c03,c04,c05,c06,c07,c08])
    db.session.commit()
    print("Cardios created")

    print("Creating Strenth Exercises")
    se01 = StrengthExercise(weight=10, sets=3, reps=12, strength_id=1, workout_id=1)
    se02 = StrengthExercise(weight=20, sets=3, reps=12, strength_id=2, workout_id=2)
    se03 = StrengthExercise(weight=30, sets=3, reps=12, strength_id=3, workout_id=3)
    se04 = StrengthExercise(weight=40, sets=3, reps=12, strength_id=4, workout_id=4)
    se05 = StrengthExercise(weight=10, sets=3, reps=12, strength_id=5, workout_id=1)
    se06 = StrengthExercise(weight=20, sets=3, reps=12, strength_id=6, workout_id=2)
    se07 = StrengthExercise(weight=30, sets=3, reps=12, strength_id=7, workout_id=3)
    se08 = StrengthExercise(weight=40, sets=3, reps=12, strength_id=8, workout_id=4)
    se09 = StrengthExercise(weight=10, sets=3, reps=12, strength_id=1, workout_id=5)
    se10 = StrengthExercise(weight=20, sets=3, reps=12, strength_id=2, workout_id=6)
    se11 = StrengthExercise(weight=30, sets=3, reps=12, strength_id=3, workout_id=7)
    se12 = StrengthExercise(weight=40, sets=3, reps=12, strength_id=4, workout_id=8)
    se13 = StrengthExercise(weight=10, sets=3, reps=12, strength_id=5, workout_id=5)
    se14 = StrengthExercise(weight=20, sets=3, reps=12, strength_id=6, workout_id=6)
    se15 = StrengthExercise(weight=30, sets=3, reps=12, strength_id=7, workout_id=7)
    se16 = StrengthExercise(weight=40, sets=3, reps=12, strength_id=8, workout_id=8)
    db.session.add_all([se01,se02,se03,se04,se05,se06,se07,se08,se09,se10,se11,se12,se13,se14,se15,se16])
    db.session.commit()
    print("Strength exercises created")

    print("Creating Cardio Exercises")
    ce01 = CardioExercise(distance=10, units="miles", time="1:11", cardio_id=1, workout_id=1)
    ce02 = CardioExercise(distance=20, units="kilometers", time="2:22", cardio_id=2, workout_id=2)
    ce03 = CardioExercise(distance=30, units="miles", time="3:33", cardio_id=3, workout_id=3)
    ce04 = CardioExercise(distance=40, units="kilometers", time="4:44", cardio_id=4, workout_id=4)
    ce05 = CardioExercise(distance=10, units="miles", time="1:11", cardio_id=1, workout_id=5)
    ce06 = CardioExercise(distance=20, units="kilometers", time="2:22", cardio_id=2, workout_id=6)
    ce07 = CardioExercise(distance=30, units="miles", time="3:33", cardio_id=3, workout_id=7)
    ce08 = CardioExercise(distance=40, units="kilometers", time="4:44", cardio_id=4, workout_id=8)
    ce09 = CardioExercise(distance=10, units="miles", time="1:11", cardio_id=5, workout_id=1)
    ce10 = CardioExercise(distance=20, units="kilometers", time="2:22", cardio_id=6, workout_id=2)
    ce11 = CardioExercise(distance=30, units="miles", time="3:33", cardio_id=7, workout_id=3)
    ce12 = CardioExercise(distance=40, units="kilometers", time="4:44", cardio_id=8, workout_id=4)
    ce13 = CardioExercise(distance=10, units="miles", time="1:11", cardio_id=5, workout_id=5)
    ce14 = CardioExercise(distance=20, units="kilometers", time="2:22", cardio_id=6, workout_id=6)
    ce15 = CardioExercise(distance=30, units="miles", time="3:33", cardio_id=7, workout_id=7)
    ce16 = CardioExercise(distance=40, units="kilometers", time="4:44", cardio_id=8, workout_id=8)
    db.session.add_all([ce01,ce02,ce03,ce04,ce05,ce06,ce07,ce08,ce09,ce10,ce11,ce12,ce13,ce14,ce15,ce16])
    db.session.commit()
    print("Cardio exercises created")

