import { useRecoilState } from "recoil"
import { userState } from "../atoms"
import { BackHomeButton, BlueButton } from "../SemanticComponents/Buttons"
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
                <Segment style={{ backgroundColor: '#f7ca8b' }}>
                <h1>gym_dandy Analytics</h1>
                <Segment style={{ backgroundColor: '#fcf2e3'}}>
                <h3>Use these tools to track your workout progress over time</h3>
                <>
                <BlueButton onClick={() => navigate(`/strength_analytics`)} buttonText="Strength Exercise Analytics" />
                <BlueButton onClick={() => navigate(`/cardio_analytics`)} buttonText="Cardio Exercise Analytics" />
                </>
                </Segment>
                </Segment>
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