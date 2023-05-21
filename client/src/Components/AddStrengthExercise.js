import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { strengthExercisesState } from "../atoms";
import ExerciseLibrary from "./ExerciseLibrary";

const AddStrengthExercise = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const strengthExercises = useRecoilValue(strengthExercisesState);
    const [selectedStrengthExercise, setSelectedStrengthExercise] = useState(null);
    const [weight, setWeight] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");

    const submitForm = () => {
        fetch("/strength_exercises", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // "workout_id": "<workout_id>",
                // "strength_id": "<strength_id>",
                // "weight": "<weight>",
                // "sets": "<sets>",
                // "reps": "<reps>"
                
                workout_id: id,
                strength_id: selectedStrengthExercise,
                weight,
                sets,
                reps
            })
        })
        .then(response => response.json())
        .then(data => {
            navigate(`/workouts/${id}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };
    return (
        <div>
            <h1>Add Strength Exercise</h1>
            <label>Select a strength exercise:</label>
            <select value={selectedStrengthExercise} onChange={(e) => setSelectedStrengthExercise(e.target.value)}>
                {strengthExercises.map(exercise => (
                    <option key={exercise.id} value={exercise.id}>{exercise.strength.name}</option>                    
                ))}
            </select>
            <label>Weight:</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <label>Sets:</label>
            <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
            <label>Reps:</label>
            <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
            <button onClick={submitForm}>Add</button>
        </div>
    )
}

export default AddStrengthExercise;