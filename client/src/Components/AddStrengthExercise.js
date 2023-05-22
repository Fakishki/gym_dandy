import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { strengthExercisesState, userState } from "../atoms";
import ExerciseLibrary from "./ExerciseLibrary";

const AddStrengthExercise = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [strengthExercises, setStrengthExercises] = useRecoilState(strengthExercisesState);
    const [selectedStrengthExercise, setSelectedStrengthExercise] = useState("");
    const [weight, setWeight] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [strengthName, setStrengthName] = useState("");
    const [strengthEquipment, setStrengthEquipment] = useState("");
    const [strengthFavorite, setStrengthFavorite] = useState(false);
    const [isNewForm, setIsNewForm] = useState(false);
    const userId = useRecoilValue(userState).id;

    useEffect(() => {
        fetch(`/unique_strength_exercises?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
            data.sort((a, b) => a.strength.name.localeCompare(b.strength.name));
            setStrengthExercises(data);
        })
    }, [userId]);

    const submitForm = () => {
        fetch("/strength_exercises", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                workout_id: id,
                strength_id: selectedStrengthExercise,
                weight,
                sets,
                reps
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            navigate(`/workouts/${id}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    const submitNewForm = () => {
        fetch("/strengths", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: strengthName,
                equipment: strengthEquipment,
                favorite: strengthFavorite
            })
        })
        .then(response => response.json())
        .then(newStrength => {
            return fetch("/strength_exercises", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    workout_id: id,
                    strength_id: newStrength.id,
                    weight,
                    sets,
                    reps
                })
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            navigate(`/workouts/${id}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    const toggleForm = () => {
        setIsNewForm(!isNewForm);
    };

//     return (
//         <div>
//             <h1>Add Strength Exercise</h1>
//             <button onClick={toggleForm}>
//                 {isNewForm ? "Use an existing Strength" : "Create a new Strength"}
//             </button>
//             {isNewForm ? (
//                 <>
//                     <h2>Add a new Strength</h2>
//                     <label>Strength Name:</label>
//                     <input type="text" value={strengthName} onChange={(e) => setStrengthName(e.target.value)} />
//                     <label>Equipment:</label>
//                     <input type="text" value={strengthEquipment} onChange={(e) => setStrengthEquipment(e.target.value)} />
//                     <label>Favorite:</label>
//                     <input type="checkbox" checked={strengthFavorite} onChange={(e) => setStrengthFavorite(e.target.checked)} />
//                     <label>Weight:</label>
//                     <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
//                     <label>Sets:</label>
//                     <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
//                     <label>Reps:</label>
//                     <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
//                     <button onClick={submitNewForm}>Create and Add</button>
//                 </>
//             ) : (
//                 <>
//                     <label>Select a strength exercise:</label>
//                     <select value={selectedStrengthExercise} onChange={(e) => setSelectedStrengthExercise(e.target.value)}>
//                         <option value="">-- select an exercise --</option>
//                         {strengthExercises.map(exercise => (
//                             <option key={exercise.id} value={exercise.id}>
//                                 {exercise.strength.name} ({exercise.strength.equipment})
//                             </option>                    
//                         ))}
//                     </select>
//                     <label>Weight:</label>
//                     <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
//                     <label>Sets:</label>
//                     <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
//                     <label>Reps:</label>
//                     <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
//                     <button onClick={submitForm}>Add</button>
//                 </>
//             )}
//         </div>
//     )
// }

    // // OLD FORM
    return (
        <div>
            <h1>Add Strength Exercise</h1>
            <label>Select a strength exercise:</label>
            <select value={selectedStrengthExercise} onChange={(e) => setSelectedStrengthExercise(e.target.value)}>
                <option value="">-- select an exercise --</option>
                {strengthExercises.map(exercise => (
                    <option key={exercise.id} value={exercise.id}>
                        {exercise.strength.name} ({exercise.strength.equipment})
                        </option>                    
                ))}
            </select>
            <label>Weight:</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <label>Sets:</label>
            <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
            <label>Reps:</label>
            <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
            <button onClick={submitForm}>Add</button>
            <h2>Need to add a new Strength?</h2>
            <label>Strength Name:</label>
            <input type="text" value={strengthName} onChange={(e) => setStrengthName(e.target.value)} />
            <label>Equipment:</label>
            <input type="text" value={strengthEquipment} onChange={(e) => setStrengthEquipment(e.target.value)} />
            <label>Favorite:</label>
            <input type="checkbox" checked={strengthFavorite} onChange={(e) => setStrengthFavorite(e.target.checked)} />
            <label>Weight:</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <label>Sets:</label>
            <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
            <label>Reps:</label>
            <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
            <button onClick={submitNewForm}>Create and Add</button>

        </div>
    )
}

export default AddStrengthExercise;