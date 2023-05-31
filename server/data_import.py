#!/usr/bin/env python3

from app import app
from models import db, Workout, StrengthExercise, CardioExercise, Strength, Cardio, User

import pandas as pd

df = pd.read_excel('./imports/wally_strength_exercises.xlsx')

# with app.app_context():
#     for index, row in df.iterrows():
#         workout = Workout(user_id=row['user_id'], created_at=row['created_at'])

#         db.session.add(workout)

#     db.session.commit()
# print("Workouts added")

# with app.app_context():
#     for index, row in df.iterrows():
#         strength = Strength(name=row['name'], equipment=row['equipment'], favorite=row['favorite'])

#         db.session.add(strength)

#     db.session.commit()
# print("Strengths added")

with app.app_context():
    for index, row in df.iterrows():
        strength_exercise = StrengthExercise(workout_id=row['workout_id'], weight=row['weight'], strength_id=row['strength_id'], sets=row['sets'], reps=row['reps'])

        db.session.add(strength_exercise)

    db.session.commit()
print("StrengthExercises added")