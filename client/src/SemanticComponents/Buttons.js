import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom"

export const BackToWorkoutButton = ( {workoutId, buttonText = "Go Back To Workout"} ) => {
  const navigate = useNavigate();
  return (
    <div>
      <Button animated onClick={() => navigate(`/workout/${workoutId}`)}>
        <Button.Content visible>{buttonText}</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow left' />
        </Button.Content>
      </Button>
    </div>
  )
}

export const NewExerciseButton = ( {onClick, buttonText = "Create New Exercise"} ) => {
  return (
    <div>
      <Button icon labelPosition="left" onClick={onClick}>
        <Icon name='write' />
        {buttonText}
      </Button>
    </div>
  )
}

export const UseExistingButton = ( {onClick, buttonText = "Use Existing Exercise"} ) => {
  return (
    <div>
      <Button icon labelPosition="left" onClick={onClick}>
        <Icon name='list' />
        {buttonText}
      </Button>
    </div>
  )
}

export const AddToWorkoutButton = ( {onClick, buttonText = "Add to Workout"} ) => {
  return (
    <div>
      <Button icon labelPosition="left" onClick={onClick}>
        <Icon name="plus" />
        {buttonText}
      </Button>
    </div>
  )
}