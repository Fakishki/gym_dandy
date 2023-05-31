import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { userState, workoutsState } from "../atoms"
import { Segment, Button } from "semantic-ui-react"

const Home = () => {
    const [user, setUser] = useRecoilState(userState);
    const [workouts, setWorkouts] = useRecoilState(workoutsState);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkouts();
    }, [user])

    const fetchWorkouts = () => {
        if (!user) return;

        fetch(`/workouts?user_id=${user.id}`)
            .then(res => res.json())
            .then(workouts => {
                workouts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setWorkouts(workouts);
            })
    }

    const loggedInContent = (
        <Segment>
        <>
            <Button style={{marginBottom: "10px", backgroundColor: "#22194D", color: "white"}} onClick={() => navigate(`/add_workout`)}>Create New Workout</Button>
            <Segment style={{ backgroundColor: '#fcf2e3'}}>
            <h2>Your Past Workouts:</h2>
            <div>
                {workouts.map(workout => (
                    <Button 
                    as={Link} 
                    to={`/workout/${workout.id}`} 
                    key={workout.id} 
                    style={{textAlign: 'left', marginBottom: '10px', display: 'block'}}
                    >
                    {new Date(workout.created_at).toLocaleDateString()} - {workout.weigh_in ? `Weigh-in: ${workout.weigh_in} lbs` : 'Weigh-in: Not provided'} (ID: {workout.id})
                    </Button>
                ))}
            </div>
            </Segment>

        </>
        </Segment>
    );

    const loggedOutContent = (
        <>
            <h2>Please click Log In above to access gym_dandy!</h2>
        </>
    );

    return (
        <Segment style={{ backgroundColor: '#f7ca8b' }}>
            <h1>Greetings, {user ? user.username : "person who isn't logged in"}. Welcome to gym_dandy</h1>
            {user ? loggedInContent : loggedOutContent}
        </Segment>
    )
}

export default Home;