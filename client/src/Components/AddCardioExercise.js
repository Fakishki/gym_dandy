import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { oneWorkoutState, cardioExercisesState, userState } from "../atoms";
import ExerciseLibrary from "./ExerciseLibrary";
import { Button, Grid, Segment, Form } from "semantic-ui-react";
import { BackToWorkoutButton, NewExerciseButton, UseExistingButton, AddToWorkoutButton } from "../SemanticComponents/Buttons";

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
        const isZeroTime = /^0{1,2}:00(:00)?$/g.test(time);
        if (isZeroTime) {
            alert("Time cannot be zero")
            return;
        }
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
        const isZeroTime = /^0{1,2}:00(:00)?$/g.test(time);
        if (isZeroTime) {
            alert("Time cannot be zero")
            return;
        }
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
                      {/* Here's the new cardio form */}
                      <h4>Add a new Exercise / Equipment combo</h4>
                      <Form>
                        <Form.Field>
                          <label>Exercise Name:</label>
                          <input type="text" value={cardioName} onChange={(e) => setCardioName(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                          <label>Equipment:</label>
                          <select value={cardioEquipment} onChange={(e) => setCardioEquipment(e.target.value)}>
                              <option value="">--select equipment--</option>
                              {equipmentOptions.map((equipment) => (
                                  <option key={equipment} value={equipment}>
                                      {equipment}
                                  </option>
                              ))}
                          </select>
                        </Form.Field>
                        <Form.Field>
                          <label>Favorite:</label>
                          <input type="checkbox" checked={cardioFavorite} onChange={(e) => setCardioFavorite(e.target.checked)} />
                        </Form.Field>
                        <Form.Field>
                          <label>Distance:</label>
                          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                          <label>Units:</label>
                          <input type="text" value={units} onChange={(e) => setUnits(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                          <label>Time:</label>
                          <input type="text" value={time} onChange={(e) => setTime(e.target.value)} onBlur={handleTimeChange} placeholder="MM:SS" />
                        </Form.Field>
                        <Form.Field>
                          <AddToWorkoutButton onClick={submitNewForm} buttonText="Create and Add to Workout" />
                        </Form.Field>
                      </Form>
                  </> 
                :
                <>
                    {/* Here's the existing cardio form */}
                    <Form>
                        <Form.Field>
                            <label>Select a Cardio Exercise:</label>
                            <select value={selectedCardioExerciseId && selectedCardioId ? JSON.stringify({cardioExerciseId: selectedCardioExerciseId, cardioId: selectedCardioId}) : ""} onChange={(e) => {
                                if (e.target.value) {
                                    const {cardioExerciseId, cardioId} = JSON.parse(e.target.value);
                                    setSelectedCardioExerciseId(cardioExerciseId);
                                    setSelectedCardioId(cardioId);
                                } else {
                                    setSelectedCardioExerciseId("");
                                    setSelectedCardioId("");
                                }
                            }}>
                                <option value="">-- select an exercise --</option>
                                {cardioExercises.map(exercise => (
                                    <option key={exercise.id} value={JSON.stringify({cardioExerciseId: exercise.id, cardioId: exercise.cardio.id})}>
                                        {exercise.cardio.name} ({exercise.cardio.equipment})
                                    </option>                    
                                ))}
                            </select>
                        </Form.Field>
                        <Form.Field>
                            <h4>Enter your exercise details:</h4>
                        </Form.Field>
                        <Form.Field>
                            <label>Distance:</label>
                            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Units:</label>
                            <input type="text" value={units} onChange={(e) => setUnits(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Time:</label>
                            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} onBlur={handleTimeChange} placeholder="MM:SS" />
                        </Form.Field>
                        <Form.Field>
                            <AddToWorkoutButton onClick={submitForm} buttonText="Add to Workout" />
                        </Form.Field>
                        </Form>
                </>
            }
            </Grid.Column>
                <Grid.Column>
                {/* Toggle Button */}
                {isNewForm ?
                    <div>
                    <h4>Want to use an existing Exercise / Equipment combo?</h4>
                    <UseExistingButton onClick={toggleForm} buttonText = "Use Existing Cardio Exercise" />
                    </div>
                    :
                    <div>
                    <h4>Don't see the Exercise / Equipment combo you're looking for?</h4>
                    <NewExerciseButton onClick={toggleForm} buttonText="Create New Cardio Exercise" />
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

export default AddCardioExercise;
    
// // OLD WAY
//     return (
//         <div>
//             <Button onClick={() => navigate(`/workout/${workoutId}`)}>Cancel</Button>
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
//             <Button onClick={submitForm}>Add</Button>
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
//             <Button onClick={submitNewForm}>Create and Add</Button>

//         </div>
//     )