import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import { oneWorkoutState, workoutsState } from "../atoms"

const Workout = () => {
    const { id } = useParams()
    const [oneWorkout, setOneWorkout] = useRecoilState(oneWorkoutState)

    useEffect(() => {
        fetch(`/workouts/${id}`)
            .then(res => res.json())
            .then(workoutData => {
                setOneWorkout(workoutData)
            })
    }, [id]);

    return (
        <div>
            <h1>Workout Details</h1>
            <p>Weigh-in: {oneWorkout.weigh_in}</p>
            <p>Date: {oneWorkout.created_at}</p>
            <h2>Strength Exercises</h2>
            <ul>
                {oneWorkout.strength_exercises?.map(strength_exercise => (
                    <li key={strength_exercise.id}>
                        {strength_exercise.strength.name} -- Weight: {strength_exercise.weight}, Sets: {strength_exercise.sets}, Reps: {strength_exercise.reps}
                    </li>
                ))}
            </ul>
            <h2>Cardio Exercises</h2>
            <ul>
                {oneWorkout.cardio_exercises?.map(cardio_exercise => (
                    <li key={cardio_exercise.id}>
                        {cardio_exercise.cardio.name} -- Distance: {cardio_exercise.distance}, Time: {cardio_exercise.time}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Workout;