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
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    // debugger

    useEffect(() => {
        if (userId) {
            fetch(`/unique_cardio_exercises/${userId}`)
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => {
                    const nameComparison = a.cardio.name.localeCompare(b.cardio.name);
                    if (nameComparison !== 0) {
                        return nameComparison;
                    } else {
                        return a.cardio.equipment.localeCompare(b.cardio.equipment);
                    }
                });
                setCardioExercises(data);
            })}
    }, [userId]);  

    useEffect(() => {
        fetch("/cardio_equipment")
            .then((response) => response.json())
            .then((data) => setEquipmentOptions(data.equipment));
    }, []);

    const submitForm = (e) => {
        e.preventDefault()
        // Input validation
        if (!selectedCardioId || !distance || !units || !time || selectedCardioId === "") {
            alert("All fields must be filled out");
            return;
        }
        // Validating Time format
        const isValidFormat = /^(\d{1,2}):([0-5]\d):([0-5]\d)$|^(\d{1,2}):([0-5]\d)$/.test(time);
        if (!isValidFormat) {
            alert("Invalid time format. Please use MM:SS or HH:MM:SS format.");
            return;
        }
        // Converting hours, minutes, and seconds to just seconds
        const timeParts = time.split(":").map(Number);
        let timeInSeconds;
        if (timeParts.length === 3) {
            const [hours, minutes, seconds] = timeParts;
            timeInSeconds = hours * 3600 + minutes * 60 + seconds;
        } else {
            const [minutes, seconds] = timeParts;
            timeInSeconds = minutes * 60 + seconds;
        }

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
                _time: timeInSeconds
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
        // Input validation
        if (!cardioName || !cardioEquipment || !distance || !units || !time || cardioName.trim() === "") {
            alert("All fields must be filled out");
            return;
        }
        // Validating Time format
        const isValidFormat = /^(\d{1,2}):([0-5]\d):([0-5]\d)$|^(\d{1,2}):([0-5]\d)$/.test(time);
        if (!isValidFormat) {
            alert("Invalid time format. Please use MM:SS or HH:MM:SS format.");
            return;
        }
        // Converting hours, minutes, and seconds to just seconds
        const timeParts = time.split(":").map(Number);
        let timeInSeconds;
        if (timeParts.length === 3) {
            const [hours, minutes, seconds] = timeParts;
            timeInSeconds = hours * 3600 + minutes * 60 + seconds;
        } else {
            const [minutes, seconds] = timeParts;
            timeInSeconds = minutes * 60 + seconds;
        }

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
                    _time: timeInSeconds
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

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const toggleForm = () => {
        setIsNewForm(!isNewForm);
    };




    return (
        <div>
            <button onClick={() => navigate(`/workout/${workoutId}`)}>Cancel</button>
            <h1>Add a Cardio Exercise to your Workout</h1>
            {
                isNewForm ?
                <>
                    {/* Here's the new cardio form */}
                    <h4>Add a new Exercise / Equipment combo</h4>
                    <div>
                    <label>Exercise Name:</label>
                    <input type="text" value={cardioName} onChange={(e) => setCardioName(e.target.value)} />
                    </div>
                    <div>
                    <label>Equipment:</label>
                    <select value={cardioEquipment} onChange={(e) => setCardioEquipment(e.target.value)}>
                        <option value="">--select equipment--</option>
                        {equipmentOptions.map((equipment) => (
                            <option key={equipment} value={equipment}>
                                {equipment}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div>
                    <label>Favorite:</label>
                    <input type="checkbox" checked={cardioFavorite} onChange={(e) => setCardioFavorite(e.target.checked)} />
                    </div>
                    <div>
                    <h4>Enter your exercise details:</h4>
                    </div>
                    <div>
                    <label>Distance:</label>
                    <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
                    </div>
                    <div>
                    <label>Units:</label>
                    <input type="text" value={units} onChange={(e) => setUnits(e.target.value)} />
                    </div>
                    <div>
                    <label>Time:</label>
                    <input type="text" value={time} onChange={(e) => setTime(e.target.value)} onBlur={handleTimeChange} placeholder="MM:SS" />
                    </div>
                    <div>
                    <button onClick={submitNewForm}>Create and Add to Workout</button>
                    </div>
                    <div>
                    <h5>Want to use an existing Exercise / Equipment combo?</h5>
                    <button onClick={toggleForm}>Use an Existing Cardio Exercise</button>
                    </div>
                </> :
                <>
                    {/* Here's the existing cardio form */}
                    <div>
                    <label>Select a Cardio Exercise:</label>
                    <select value={JSON.stringify({cardioExerciseId: selectedCardioExerciseId, cardioId: selectedCardioId})} onChange={(e) => {
                        const {cardioExerciseId, cardioId} = JSON.parse(e.target.value);
                        setSelectedCardioExerciseId(cardioExerciseId);
                        setSelectedCardioId(cardioId);
                    }}>
                        <option value="">-- select an exercise --</option>
                        {cardioExercises.map(exercise => (
                            <option key={exercise.id} value={JSON.stringify({cardioExerciseId: exercise.id, cardioId: exercise.cardio.id})}>
                                {exercise.cardio.name} ({exercise.cardio.equipment})
                            </option>                    
                        ))}
                    </select>
                    <h5>Don't see the Exercise / Equipment combo you're looking for?</h5>
                    <button onClick={toggleForm}>Create New Cardio Exercise</button></div>
                    <div>
                    <h4>Enter your exercise details:</h4>
                    </div>
                    <div>
                    <label>Distance:</label>
                    <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
                    </div>
                    <div>
                    <label>Units:</label>
                    <input type="text" value={units} onChange={(e) => setUnits(e.target.value)} />
                    </div>
                    <div>
                    <label>Time:</label>
                    <input type="text" value={time} onChange={(e) => setTime(e.target.value)} onBlur={handleTimeChange} placeholder="MM:SS" />
                    </div>
                    <div>
                    <button onClick={submitForm}>Add to Workout</button>
                    </div>
                </>
            }
        </div>
    )
}

export default AddCardioExercise;
    
// // OLD WAY
//     return (
//         <div>
//             <button onClick={() => navigate(`/workout/${workoutId}`)}>Cancel</button>
//             <h1>Add Cardio Exercise</h1>
//             <label>Select a cardio exercise:</label>
//             <select value={JSON.stringify({cardioExerciseId: selectedCardioExerciseId, cardioId: selectedCardioId})} onChange={(e) => {
//                 // Parsing the JSON value here, inside the onChange handler
//                 const {cardioExerciseId, cardioId} = JSON.parse(e.target.value);
//                 setSelectedCardioExerciseId(cardioExerciseId);
//                 setSelectedCardioId(cardioId);
//             }}>
//                 <option value="">-- select an exercise --</option>
//                 {cardioExercises.map(exercise => (
//                     <option key={exercise.id} value={JSON.stringify({cardioExerciseId: exercise.id, cardioId: exercise.cardio.id})}>
//                         {exercise.cardio.name} ({exercise.cardio.equipment})
//                     </option>                    
//                 ))}
//             </select>
//             <label>Distance:</label>
//             <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
//             <label>Units:</label>
//             <input type="text" value={units} onChange={(e) => setUnits(e.target.value)} />
//             <label>Time:</label>
//             <input type="text" value={time} onChange={(e) => setTime(e.target.value)} onBlur={handleTimeChange} placeholder="MM:SS" />
//             <button onClick={submitForm}>Add</button>
//             <h2>Need to add a new Cardio?</h2>
//             <label>Cardio Name:</label>
//             <input type="text" value={cardioName} onChange={(e) => setCardioName(e.target.value)} />
//             <label>Equipment:</label>
//             <input type="text" value={cardioEquipment} onChange={(e) => setCardioEquipment(e.target.value)} />
//             <label>Favorite:</label>
//             <input type="checkbox" checked={cardioFavorite} onChange={(e) => setCardioFavorite(e.target.checked)} />
//             <label>Distance:</label>
//             <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
//             <label>Units:</label>
//             <input type="text" value={units} onChange={(e) => setUnits(e.target.value)} />
//             <label>Time:</label>
//             <input type="text" value={time} onChange={(e) => setTime(e.target.value)} onBlur={handleTimeChange} placeholder="MM:SS" />
//             <button onClick={submitNewForm}>Create and Add</button>

//         </div>
//     )