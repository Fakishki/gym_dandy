import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { userState, overdueExercisesState, workoutModificationState, isAddStrengthExerciseModalOpenState } from '../atoms';
import { List, Segment, Button } from 'semantic-ui-react';
import AddStrengthExercise from './AddStrengthExercise';

const OverdueExercises = () => {
    const [user] = useRecoilState(userState);
    const overdueExercisesLoadable = useRecoilValueLoadable(overdueExercisesState(user?.id));
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [isAddStrengthExerciseModalOpen, setIsAddStrengthExerciseModalOpen] = useRecoilState(isAddStrengthExerciseModalOpenState);

    useRecoilValue(workoutModificationState);

    // The state of the Loadable that we get from useRecoilValueLoadable
    // will tell us whether the asynchronous selector is still pending, has completed, or has error.
    switch(overdueExercisesLoadable.state) {
      case 'loading':
        return <div>Loading...</div>;  // render a loading indicator
      case 'hasError':
        throw overdueExercisesLoadable.contents;  // in case of error, throw it
      case 'hasValue':
        const overdueStrengthsCardios = overdueExercisesLoadable.contents; // on success, get the value
        return (
          <>
          <Segment style={{ backgroundColor: '#f7ca8b' }}>
              <h2>Can't decide on an exercise?</h2>
              <h3>Here are some of your favorite exercises that you haven't done in over two weeks:</h3>
              <Segment style={{ backgroundColor: '#fcf2e3'}}>
              <h4>Overdue Strength Exercises:</h4>
              <List>
                  {overdueStrengthsCardios.strengths.map(strength => (
                      <List.Item key={strength.id}>
                        {/* {`${strength.name} (${strength.equipment})`} */}
                        <Button 
                          onClick={() => {setSelectedExercise(strength); setIsAddStrengthExerciseModalOpen(true);}}>
                          {`${strength.name} (${strength.equipment})`}
                        </Button>
                      </List.Item>
                  ))}
              </List>
              <h4>Overdue Cardio Exercises:</h4>
              <List>
                  {overdueStrengthsCardios.cardios.map(cardio => (
                      <List.Item key={cardio.id}>{`${cardio.name} (${cardio.equipment})`}</List.Item>
                  ))}
              </List>
              <h4>You can add exercises to your Favorites in the Exercise Library</h4>
              </Segment>
          </Segment>
          <AddStrengthExercise
          open={isAddStrengthExerciseModalOpen}
          onClose={() => setIsAddStrengthExerciseModalOpen(false)}
          selectedExercise={selectedExercise}
          />
          </>
        );
      default:
        return null;
    }
}

export default OverdueExercises;
