import {Routes, Route, useNavigate} from "react-router-dom"
import {React, useEffect, useState} from "react"
import Authentication from "./Components/Authentication"
import NavBar from "./Components/NavBar"


const App = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

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
  if (!user) return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Authentication updateUser={updateUser}/>}/>
      </Routes>
    </>
  )

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Authentication updateUser={updateUser}/>}/>
      </Routes>
    </>
  )
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
