import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil"
import { userState, workoutsState } from "../atoms"

const Home = () => {
    const [user, setUser] = useRecoilState(userState);
    const [workouts, setWorkouts] = useRecoilState(workoutsState);

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
            <h2>Your Workouts:</h2>
            <Link to="/add_workout">Create New Workout</Link>
            <ul>
                {workouts.map(workout =>(
                    <li key={workout.id}>
                        <Link to={`/workout/${workout.id}`}>
                            {/* Workouts currently listed chron backwards by updated_date for
                            seed/testing - Change back to created_at for launch */}
                            {workout.id}: {new Date(workout.created_at).toLocaleDateString()} - Weigh-in: {workout.weigh_in ? `Weigh-in: ${workout.weigh_in} lbs` : 'Weigh-in: Not provided'}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );

    const loggedOutContent = (
        <h2>Please register or log in to access your workout tracker!</h2>
    );

    return (
        <div>
            <h1>Welcome {user ? user.username : ""}</h1>
            {user ? loggedInContent : loggedOutContent}
        </div>
    )
}

export default Home;