import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import {Routes, Route} from "react-router-dom"
import React, {useEffect, useState} from "react"
import Authentication from "./Components/Authentication"
import NavBar from "./Components/NavBar"
import Home from "./Components/Home"
import Workout from "./Components/Workout"
import ExerciseLibrary from "./Components/ExerciseLibrary"
import AddWorkout from "./Components/AddWorkout"
import { useRecoilState } from "recoil"
import AddStrengthExercise from "./Components/AddStrengthExercise"
import AddCardioExercise from "./Components/AddCardioExercise"
import Analytics from "./Components/Analytics"
import { userState } from "./atoms"


const App = () => {
  const [user, setUser] = useRecoilState(userState)

  useEffect(() => {
    fetchUser()
  },[])

  const fetchUser = () => {
    fetch("/authorized")
    .then(res => {
      if(res.ok) {
        res.json()
        .then(setUser)
      } else {
        setUser(null)
      }
    })
  }

  const updateUser = (user) => setUser(user)

  return (
    <div>
      <Router>
        <NavBar updateUser={updateUser} />
        <Routes>
          <Route path="/login" element={<Authentication updateUser={updateUser}/>}/>
          <Route path="/" element={<Home />}/>
          <Route path="/workout/:id" element={<Workout />}/>
          <Route path="/exercise-library" element={<ExerciseLibrary />} />
          <Route path="/add_strength_exercise" element={<AddStrengthExercise />} />
          <Route path="/add_cardio_exercise" element={<AddCardioExercise />} />
          <Route path="*" element={<Authentication updateUser={updateUser}/>}/>
          <Route path="/add_workout" element={<AddWorkout />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </div>
  )
}
export default App;