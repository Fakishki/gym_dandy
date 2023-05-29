import React, { useEffect } from "react"
import { useRecoilState } from "recoil"
import { useNavigate } from "react-router-dom"
import { userState, strengthExercisesState, cardioExercisesState } from "../atoms"
import { BackHomeButton } from "../SemanticComponents/Buttons"
import { Button, Segment, Grid } from "semantic-ui-react"

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
                let seen = new Set();
                let filtered = data.filter(el => {
                    let duplicate = seen.has(el.strength.name + el.strength.equipment);
                    seen.add(el.strength.name + el.strength.equipment);
                    return !duplicate;
                });
    
                filtered.sort((a, b) => a.strength.name.localeCompare(b.strength.name));
                setStrengthExercises(filtered);
            })
    }
    
    const fetchCardioExercises = () => {
        if (!user) return;
    
        fetch(`/cardio_exercises?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                let seen = new Set();
                let filtered = data.filter(el => {
                    let duplicate = seen.has(el.cardio.name + el.cardio.equipment);
                    seen.add(el.cardio.name + el.cardio.equipment);
                    return !duplicate;
                });
    
                filtered.sort((a, b) => a.cardio.name.localeCompare(b.cardio.name));
                setCardioExercises(filtered);
            })
    }

    const backHome = () => {
        navigate("/")
    }

    const loggedInContent = (
        <Segment>
            <BackHomeButton />
            <h1>Your Exercise Library</h1>
            <h3>Below are all of the exercises you've tracked in gym_dandy</h3>
            <h3>For more details, visit the Analytics section</h3>
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
        </Segment>
    );

    const loggedOutContent = (
        <h2>Please log in to access your Exercise Library!</h2>
    );

    return (
        <div>
            {user ? loggedInContent : loggedOutContent}
        </div>
    )
}

export default ExerciseLibrary;
