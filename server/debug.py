#!/usr/bin/env python3

from config import app
from models import db, Workout, User, Strength, Cardio, StrengthExercise, CardioExercise

if __name__ == '__main__':
    with app.app_context():
        import ipdb; ipdb.set_trace()