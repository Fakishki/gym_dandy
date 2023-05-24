import { useRecoilState } from "recoil"
import { userState } from "../atoms"
import { useState } from "react"

function Analytics () {
    const [user] = useRecoilState(userState)

    const loggedInContent = (
        <div>
            <h2>We're building something useful here - Check back soon!</h2>
        </div>
    )

    const loggedOutContent = (
        <div>
            <h2>You must be logged in to view this page</h2>
        </div>
    )

    return (
        <div>
            {user ? loggedInContent : loggedOutContent}
        </div>
    )
}

export default Analytics;