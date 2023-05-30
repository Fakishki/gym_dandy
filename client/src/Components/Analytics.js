import { useRecoilState } from "recoil"
import { userState } from "../atoms"
import { BackHomeButton } from "../SemanticComponents/Buttons"
import { useNavigate } from "react-router-dom"
import { Button, Segment, Grid } from "semantic-ui-react"
import { useState } from "react"

function Analytics () {
    const [user] = useRecoilState(userState)
    const navigate = useNavigate()

    const loggedInContent = (
        <Segment>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <BackHomeButton />
                <h1>Welcome to gym_dandy Analytics</h1>
                <h2>Use these tools to track your workout progress over time</h2>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <>
                <Button onClick={() => navigate(`/strength_analytics`)}>Strength Exercise Analytics</Button>
                <Button onClick={() => navigate(`/cardio_analytics`)}>Cardio Exercise Analytics</Button>
                </>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
    )

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
}

export default Analytics;