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


    return (
        <div>
            <h1>Welcome {user && user.username}!</h1>
            <h2>Your Workouts:</h2>
            <ul>
                {workouts.map(workout =>(
                    <li key={workout.id}>
                        <Link to={`/workout/${workout.id}`}>
                            {workout.id}: {new Date(workout.created_at).toLocaleDateString()} - Weigh-in: {workout.weigh_in} lbs
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )

}

export default Home;
