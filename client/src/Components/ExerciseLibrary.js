import React, { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { useNavigate, Link } from "react-router-dom"
import { userState, strengthExercisesState, cardioExercisesState } from "../atoms"
import { BackHomeButton } from "../SemanticComponents/Buttons"
import { Button, Segment, Grid, Icon } from "semantic-ui-react"
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
            <Segment style={{ backgroundColor: '#f7ca8b' }}>
            <h1>Your Exercise Library</h1>
            <Segment style={{ backgroundColor: '#fcf2e3'}}>
            <h4>Below are all of the exercises you've recorded in gym_dandy</h4>
            <h4>Add exercises to your favorites to get reminders when you haven't done them in a while</h4>
            </Segment>
            <Segment style={{ backgroundColor: '#fcf2e3'}}>
            <h2>Your Strength Exercises:</h2>
            <Segment>
            <ul>
                {strengthExercises.map(exercise => (
                    <Grid 
                        key={exercise.id}
                        verticalAlign='middle' 
                        // style={{marginBottom: "10px"}}
                    >
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Button fluid  style={{textAlign: "left", backgroundColor: "#22194D", color: "white"}} onClick={() => {
                                    setSelectedExerciseType('strength');
                                    setSelectedExerciseId(exercise.strength.id);
                                    setIsExerciseModalOpen(true);
                                }}>
                                    {exercise.strength.name} ({exercise.strength.equipment})
                                </Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Button 
                                    style={{width: "141px"}}
                                    icon
                                    fluid
                                    labelPosition="left"
                                    size="mini"
                                    floated="left"
                                    color={exercise.strength.favorite ? 'green' : 'gray'}
                                    onClick={() => handleFavoriteClick('strength', exercise)}>
                                        <Icon name="star" />
                                        {exercise.strength.favorite ? "FAVORITE" : "Add to favorites"}
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ))}
            </ul>
            </Segment>
            </Segment>
            <Segment style={{ backgroundColor: '#fcf2e3'}}>
            <h2>Your Cardio Exercises:</h2>
            <Segment>
            <ul>
                {cardioExercises.map(exercise => (
                    <Grid 
                        key={exercise.id}
                        verticalAlign='middle' 
                        // style={{marginBottom: "10px"}}
                    >
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Button fluid style={{textAlign: "left", backgroundColor: "#22194D", color: "white"}} onClick={() => {
                                    setSelectedExerciseType('cardio');
                                    setSelectedExerciseId(exercise.cardio.id);
                                    setIsExerciseModalOpen(true);
                                }}>
                                    {exercise.cardio.name} ({exercise.cardio.equipment})
                                </Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Button 
                                    style={{width: "141px"}}
                                    icon
                                    labelPosition="left"
                                    size="mini"
                                    floated="left"
                                    color={exercise.cardio.favorite ? 'green' : 'gray'}
                                    onClick={() => handleFavoriteClick('cardio', exercise)}>
                                        <Icon name="star" />
                                        {exercise.cardio.favorite ? "FAVORITE" : "Add to favorites"}
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ))}
            </ul>
            </Segment>
            </Segment>
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