import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { oneWorkoutState, strengthExercisesState, userState } from "../atoms";
import ExerciseLibrary from "./ExerciseLibrary";
import { Button, Grid, Segment } from "semantic-ui-react";
import { BackToWorkoutButton, NewExerciseButton, UseExistingButton, AddToWorkoutButton } from "../SemanticComponents/Buttons";

const AddStrengthExercise = () => {
    const navigate = useNavigate();
    // const { id } = useParams();
    const [strengthExercises, setStrengthExercises] = useRecoilState(strengthExercisesState);
    // const [selectedStrengthExercise, setSelectedStrengthExercise] = useState("");
    const [weight, setWeight] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [strengthName, setStrengthName] = useState("");
    const [strengthEquipment, setStrengthEquipment] = useState("");
    const [strengthFavorite, setStrengthFavorite] = useState(false);
    const [isNewForm, setIsNewForm] = useState(false);
    const user = useRecoilValue(userState);
    const userId = user?.id;
    const workout = useRecoilValue(oneWorkoutState)
    const workoutId = workout?.id
    // possible fix to strenghExercise and strength issue
    const [selectedStrengthExerciseId, setSelectedStrengthExerciseId] = useState("");
    const [selectedStrengthId, setSelectedStrengthId] = useState("");
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    // debugger

    useEffect(() => {
        if (userId) {
            fetch(`/unique_strength_exercises/${userId}`)
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => {
                    const nameComparison = a.strength.name.localeCompare(b.strength.name);
                    if (nameComparison !== 0) {
                        return nameComparison;
                    } else {
                        return a.strength.equipment.localeCompare(b.strength.equipment);
                    }
                });
                setStrengthExercises(data);
            })}
    }, [userId]);   
    
    useEffect(() => {
        fetch("/strength_equipment")
            .then((response) => response.json())
            .then((data) => setEquipmentOptions(data.equipment));
    }, []);

    const submitForm = (e) => {
        e.preventDefault()
        // Input validation
        if (!selectedStrengthId || !weight || !sets || !reps || selectedStrengthId === "") {
            alert("All fields must be filled out");
            return;
        }
        fetch("/strength_exercises", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                workout_id: workoutId,
                // possible fix to strengthExercise and strength issue
                strength_id: selectedStrengthId,
                // strength_id: selectedStrengthExercise,
                weight,
                sets,
                reps
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
        if (!strengthName || !strengthEquipment || !weight || !sets || !reps || strengthName.trim() === "") {
            alert("All fields must be filled out");
            return;
        }
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
                    workout_id: workoutId,
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
            navigate(`/workout/${workoutId}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    const toggleForm = () => {
        setIsNewForm(!isNewForm);
    };

    const loggedInContent = (
        <Segment>
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column>
            <BackToWorkoutButton workoutId={workoutId} />
              <h1>Add a Strength Exercise to your Workout</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              {/* Forms */}
              {
                isNewForm ?
                  <>
                    {/* New strength form */}
                    <h4>Create a new Exercise / Equipment combo</h4>
                    <div>
                    <label>Exercise Name:</label>
                    <input type="text" value={strengthName} onChange={(e) => setStrengthName(e.target.value)} />
                    </div>
                    <div>
                    <label>Equipment:</label>
                    <select value={strengthEquipment} onChange={(e) => setStrengthEquipment(e.target.value)}>
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
                    <input type="checkbox" checked={strengthFavorite} onChange={(e) => setStrengthFavorite(e.target.checked)} />
                    </div>
                    <div>
                    <h4>Enter your exercise details:</h4>
                    </div>
                    <div>
                    <label>Weight:</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div>
                    <label>Sets:</label>
                    <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
                    </div>
                    <div>
                    <label>Reps:</label>
                    <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
                    </div>
                    <div>
                    <AddToWorkoutButton onClick={submitNewForm} buttonText="Create and Add to Workout" />
                    </div>
                  </> :
                  <>
                    {/* Existing strength form */}
                    <label>Select a Strength Exercise:</label>
                    <select value={selectedStrengthExerciseId && selectedStrengthId ? JSON.stringify({strengthExerciseId: selectedStrengthExerciseId, strengthId: selectedStrengthId}) : ""} onChange={(e) => {
                        if (e.target.value) {
                            const {strengthExerciseId, strengthId} = JSON.parse(e.target.value);
                            setSelectedStrengthExerciseId(strengthExerciseId);
                            setSelectedStrengthId(strengthId);
                        } else {
                            setSelectedStrengthExerciseId("");
                            setSelectedStrengthId("");
                        }
                    }}>
                        <option value="">-- select an exercise --</option>
                        {strengthExercises.map(exercise => (
                            <option key={exercise.id} value={JSON.stringify({strengthExerciseId: exercise.id, strengthId: exercise.strength.id})}>
                                {exercise.strength.name} ({exercise.strength.equipment})
                            </option>                    
                        ))}
                    </select>
                    <div>
                    <h4>Enter your exercise details:</h4>
                    </div>
                    <div>
                    <label>Weight:</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div>
                    <label>Sets:</label>
                    <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
                    </div>
                    <div>
                    <label>Reps:</label>
                    <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
                    </div>
                    <div>
                    <AddToWorkoutButton onClick={submitForm} buttonText="Add to Workout" />
                    </div>
                  </>
              }
            </Grid.Column>
            <Grid.Column>
              {/* Toggle Button */}
              {isNewForm ?
                <div>
                  <h4>Want to use an existing Exercise / Equipment combo?</h4>
                  <UseExistingButton onClick={toggleForm} buttonText = "Use Existing Strength Exercise" />
                </div>
                :
                <div>
                  <h4>Don't see the Exercise / Equipment combo you're looking for?</h4>
                  <NewExerciseButton onClick={toggleForm} buttonText="Create New Strength Exercise" />
                </div>
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>
      )

    const loggedOutContent = (
        <div>
            <h2>You must be logged in to view this content</h2>
        </div>
    )

    return (
        <div>
            {user ? loggedInContent : loggedOutContent}
        </div>
    )
}
    
export default AddStrengthExercise;
    
// ! OLD VERSION
//     return (
//         <div>
//             <Button onClick={() => navigate(`/workout/${workoutId}`)}>Cancel</Button>
//             <h1>Add a Strength Exercise to your Workout</h1>
//             {
//                 isNewForm ?
//                 <>
//                     {/* Here's the new strength form */}
//                     <h4>Add a new Exercise / Equipment combo</h4>
//                     <div>
//                     <label>Exercise Name:</label>
//                     <input type="text" value={strengthName} onChange={(e) => setStrengthName(e.target.value)} />
//                     </div>
//                     <div>
//                     <label>Equipment:</label>
//                     <select value={strengthEquipment} onChange={(e) => setStrengthEquipment(e.target.value)}>
//                         <option value="">--select equipment--</option>
//                         {equipmentOptions.map((equipment) => (
//                             <option key={equipment} value={equipment}>
//                                 {equipment}
//                             </option>
//                         ))}
//                     </select>
//                     </div>
//                     <div>
//                     <label>Favorite:</label>
//                     <input type="checkbox" checked={strengthFavorite} onChange={(e) => setStrengthFavorite(e.target.checked)} />
//                     </div>
//                     <div>
//                     <h4>Enter your exercise details:</h4>
//                     </div>
//                     <div>
//                     <label>Weight:</label>
//                     <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
//                     </div>
//                     <div>
//                     <label>Sets:</label>
//                     <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
//                     </div>
//                     <div>
//                     <label>Reps:</label>
//                     <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
//                     </div>
//                     <div>
//                     <Button onClick={submitNewForm}>Create and Add to Workout</Button>
//                     </div>
//                     <div>
//                     <h5>Want to use an existing Exercise / Equipment combo?</h5>
//                     <Button onClick={toggleForm}>Use an Existing Strength Exercise</Button>
//                     </div>
//                 </> :
//                 <>
//                     {/* Here's the existing strength form */}
//                     <div>
//                     <label>Select a Strength Exercise:</label>
//                     <select value={selectedStrengthExerciseId && selectedStrengthId ? JSON.stringify({strengthExerciseId: selectedStrengthExerciseId, strengthId: selectedStrengthId}) : ""} onChange={(e) => {
//                         if (e.target.value) {
//                             const {strengthExerciseId, strengthId} = JSON.parse(e.target.value);
//                             setSelectedStrengthExerciseId(strengthExerciseId);
//                             setSelectedStrengthId(strengthId);
//                         } else {
//                             setSelectedStrengthExerciseId("");
//                             setSelectedStrengthId("");
//                         }
//                     }}>
//                         <option value="">-- select an exercise --</option>
//                         {strengthExercises.map(exercise => (
//                             <option key={exercise.id} value={JSON.stringify({strengthExerciseId: exercise.id, strengthId: exercise.strength.id})}>
//                                 {exercise.strength.name} ({exercise.strength.equipment})
//                             </option>                    
//                         ))}
//                     </select>
//                     <h5>Don't see the Exercise / Equipment combo you're looking for?</h5>
//                     <Button onClick={toggleForm}>Create New Strength Exercise</Button></div>
//                     <div>
//                     <h4>Enter your exercise details:</h4>
//                     </div>
//                     <div>
//                     <label>Weight:</label>
//                     <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
//                     </div>
//                     <div>
//                     <label>Sets:</label>
//                     <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} />
//                     </div>
//                     <div>
//                     <label>Reps:</label>
//                     <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
//                     </div>
//                     <div>
//                     <Button onClick={submitForm}>Add to Workout</Button>
//                     </div>
//                 </>
//             }
//         </div>
//     )
// }

// export default AddStrengthExercise;

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
// export default AddStrengthExercise;