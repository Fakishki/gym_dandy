import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { userState, workoutsState } from "../atoms";
import { Button } from "semantic-ui-react";

const AddWorkout = () => {
  const [user] = useRecoilState(userState);
  const [workouts, setWorkouts] = useRecoilState(workoutsState);
  const [weighIn, setWeighIn] = useState("");
  const navigate = useNavigate();

  const backHome = () => {
    navigate("/")
  }

  const handleWeighInChange = (e) => {
    setWeighIn(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalWeighIn = weighIn === "" ? null : weighIn; // Check if weighIn is empty and set it to null
    fetch("/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        weigh_in: finalWeighIn, // Use finalWeighIn instead of weighIn
        user_id: user.id
      }),
    })
      .then((res) => res.json())
      .then((newWorkout) => {
        setWorkouts([newWorkout, ...workouts]);
        navigate(`/workout/${newWorkout.id}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const loggedInContent = (
    <div>
      <Button onClick={backHome}>Go Back</Button>
      <form onSubmit={handleSubmit}>
        <label>
          Weigh-in:
          <input type="number" value={weighIn} onChange={handleWeighInChange} />
        </label>
        <Button type="submit">Create New Workout</Button>
      </form>
    </div>
  );

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
};

export default AddWorkout;