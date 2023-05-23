import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { oneWorkoutState, cardioExercisesState, userState } from "../atoms";
import ExerciseLibrary from "./ExerciseLibrary";

const AddCardioExercise = () => {
    const navigate = useNavigate();
    // const { id } = useParams();
    const [cardioExercises, setCardioExercises] = useRecoilState(cardioExercisesState);
    // const [selectedCardioExercise, setSelectedCardioExercise] = useState("");
    const [distance, setDistance] = useState("");
    const [units, setUnits] = useState("");
    const [time, setTime] = useState("");
    const [cardioName, setCardioName] = useState("");
    const [cardioEquipment, setCardioEquipment] = useState("");
    const [cardioFavorite, setCardioFavorite] = useState(false);
    const [isNewForm, setIsNewForm] = useState(false);
    const user = useRecoilValue(userState);
    const userId = user?.id;
    const workout = useRecoilValue(oneWorkoutState)
    const workoutId = workout?.id
    // possible fix to strenghExercise and cardio issue
    const [selectedCardioExerciseId, setSelectedCardioExerciseId] = useState("");
    const [selectedCardioId, setSelectedCardioId] = useState("");
    // debugger

    useEffect(() => {
        // fetch(`/unique_cardio_exercises?user_id=${userId}`)
        if (userId) {
        fetch(`/unique_cardio_exercises/${userId}`)
        .then(res => res.json())
        .then(data => {
            data.sort((a, b) => a.cardio.name.localeCompare(b.cardio.name));
            setCardioExercises(data);
        })}
    }, [userId]);

    const submitForm = (e) => {
        e.preventDefault()
        fetch("/cardio_exercises", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                workout_id: workoutId,
                // possible fix to cardioExercise and cardio issue
                cardio_id: selectedCardioId,
                // cardio_id: selectedCardioExercise,
                distance,
                units,
                _time: time
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            navigate(`/workout/${workoutId}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    const submitNewForm = (e) => {
        e.preventDefault()
        fetch("/cardios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: cardioName,
                equipment: cardioEquipment,
                favorite: cardioFavorite
            })
        })
        .then(response => response.json())
        .then(newCardio => {
            return fetch("/cardio_exercises", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    workout_id: workoutId,
                    cardio_id: newCardio.id,
                    distance,
                    units,
                    _time: time
                })
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            navigate(`/workout/${workoutId}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    const toggleForm = () => {
        setIsNewForm(!isNewForm);
    };



    // // OLD FORM
    return (
        <div>
            <h1>Add Cardio Exercise</h1>
            <label>Select a cardio exercise:</label>
            {/* OLD WAY: */}
            {/* <select value={selectedCardioExercise} onChange={(e) => setSelectedCardioExercise(e.target.value)}> */}
            {/* NEW WAY: */}
            <select value={JSON.stringify({cardioExerciseId: selectedCardioExerciseId, cardioId: selectedCardioId})} onChange={(e) => {
            // <select value={selectedCardioExercise} onChange={(e) => {
                // Parsing the JSON value here, inside the onChange handler
                const {cardioExerciseId, cardioId} = JSON.parse(e.target.value);
                setSelectedCardioExerciseId(cardioExerciseId);
                setSelectedCardioId(cardioId);
            }}>
                <option value="">-- select an exercise --</option>
                {cardioExercises.map(exercise => (
                    // OLD WAY:
                    // <option key={exercise.id} value={exercise.id}>
                    // NEW WAY:
                    <option key={exercise.id} value={JSON.stringify({cardioExerciseId: exercise.id, cardioId: exercise.cardio.id})}>
                        {exercise.cardio.name} ({exercise.cardio.equipment})
                    </option>                    
                ))}
            </select>
            <label>Distance:</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
            <label>Units:</label>
            <input type="text" value={units} onChange={(e) => setUnits(e.target.value)} />
            <label>Time:</label>
            <input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="minutes:seconds"/>
            <button onClick={submitForm}>Add</button>
            <h2>Need to add a new Cardio?</h2>
            <label>Cardio Name:</label>
            <input type="text" value={cardioName} onChange={(e) => setCardioName(e.target.value)} />
            <label>Equipment:</label>
            <input type="text" value={cardioEquipment} onChange={(e) => setCardioEquipment(e.target.value)} />
            <label>Favorite:</label>
            <input type="checkbox" checked={cardioFavorite} onChange={(e) => setCardioFavorite(e.target.checked)} />
            <label>Distance:</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
            <label>Units:</label>
            <input type="text" value={units} onChange={(e) => setUnits(e.target.value)} />
            <label>Time:</label>
            <input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="minutes:seconds" />
            <button onClick={submitNewForm}>Create and Add</button>

        </div>
    )
}

export default AddCardioExercise;