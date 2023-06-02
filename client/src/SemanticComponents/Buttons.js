import React, { useState } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom"

// AddExercise Buttons
export const BackToWorkoutButton = ( {workoutId, buttonText = "Go Back To Workout", onClick} ) => {
  const navigate = useNavigate();
  return (
    <div>
      <Button animated onClick={() => { navigate(`/workout/${workoutId}`); onClick && onClick(); }}>
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

export const BackHomeButton = ( {onClick, buttonText = "Back to Workout List"} ) => {
  const navigate = useNavigate();
  return (
    <div>
      <Button animated onClick={() => navigate(`/`)}>
        <Button.Content visible>{buttonText}</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow left' />
        </Button.Content>
      </Button>
    </div>
  )
}

export const BackAnalyticsButton = ( {onClick, buttonText = "Back to Analytics"} ) => {
  const navigate = useNavigate();
  return (
    <div>
      <Button animated onClick={() => navigate(`/analytics`)}>
        <Button.Content visible>{buttonText}</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow left' />
        </Button.Content>
      </Button>
    </div>
  )
}

export const BlueButton = ({ onClick, buttonText }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div>
      <Button
        style={{
          marginBottom: "10px",
          backgroundColor: "#22194D",
          color: "white",
          backgroundColor: isHovered ? "#57565C" : "#22194D",
          // Apply other styles based on hover state
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {buttonText}
      </Button>
    </div>
  );
};
