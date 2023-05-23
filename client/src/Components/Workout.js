import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { oneWorkoutState, oneStrengthExerciseState, oneCardioExerciseState, workoutsState, workoutDataState } from "../atoms"
import AddStrengthExercise from "./AddStrengthExercise"

const Workout = () => {
    const { id } = useParams()
    const [editMode, setEditMode] = useState(false);
    const [editWeighIn, setEditWeighIn] = useState("");
    const [oneWorkout, setOneWorkout] = useRecoilState(oneWorkoutState)
    const [oneStrengthExercise, setOneStrengthExercise] = useRecoilState(oneStrengthExerciseState)
    const [oneCardioExercise, setOneCardioExercise] = useRecoilState(oneCardioExerciseState)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/workouts/${id}`)
            .then(res => res.json())
            .then(workoutData => {
                setOneWorkout(workoutData)
                setEditWeighIn(workoutData.weigh_in); // Update edit weigh-in value when workout data changes
            })
    }, [id]);

    const backHome = () => {
        navigate("/")
    }

    const editWorkout = () => {
        setEditMode(true);
    }

    const cancelEdit = () => {
        setEditMode(false);
        setEditWeighIn(oneWorkout.weigh_in); // Reset edit weigh-in value on cancel
    }

    const saveEdit = () => {
        fetch(`/workouts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                weigh_in: editWeighIn
            }),
        })
            .then((res) => res.json())
            .then((updatedWorkout) => {
                setEditMode(false);
                setOneWorkout(updatedWorkout);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    const deleteStrengthExercise = (exerciseId) => {
        if(window.confirm("Are you sure you want to remove this strength exercise from this workout?")){
            fetch(`/strength_exercises/${exerciseId}`, {
                method: "DELETE",
            })
            .then((res) => res.json())
            .then(() => {
                setOneWorkout(prevWorkout => {
                    return {
                        ...prevWorkout,
                        strength_exercises: prevWorkout.strength_exercises.filter(exercise => exercise.id !== exerciseId)
                    }
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    }

    const deleteWorkout = () => {
        if(window.confirm("Are you sure you want to delete this workout? This will also delete all associated exercises.")){
            // Delete associated strength exercises
            oneWorkout.strength_exercises?.forEach(strength_exercise => {
                fetch(`/strength_exercises/${strength_exercise.id}`, {
                    method: "DELETE",
                }).catch((error) => {
                    console.error("Error:", error);
                });
            });
            // Delete associated cardio exercises
            oneWorkout.cardio_exercises?.forEach(cardio_exercise => {
                fetch(`/cardio_exercises/${cardio_exercise.id}`, {
                    method: "DELETE",
                }).catch((error) => {
                    console.error("Error:", error);
                });
            });
            // Delete workout
            fetch(`/workouts/${id}`, {
                method: "DELETE",
            })
            .then((res) => res.json())
            .then(() => {
                navigate("/"); // Navigate back home after deletion
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    }
    

    return (
        <div>
            <button onClick={backHome}>Go Back</button>
            <h1>Workout Details</h1>
            {!editMode && <p>Weigh-in: {oneWorkout.weigh_in} <button onClick={editWorkout}>Edit Weigh-In</button></p>}
            {editMode && (
                <p>
                    Weigh-in: <input type="number" value={editWeighIn} onChange={(e) => setEditWeighIn(e.target.value)} />
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                </p>
            )}
            <p>Date: {oneWorkout.created_at}</p>
            <h2>Strength Exercises</h2>
            <button onClick={() => navigate(`/add_strength_exercise`)}>Add Strength Exercise</button>
            <ul>
                {oneWorkout.strength_exercises?.map(strength_exercise => (
                    <li key={strength_exercise.id}>
                        {strength_exercise.strength ? strength_exercise.strength.name : "Unnamed Strength Exercise"} - {strength_exercise.strength ? strength_exercise.strength.equipment : "No Equipment"} - Weight: {strength_exercise.weight}, Sets: {strength_exercise.sets}, Reps: {strength_exercise.reps}<button onClick={() => deleteStrengthExercise(strength_exercise.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <h2>Cardio Exercises</h2>
            <button onClick={() => navigate(`/add_cardio_exercise`)}>Add Cardio Exercise</button>
            <ul>
                {oneWorkout.cardio_exercises?.map(cardio_exercise => (
                    <li key={cardio_exercise.id}>
                        {cardio_exercise.cardio ? cardio_exercise.cardio.name : "Unnamed Cardio Exercise"} - {cardio_exercise.cardio ? cardio_exercise.cardio.equipment : "No Equipment"} - Distance: {cardio_exercise.distance}, Time: {cardio_exercise.time}
                    </li>
                ))}
            </ul>
            <button onClick={deleteWorkout}>Delete This Workout</button>
        </div>
    )
}

export default Workout;




// import React, { useEffect } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import { useRecoilState, useRecoilValue } from "recoil"
// import { oneWorkoutState, workoutsState, workoutDataState } from "../atoms"
// import AddStrengthExercise from "./AddStrengthExercise"

// const Workout = () => {
//     const { id } = useParams()
//     // Trying to fix strenghtexercise not loading
//     // const oneWorkout = useRecoilValue(workoutDataState(id));
//     // MIGHT NEED THIS BACK
//     const [oneWorkout, setOneWorkout] = useRecoilState(oneWorkoutState)
//     const navigate = useNavigate()

//     // MIGHT NEED THIS BACK
//     useEffect(() => {
//         fetch(`/workouts/${id}`)
//             .then(res => res.json())
//             .then(workoutData => {
//                 setOneWorkout(workoutData)
//             })
//     }, [id]);

//     const backHome = () => {
//         navigate("/")
//     }

//     console.log(oneWorkout);

//     return (
//         <div>
//             <button onClick={backHome}>Go Back</button>
//             <h1>Workout Details</h1>
//             <p>Weigh-in: {oneWorkout.weigh_in}</p>
//             <p>Date: {oneWorkout.created_at}</p>
//             <h2>Strength Exercises</h2>
//             <button onClick={() => navigate(`/add_strength_exercise`)}>Add Strength Exercise</button>
//             <ul>
//                 {oneWorkout.strength_exercises?.map(strength_exercise => (
//                     <li key={strength_exercise.id}>
//                         {strength_exercise.strength ? strength_exercise.strength.name : "Unnamed Strength Exercise"} - {strength_exercise.strength ? strength_exercise.strength.equipment : "No Equipment"} - Weight: {strength_exercise.weight}, Sets: {strength_exercise.sets}, Reps: {strength_exercise.reps}
//                     </li>
//                 ))}
//             </ul>
//             <h2>Cardio Exercises</h2>
//             <ul>
//                 {oneWorkout.cardio_exercises?.map(cardio_exercise => (
//                     <li key={cardio_exercise.id}>
//                         {cardio_exercise.cardio ? cardio_exercise.cardio.name : "Unnamed Cardio Exercise"} - {cardio_exercise.cardio ? cardio_exercise.cardio.equipment : "No Equipment"} - Distance: {cardio_exercise.distance}, Time: {cardio_exercise.time}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     )
// }

// export default Workout;