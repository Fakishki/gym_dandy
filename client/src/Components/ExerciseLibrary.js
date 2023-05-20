import React, { useEffect } from "react"
import { useRecoilState } from "recoil"
import { useNavigate } from "react-router-dom"
import { userState, strengthExercisesState, cardioExercisesState } from "../atoms"

const ExerciseLibrary = () => {
    const [user] = useRecoilState(userState);
    const [strengthExercises, setStrengthExercises] = useRecoilState(strengthExercisesState);
    const [cardioExercises, setCardioExercises] = useRecoilState(cardioExercisesState);
    const navigate = useNavigate()

    useEffect(() => {
        fetchStrengthExercises();
        fetchCardioExercises();
    }, [user])

    const fetchStrengthExercises = () => {
        if (!user) return;

        fetch(`/strength_exercises?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => a.strength.name.localeCompare(b.strength.name));
                setStrengthExercises(data);
            })
    }

    const fetchCardioExercises = () => {
        if (!user) return;

        fetch(`/cardio_exercises?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => a.cardio.name.localeCompare(b.cardio.name));
                setCardioExercises(data);
            })
    }

    const backHome = () => {
        navigate("/")
    }

    return (
        <div>
            <button onClick={backHome}>Go Back</button>
            <h1>Your Exercise Library</h1>
            <h2>Your Strength Exercises:</h2>
            <ul>
                {strengthExercises.map(exercise => (
                    <li key={exercise.id}>
                        {exercise.strength.name} ({exercise.strength.equipment})
                    </li>
                ))}
            </ul>
            <h2>Your Cardio Exercises:</h2>
            <ul>
                {cardioExercises.map(exercise => (
                    <li key={exercise.id}>
                        {exercise.cardio.name} ({exercise.cardio.equipment})
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ExerciseLibrary;
