import { BrowserRouter as Router } from "react-router-dom"
import {Routes, Route} from "react-router-dom"
import React, {useEffect, useState} from "react"
import Authentication from "./Components/Authentication"
import NavBar from "./Components/NavBar"
import Home from "./Components/Home"
import Workout from "./Components/Workout"
import ExerciseLibrary from "./Components/ExerciseLibrary"
import { useRecoilState } from "recoil"
import { userState } from "./atoms"
import AddStrengthExercise from "./Components/AddStrengthExercise"

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
          <Route path="*" element={<Authentication updateUser={updateUser}/>}/>
        </Routes>
      </Router>
    </div>
  )
}
export default App;