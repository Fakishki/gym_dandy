import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { oneWorkoutState, cardioExercisesState, userState } from "../atoms";
import { Button, Grid, Segment, Form } from "semantic-ui-react";
import { BackAnalyticsButton } from "../SemanticComponents/Buttons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CardioAnalytics = () => {
    const navigate = useNavigate();
    const [cardioExercises, setCardioExercises] = useRecoilState(cardioExercisesState);
    const user = useRecoilValue(userState);
    const userId = user?.id;
    const workout = useRecoilValue(oneWorkoutState)
    const workoutId = workout?.id
    const [selectedCardioExerciseId, setSelectedCardioExerciseId] = useState("");
    const [selectedCardioId, setSelectedCardioId] = useState("");
    const [previousDistance, setPreviousDistance] = useState(null);
    const [chartData, setChartData] = useState([]);

    // debugger

    useEffect(() => {
        if (selectedCardioExerciseId && selectedCardioId) {
            fetch(`/previous_cardio_cardio_exercises/${userId}/${selectedCardioId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    setPreviousDistance(false);
                    setChartData([]);
                } else {
                    setPreviousDistance(data.length > 0);
                    
                    console.log('Fetched Data:', data);  // Log the fetched data

                    const chartData = data.map((record) => {
                        console.log('Record:', record);  // Log the individual record

                        // Convert time to seconds for calculation
                        const [minutes, seconds] = record.time.split(":").map(Number);
                        const timeInSeconds = minutes * 60 + seconds;
            
                        // Check if record.distance is a valid number
                        if (isNaN(record.distance) || record.distance === null) {
                            return null;  // skip this record if record.distance is not a valid number
                        }
            
                        // Calculate pace (time per distance unit)
                        const paceInSeconds = timeInSeconds / record.distance;

                        // Convert pace to "minutes' format
                        const paceMinutes = paceInSeconds / 60;
            
                        // // Depreciated in favor of above method - Convert pace back to "minutes:seconds" format
                        // const paceMinutes = Math.floor(paceInSeconds / 60);
                        // const paceSeconds = Math.floor(paceInSeconds % 60);
            
                        return {
                            name: new Date(record.workout_created_at).toLocaleDateString(),
                            distance: record.distance,
                            time: record.time,
                            units: record.units,
                            // Depreciated
                            // pace: `${paceMinutes}:${paceSeconds < 10 ? "0" + paceSeconds : paceSeconds}`
                            pace: paceMinutes
                        };
                    }).filter(record => record !== null); // remove null records from chartData

                    console.log('Chart Data:', chartData);  // Log the processed chart data
            
                    chartData.reverse();
                    setChartData(chartData);
                }
            })
            
            .catch(error => {
                console.error("Fetch or parsing error:", error);
            });
        } else {
            setPreviousDistance(null);
        }
    }, [selectedCardioExerciseId, selectedCardioId]);

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
    
    const loggedInContent = (
        <Segment>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <BackAnalyticsButton />
                <h1>Cardio Exercise Analytics</h1>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                {/* Forms */}
                {
                  <>
                    {/* Existing cardio form */}
                    <Form>
                      <Form.Field>
                        <label>Select a Cardio Exercise to view a chart of your progress:</label>
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
                        {previousDistance ? (
                            <div style={{maxWidth: "1000px"}}>
                                <ResponsiveContainer width="100%" aspect={2.3}>
                                    <LineChart width={600} height={400} data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis 
                                            domain={["dataMin", "dataMax"]}
                                            tickFormatter={(value) => {
                                                const minutes = Math.floor(value);
                                                const seconds = Math.round((value - minutes) * 60);
                                                return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
                                            }}
                                        />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="pace" stroke="#8884d8" />
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
    
export default CardioAnalytics;
