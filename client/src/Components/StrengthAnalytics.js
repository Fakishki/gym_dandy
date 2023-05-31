import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { oneWorkoutState, strengthExercisesState, userState } from "../atoms";
import { Button, Grid, Segment, Form } from "semantic-ui-react";
import { BackAnalyticsButton } from "../SemanticComponents/Buttons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StrengthAnalytics = () => {
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
            fetch(`/previous_strength_strength_exercises/${userId}/${selectedStrengthId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    setPreviousWeights(false);
                    setChartData([]);
                } else {
                    setPreviousWeights(data.length > 0);
                    const chartData = data.map((record) => ({
                        // This is currently showing the Workout created_at date. If you want strength_exercise created_at, remove ".workout"
                        name: new Date(record.workout.created_at).toLocaleDateString(),
                        // name: new Date(record.workout.created_at).toISOString().split('T')[0], <-- UNNEEDED FIX (FOR NOW)
                        weight: record.weight,
                        sets: record.sets,
                        reps: record.reps
                    }));
                    // chartData.reverse(); <-- OLD AND MAYBE NOT NEEDED
                    setChartData(chartData);
                }
            })
            .catch(error => {
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: '#fcf2e3',
                    border: '2px solid #f7ca8b',
                    padding: '5px',
                    borderRadius: '10px'
                }}>
                    <p className="label">{`Date : ${label}`}</p>
                    <p className="intro">{`Weight : ${payload[0].value}`}</p>
                    <p className="desc">{`Sets : ${payload[0].payload.sets}`}</p>
                    <p className="desc">{`Reps : ${payload[0].payload.reps}`}</p>
                </div>
            );
        }
    
        return null;
    };    
    
    const loggedInContent = (
        <Segment>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <BackAnalyticsButton />
                <h1>Strength Exercise Analytics</h1>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                {/* Forms */}
                {
                  <>
                    {/* Existing strength form */}
                    <Form>
                      <Form.Field>
                        <label>Select a Strength Exercise to view a chart of your progress:</label>
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
                            <div style={{maxWidth: "1000px"}}>
                                <ResponsiveContainer width="100%" aspect={2.3}>
                                    <LineChart width={600} height={400} data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />}/>
                                        <Legend />
                                        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div>No Data to Show (select an exercise above)</div>
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
    
export default StrengthAnalytics;
