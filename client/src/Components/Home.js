import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { userState, workoutsState } from "../atoms"
import { Segment, Button } from "semantic-ui-react"
import { BlueButton } from "../SemanticComponents/Buttons"

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
        <>
        <Segment>
            <h5>
                - This is your <span style={{ textDecoration: 'underline' }}>Workouts</span> page (aka your Home page) where you can create a new workout, or view and edit previous workouts.<br></br>
                - Select <span style={{ textDecoration: 'underline' }}>Exercise Library</span> above to see all the exercises you've recorded, and you can add or remove them from your Favorites.<br></br>
                - Click <span style={{ textDecoration: 'underline' }}>Analytics</span> above to view graphs which chart your progress over time performing each of your exercises.
            </h5>
        </Segment>
        
        <Segment>
        <>
            <BlueButton onClick={() => navigate(`/add_workout`)} buttonText="Create New Workout" />
            <Segment style={{ backgroundColor: '#fcf2e3'}}>
            <h2>Your Previous Workouts:</h2>
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
        </>
    );

    const loggedOutContent = (
        <>
            <h2>Please click Log In above to access gym_dandy!</h2>
        </>
    );

    return (
        <Segment style={{ backgroundColor: '#f7ca8b' }}>
            <h1>Greetings, {user ? user.username : "person who isn't logged in"}, and welcome to gym_dandy</h1>
            {user ? loggedInContent : loggedOutContent}
        </Segment>
    )
}

export default Home;