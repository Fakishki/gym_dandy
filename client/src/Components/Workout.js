import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { oneWorkoutState, oneStrengthExerciseState, oneCardioExerciseState, workoutsState, workoutDataState, userState } from "../atoms"
import AddStrengthExercise from "./AddStrengthExercise"
import { Button, Header, Grid, Segment } from "semantic-ui-react"
import { BackHomeButton } from "../SemanticComponents/Buttons"
import OverdueExercises from "./OverdueExercises"
import { workoutModificationState } from "../atoms"
import AddCardioExercise from "./AddCardioExercise"

const Workout = () => {
    const { id } = useParams()
    const [editMode, setEditMode] = useState(false);
    const [editWeighIn, setEditWeighIn] = useState("");
    const [isAddStrengthExerciseModalOpen, setIsAddStrengthExerciseModalOpen] = useState(false);
    const [isAddCardioExerciseModalOpen, setIsAddCardioExerciseModalOpen] = useState(false);
    const [oneWorkout, setOneWorkout] = useRecoilState(oneWorkoutState)
    const [oneStrengthExercise, setOneStrengthExercise] = useRecoilState(oneStrengthExerciseState)
    const [oneCardioExercise, setOneCardioExercise] = useRecoilState(oneCardioExerciseState)
    const [workoutModification, setWorkoutModification] = useRecoilState(workoutModificationState);
    const [user] = useRecoilState(userState)
    const navigate = useNavigate()

    const markWorkoutModified = () => {
        setWorkoutModification(Date.now());
    };

    useEffect(() => {
        fetch(`/workouts/${id}`)
            .then(res => res.json())
            .then(workoutData => {
                setOneWorkout(workoutData)
                setEditWeighIn(workoutData.weigh_in); // Update edit weigh-in value when workout data changes
            })
    }, [id, workoutModification]);

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
        const weighInValue = editWeighIn === "" ? null : editWeighIn;
        fetch(`/workouts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                weigh_in: weighInValue
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
                markWorkoutModified();  // mark the workout as modified
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    };

    const deleteCardioExercise = (exerciseId) => {
        if(window.confirm("Are you sure you want to remove this cardio exercise from this workout?")){
            fetch(`/cardio_exercises/${exerciseId}`, {
                method: "DELETE",
            })
            .then((res) => res.json())
            .then(() => {
                setOneWorkout(prevWorkout => {
                    return {
                        ...prevWorkout,
                        cardio_exercises: prevWorkout.cardio_exercises.filter(exercise => exercise.id !== exerciseId)
                    }
                });
                markWorkoutModified(); // mark the workout as modified
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    }

    const deleteWorkout = () => {
        if(window.confirm("Are you sure you want to delete this workout? This will also delete all associated exercises.")){
            const deleteStrengthExercisesPromises = oneWorkout.strength_exercises?.map(strength_exercise => {
                return fetch(`/strength_exercises/${strength_exercise.id}`, {
                    method: "DELETE",
                })
            });
    
            const deleteCardioExercisesPromises = oneWorkout.cardio_exercises?.map(cardio_exercise => {
                return fetch(`/cardio_exercises/${cardio_exercise.id}`, {
                    method: "DELETE",
                })
            });
    
            const allDeletePromises = [...(deleteStrengthExercisesPromises || []), ...(deleteCardioExercisesPromises || [])];
    
            // Wait for all DELETE requests to resolve
            Promise.all(allDeletePromises)
                .then(() => {
                    // Now delete workout
                    return fetch(`/workouts/${id}`, {
                        method: "DELETE",
                    });
                })
                .then(response => response.json())
                .then(result => {
                    navigate("/"); // Navigate back home after deletion
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }

    const formatTime = (timeInSeconds => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
        const seconds = timeInSeconds - (hours * 3600) - (minutes * 60);
        let result = [minutes, seconds].map(value => value < 10 ? "0" + value : value).join(":");
        if (hours > 0) {
            result = hours + ":" + result;
        }
        return result;
    })

    const loggedOutContent = (
        <div>
            <h2>You must be logged in to view this content</h2>
        </div>
    )

    const loggedInContent = (
        <Segment>
            <Grid>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <BackHomeButton />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Segment>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={3}>
                                        <Header as="h2">Workout Details</Header>
                                    </Grid.Column>
                                    <Grid.Column width={5}>
                                        <Header as="h2">Date: {oneWorkout.created_at}</Header>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={2}>
                                        <Header as="h3">Weigh-in:</Header>
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        {!editMode && (
                                            <Header as="h3">
                                                {oneWorkout.weigh_in ? `${oneWorkout.weigh_in} lbs` : 'Not provided'} 
                                            </Header>
                                        )}
                                        {editMode && (
                                            <p>
                                                <input type="number" value={editWeighIn} onChange={(e) => setEditWeighIn(e.target.value)} />
                                                <Button onClick={saveEdit}>Save</Button>
                                                <Button onClick={cancelEdit}>Cancel</Button>
                                            </p>
                                        )}
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <Button onClick={editWorkout}>Edit Weigh-In</Button>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Button onClick={deleteWorkout} color="red">Delete This Entire Workout</Button>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={10}>
                                        <Segment style={{marginBottom: '2rem'}}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column width={10}>
                                                        <Header as="h2">Strength Exercises</Header>
                                                    </Grid.Column>
                                                    <Grid.Column width={6}>
                                                        <Button color="green" onClick={() => {setIsAddStrengthExerciseModalOpen(true)}}>Add Strength Exercise</Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                {oneWorkout.strength_exercises?.map(strength_exercise => (
                                                    <Grid.Row key={strength_exercise.id}>
                                                        <Grid.Column width={12}>
                                                            <Header as="h5">
                                                                {strength_exercise.strength 
                                                                    ? strength_exercise.strength.name 
                                                                    : "Unnamed Strength Exercise"} ({strength_exercise.strength 
                                                                    ? strength_exercise.strength.equipment 
                                                                    : "No Equipment"}) 
                                                                - Weight: {strength_exercise.weight}, Sets: {strength_exercise.sets}, Reps: {strength_exercise.reps}
                                                            </Header>
                                                        </Grid.Column>
                                                        <Grid.Column width={4}>
                                                            <Button onClick={() => deleteStrengthExercise(strength_exercise.id)} size="mini" color="red" icon="delete" labelPosition="left" content="Remove" />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                ))}
                                            </Grid>
                                        </Segment>
                                        <Segment style={{marginBottom: '2rem'}}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column width={10}>
                                                        <Header as="h2">Cardio Exercises</Header>
                                                    </Grid.Column>
                                                    <Grid.Column width={6}>
                                                        <Button color="green" onClick={() => {setIsAddCardioExerciseModalOpen(true)}}>Add Cardio Exercise</Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                {oneWorkout.cardio_exercises?.map(cardio_exercise => (
                                                    <Grid.Row key={cardio_exercise.id}>
                                                        <Grid.Column width={12}>
                                                            <Header as="h5">
                                                                {cardio_exercise.cardio 
                                                                    ? cardio_exercise.cardio.name 
                                                                    : "Unnamed Cardio Exercise"} ({cardio_exercise.cardio 
                                                                    ? cardio_exercise.cardio.equipment 
                                                                    : "No Equipment"}) 
                                                                - Distance: {cardio_exercise.distance}, Time: {formatTime(cardio_exercise._time)}
                                                            </Header>
                                                        </Grid.Column>
                                                        <Grid.Column width={4}>
                                                            <Button onClick={() => deleteCardioExercise(cardio_exercise.id)} size="mini" color="red" icon="delete" labelPosition="left" content="Remove" />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                ))}
                                            </Grid>
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        <OverdueExercises />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Segment>
                                            <Button style={{ marginBottom: "20px" }} fluid onClick={deleteWorkout} color="red">Delete This Entire Workout</Button>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
    

    return (
        <div>
            {user ? loggedInContent : loggedOutContent}
            <AddStrengthExercise
            open={isAddStrengthExerciseModalOpen}
            onClose={() => setIsAddStrengthExerciseModalOpen(false)}
            onExerciceAdded={markWorkoutModified}
            />
            <AddCardioExercise
            open={isAddCardioExerciseModalOpen}
            onClose={() => setIsAddCardioExerciseModalOpen(false)}
            onExerciceAdded={markWorkoutModified}
            />
        </div>
    )
}

export default Workout;

    //! KEEP THIS: OLD VERSION OF deleteWorkout DIDN'T HANDLE DELETING PROPERLY
    //! It was due to incorrect deletion order. StaleData error.  Needed to not delete workout until the associated strength/Cardio exercises are deleted first.
    // const deleteWorkout = () => {
    //     if(window.confirm("Are you sure you want to delete this workout? This will also delete all associated exercises.")){
    //         // Delete associated strength exercises
    //         oneWorkout.strength_exercises?.forEach(strength_exercise => {
    //             fetch(`/strength_exercises/${strength_exercise.id}`, {
    //                 method: "DELETE",
    //             }).catch((error) => {
    //                 console.error("Error:", error);
    //             });
    //         });
    //         // Delete associated cardio exercises
    //         oneWorkout.cardio_exercises?.forEach(cardio_exercise => {
    //             fetch(`/cardio_exercises/${cardio_exercise.id}`, {
    //                 method: "DELETE",
    //             }).catch((error) => {
    //                 console.error("Error:", error);
    //             });
    //         });
    //         // Delete workout
    //         fetch(`/workouts/${id}`, {
    //             method: "DELETE",
    //         })
    //         .then((res) => res.json())
    //         .then(() => {
    //             navigate("/"); // Navigate back home after deletion
    //         })
    //         .catch((error) => {
    //             console.error("Error:", error);
    //         });
    //     }
    // }
