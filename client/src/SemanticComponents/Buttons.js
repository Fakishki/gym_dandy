import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom"

const BackToWorkoutButton = ( {workoutId} ) => {
  const navigate = useNavigate();

  return (
    <div>
      <Button animated onClick={() => navigate(`/workout/${workoutId}`)}>
        <Button.Content visible>Go Back To Workout</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow left' />
        </Button.Content>
      </Button>
    </div>
  )
}

export default BackToWorkoutButton
