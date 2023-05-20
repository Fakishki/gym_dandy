import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./navbar.css"

function NavBar({updateUser}) {
    const [menu, setMenu] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        fetch("/logout", {method: "DELETE"})
        .then(res => {
            if (res.ok) {
                updateUser(null)
                navigate("/signup")
            }
        })
    }

    // const handleMenuToggle = () => {
    //     setMenu(prevState => !prevState);
    // }

    
    return (
        <nav className="navigation">
            <ul>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    )

}
export default NavBar
//     return (
//         <nav className="navigation">
//             <a href="/" className="brand-name">
//                 My Workout Tracker
//             </a>
//             <button className="hamburger" onClick={handleMenuToggle}>
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="white"
//                 >
//                     <path
//                     fillRule="evenodd"
//                     d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
//                     clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//             <div
//                 className={`navigation-menu ${menu ? 'active' : ''}`}>
//                     <ul>
//                         <li>
//                             <a href="/login">Login/Signup</a>
//                         </li>
//                         <li onClick={handleLogout}>Logout</li>
//                     </ul>
//                 </div>
//         </nav>

//     )
// }

// export default NavBar