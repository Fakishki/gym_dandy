import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { oneWorkoutState, workoutsState, workoutDataState } from "../atoms"
import AddStrengthExercise from "./AddStrengthExercise"

const Workout = () => {
    const { id } = useParams()
    // Trying to fix strenghtexercise not loading
    // const oneWorkout = useRecoilValue(workoutDataState(id));
    // MIGHT NEED THIS BACK
    const [oneWorkout, setOneWorkout] = useRecoilState(oneWorkoutState)
    const navigate = useNavigate()

    // MIGHT NEED THIS BACK
    useEffect(() => {
        fetch(`/workouts/${id}`)
            .then(res => res.json())
            .then(workoutData => {
                setOneWorkout(workoutData)
            })
    }, [id]);

    const backHome = () => {
        navigate("/")
    }

    console.log(oneWorkout);

    return (
        <div>
            <button onClick={backHome}>Go Back</button>
            <h1>Workout Details</h1>
            <p>Weigh-in: {oneWorkout.weigh_in}</p>
            <p>Date: {oneWorkout.created_at}</p>
            <h2>Strength Exercises</h2>
            <button onClick={() => navigate(`/add_strength_exercise/${id}`)}>Add Strength Exercise</button>
            <ul>
                {oneWorkout.strength_exercises?.map(strength_exercise => (
                    <li key={strength_exercise.id}>
                        {strength_exercise.strength ? strength_exercise.strength.name : "Unnamed Strength Exercise"} - {strength_exercise.strength ? strength_exercise.strength.equipment : "No Equipment"} - Weight: {strength_exercise.weight}, Sets: {strength_exercise.sets}, Reps: {strength_exercise.reps}
                    </li>
                ))}
            </ul>
            <h2>Cardio Exercises</h2>
            <ul>
                {oneWorkout.cardio_exercises?.map(cardio_exercise => (
                    <li key={cardio_exercise.id}>
                        {cardio_exercise.cardio ? cardio_exercise.cardio.name : "Unnamed Cardio Exercise"} - {cardio_exercise.cardio ? cardio_exercise.cardio.equipment : "No Equipment"} - Distance: {cardio_exercise.distance}, Time: {cardio_exercise.time}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Workout;