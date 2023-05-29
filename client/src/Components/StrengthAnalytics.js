import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { oneWorkoutState, strengthExercisesState, userState } from "../atoms";
import { Button, Grid, Segment, Form } from "semantic-ui-react";
import { BackToWorkoutButton, NewExerciseButton, UseExistingButton, AddToWorkoutButton } from "../SemanticComponents/Buttons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const AddStrengthExercise = () => {
    const navigate = useNavigate();
    const [strengthExercises, setStrengthExercises] = useRecoilState(strengthExercisesState);
    const user = useRecoilValue(userState);
    const userId = user?.id;
    const workout = useRecoilValue(oneWorkoutState)
    const workoutId = workout?.id
    const [selectedStrengthExerciseId, setSelectedStrengthExerciseId] = useState("");
    const [selectedStrengthId, setSelectedStrengthId] = useState("");
    const [previousWeights, setPreviousWeights] = useState(null);
    const [chartData, setChartData] = useState([]);

    // debugger

    useEffect(() => {
        if (selectedStrengthExerciseId && selectedStrengthId) {
            // Debug step 1: Logging parameters
            console.log(`userId: ${userId}, selectedStrengthId: ${selectedStrengthId}`);
            fetch(`/previous_strength_strength_exercises/${userId}/${selectedStrengthId}`)
            .then(response => {
                // Ensure the fetch was successful, else throw an error
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Debug step 2: Logging the response
                console.log("Response data:", data);
                if (data.error) {
                    setPreviousWeights(null);
                    setChartData([]);
                } else {
                    setPreviousWeights(data);
                    const chartData = data.map((weight, index) => ({
                        name: `Measurement ${index +1 }`,
                        weight: weight.weight
                    }))
                    setChartData(chartData);
                }
            })
            .catch(error => {
                // This will catch any fetch or parsing errors
                console.error("Fetch or parsing error:", error);
            });
        } else {
            setPreviousWeights(null);
        }
    }, [selectedStrengthExerciseId, selectedStrengthId]);

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
                  <>
                    {/* Existing strength form */}
                    <Form>
                      <Form.Field>
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
                      </Form.Field>
                      <Form.Field>
                        {previousWeights ? (
                            <LineChart width={500} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                        </LineChart>
                        ) : (
                            <div>No Data to Show</div>
                        )}
                      </Form.Field>
                    </Form>
                  </>
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
