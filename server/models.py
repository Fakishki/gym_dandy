from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

class Workout(db.Model, SerializerMixin):
    __tablename__ = "workouts"

    serialize_rules = (
                    #    "-created_at",
                    #    "-updated_at",
                       "-user.workouts",
                       "-strength_exercises.workout",
                       "-strength_exercises.created_at",
                       "-strength_exercises.updated_at",
                       "-strength_exercises.strength.strength_exercises",
                       "-strength_exercises.strength.created_at",
                       "-strength_exercises.strength.updated_at",
                       "-cardio_exercises.workout",
                       "-cardio_exercises.created_at",
                       "-cardio_exercises.updated_at",
                       "-cardio_exercises.cardio.cardio_exercises",
                       "-cardio_exercises.cardio.created_at",
                       "-cardio_exercises.cardio.updated_at"
                       )

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    weigh_in = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("User", back_populates="workouts")
    strength_exercises = db.relationship("StrengthExercise", back_populates="workout")
    strengths = association_proxy("strength_exercises", "strength")
    cardio_exercises = db.relationship("CardioExercise", back_populates="workout")

    def __repr__(self):
        return f"Workout: {self.id}"
    
class Strength(db.Model, SerializerMixin):
    __tablename__ = "strengths"

    serialize_rules = (
        # "-created_at",
        # "-updated_at",
        "-strength_exercises.strength",
        "-strength_exercises.workout.strength_exercises",
        "-strength_exercises.workout.cardio_exercises",
        # "-strength_exercises.strength.created_at",
        # "-strength_exercises.strength.updated_at",
        # "-strength_exercises.strength.strength_exercises"
    )

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    name = db.Column(db.String, nullable=False)
    equipment = db.Column(db.String, nullable=False)
    favorite = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    strength_exercises = db.relationship("StrengthExercise", back_populates="strength")
    
    strength_equipment = [
        "Barbells",
        "Bowflex",
        "Cables",
        "Cybex",
        "Dumbbells",
        "Echelon Fitness",
        "Free Weights",
        "Hammer Strength",
        "Horizon Fitness",
        "Iron Company",
        "Kettlebells",
        "Life Fitness",
        "Mirror",
        "Nautilus",
        "NordicTrack",
        "Pilates Table",
        "Precor",
        "ProForm",
        "REP Fitness",
        "Resistance Bands",
        "Rogue Fitness"
        "Star Trac",
        "Sunny Health",
        "Suspended Bar",
        "Titan Fitness",
        "True Fitness",
        "TRX",
        "Yanre Fitness",
        "OTHER",
        "NONE"
    ] 

    def __repr__(self):
        return f"Strength: {self.id} - {self.name} ({self.equipment})"
    
class Cardio(db.Model, SerializerMixin):
    __tablename__ = "cardios"

    serialize_rules = (
        # "-created_at",
        # "-updated_at",
        "-cardio_exercises.cardio",
        # "-cardio_exercises.cardio.created_at",
        # "-cardio_exercises.cardio.updated_at",
        # "-cardio_exercises.cardio.cardio_exercises",
        "-cardio_exercises.workout.cardio_exercises"
        "-cardio_exercises.workout.strength_exercises"
    )

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    name = db.Column(db.String, nullable=False)
    equipment = db.Column(db.String, nullable=False)
    favorite = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    cardio_exercises = db.relationship("CardioExercise", back_populates="cardio")

    cardio_equipment = [
        "Bicycle",
        "Field",
        "Open Water",
        "Pilates",
        "Pool",
        "Road",
        "Sidewalk",
        "Spinning",
        "Studio",
        "Track - Indoor",
        "Track - Outdoor",
        "Trail",
        "Treadmill",
        "TRX",
        "OTHER",
        "NONE"
    ]

    def __repr__(self):
        return f"Cardio: {self.id} - {self.name} ({self.equipment})"

class StrengthExercise(db.Model, SerializerMixin):
    __tablename__ = "strength_exercises"
    
    serialize_rules = (
        "-strength.strength_exercises",
        "-strength.created_at",
        "-strength.updated_at",
        # "-workout.strength_exercises",
        "-workout.cardio_exercises",
        "-workout.user.created_at",
        "-workout.user.updated_at",
        "-workout.user.email",
        "-workout.user.first_name",
        "-workout.user.last_name",
        "-workout.user.admin",
        "-workout.user._password_hash",
    )

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    weight = db.Column(db.Float)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    strength_id = db.Column(db.Integer, db.ForeignKey("strengths.id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.id"))

    strength = db.relationship("Strength", back_populates="strength_exercises")
    workout = db.relationship("Workout", back_populates="strength_exercises")

    def __repr__(self):
        return f"Strength Exercise: {self.id}"

class CardioExercise(db.Model, SerializerMixin):
    __tablename__ = "cardio_exercises"

    serialize_rules = (
        "-cardio.cardio_exercises",
        "-cardio.created_at",
        "-cardio.updated_at",
        "-workout.strength_exercises",
        # "-workout.cardio_exercises",
        "-workout.user.created_at",
        "-workout.user.updated_at",
        "-workout.user.email",
        "-workout.user.first_name",
        "-workout.user.last_name",
        "-workout.user.admin",
        "-workout.user._password_hash",
    )

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    distance = db.Column(db.Float)
    units = db.Column(db.String)
    _time = db.Column("time", db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    cardio_id = db.Column(db.Integer, db.ForeignKey("cardios.id"))
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.id"))

    cardio = db.relationship("Cardio", back_populates="cardio_exercises")
    workout = db.relationship("Workout", back_populates="cardio_exercises")

    @property
    def time(self):
        # Returns the time in minutes:seconds format
        if self._time is None:
            return None
        minutes, seconds = divmod(self._time, 60)
        return f"{minutes}:{seconds:02}"
    
    @time.setter
    def time(self, time_str):
        # Sets time from a string in minutes:seconds format
        if time_str is None:
            return None
        else:
            minutes, seconds = map(int, time_str.split(":"))
            self._time = minutes * 60 + seconds
    
    cardio_units = ["miles", "kilometers", "laps", "yards", "meters", "feet"]

    def __repr__(self):
        return f"Strength Exercise: {self.id}"
    
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, nullable=False, primary_key=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    workouts = db.relationship("Workout", back_populates="user")

    def __repr__(self):
        return f"User: {self.username} ({self.id})"

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        print(password_hash)
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))
