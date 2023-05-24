import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { userState, workoutsState } from "../atoms";
import { Button } from "semantic-ui-react";

const AddWorkout = () => {
  const [user] = useRecoilState(userState);
  const [workouts, setWorkouts] = useRecoilState(workoutsState);
  const [weighIn, setWeighIn] = useState(null);
  const navigate = useNavigate();

  const backHome = () => {
    navigate("/")
  }

  const handleWeighInChange = (e) => {
    setWeighIn(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        weigh_in: weighIn,
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

  return (
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
};

export default AddWorkout;