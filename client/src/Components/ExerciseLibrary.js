import React, { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { useNavigate, Link } from "react-router-dom"
import { userState, strengthExercisesState, cardioExercisesState } from "../atoms"
import { BackHomeButton } from "../SemanticComponents/Buttons"
import { Button, Segment, Grid } from "semantic-ui-react"
import Exercise from "./Exercise"

const ExerciseLibrary = () => {
    const [user] = useRecoilState(userState);
    const [strengthExercises, setStrengthExercises] = useRecoilState(strengthExercisesState);
    const [cardioExercises, setCardioExercises] = useRecoilState(cardioExercisesState);
    const [selectedExerciseType, setSelectedExerciseType] = useState(null);
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

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

    const handleFavoriteClick = async (exerciseType, exercise) => {
        const updatedFavoriteStatus = !exercise[exerciseType].favorite;
        await fetch(`/${exerciseType}s/${exercise[exerciseType].id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ favorite: updatedFavoriteStatus })
        });
        if (exerciseType === 'strength') {
            fetchStrengthExercises();
        } else {
            fetchCardioExercises();
        }
    }

    const loggedInContent = (
        <Segment>
            <BackHomeButton />
            <Segment>
            <h1>Your Exercise Library</h1>
            <h3>Below are all of the exercises you've tracked in gym_dandy</h3>
            <h3>For more details, visit the Analytics section</h3>
            </Segment>
            <Segment>
            <h2>Your Strength Exercises:</h2>
            <ul>
                {strengthExercises.map(exercise => (
                    <Grid 
                        key={exercise.id}
                        verticalAlign='middle' 
                        style={{marginBottom: "10px"}}
                    >
                        <Grid.Row columns={4}>
                            <Grid.Column>
                                <Button fluid style={{textAlign: "left"}} onClick={() => {
                                    setSelectedExerciseType('strength');
                                    setSelectedExerciseId(exercise.strength.id);
                                    setIsExerciseModalOpen(true);
                                }}>
                                    {exercise.strength.name} ({exercise.strength.equipment})
                                </Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Button 
                                    fluid
                                    floated="right"
                                    color={exercise.strength.favorite ? 'blue' : 'green'}
                                    onClick={() => handleFavoriteClick('strength', exercise)}>
                                    {exercise.strength.favorite ? "FAVORITE (click to unfavorite)" : "Add to favorites"}
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ))}
            </ul>
            </Segment>
            <Segment>
            <h2>Your Cardio Exercises:</h2>
            <ul>
                {cardioExercises.map(exercise => (
                    <Grid 
                        key={exercise.id}
                        verticalAlign='middle' 
                        style={{marginBottom: "10px"}}
                    >
                        <Grid.Row columns={4}>
                            <Grid.Column>
                                <Button fluid style={{textAlign: "left"}} onClick={() => {
                                    setSelectedExerciseType('cardio');
                                    setSelectedExerciseId(exercise.cardio.id);
                                    setIsExerciseModalOpen(true);
                                }}>
                                    {exercise.cardio.name} ({exercise.cardio.equipment})
                                </Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Button 
                                    fluid
                                    floated="right"
                                    color={exercise.cardio.favorite ? 'blue' : 'green'}
                                    onClick={() => handleFavoriteClick('cardio', exercise)}>
                                    {exercise.cardio.favorite ? "FAVORITE (click to unfavorite)" : "Add to favorites"}
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ))}
            </ul>
        </Segment>
        </Segment>
    );
    
    const loggedOutContent = (
        <h2>Please log in to access your Exercise Library!</h2>
    );

    return (
        <div>
            {user ? loggedInContent : loggedOutContent}
            <Exercise 
            exerciseType={selectedExerciseType}
            exerciseId={selectedExerciseId}
            open={isExerciseModalOpen}
            onClose={() => setIsExerciseModalOpen(false)}
            />
        </div>
    )
}

export default ExerciseLibrary;