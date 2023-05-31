import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../atoms';
import { Modal, Header, List, Segment, Button } from 'semantic-ui-react';

const Exercise = ({ exerciseType, exerciseId, open, onClose }) => {
    const [exerciseInstances, setExerciseInstances] = useState([]);
    const [exerciseName, setExerciseName] = useState(''); // New state variable for exercise's name
    const [user] = useRecoilState(userState);

    useEffect(() => {
        fetchExerciseInstances();
    }, [exerciseId]);

    const fetchExerciseInstances = async () => {
        if (!exerciseId || !user) return;
        const response = await fetch(`/previous_${exerciseType}_${exerciseType}_exercises/${user.id}/${exerciseId}`);
        const data = await response.json();
        data.sort((a, b) => new Date(b.workout.created_at) - new Date(a.workout.created_at));
        setExerciseInstances(data);
    
        if (data.length > 0) {
            if (exerciseType === 'strength') {
                setExerciseName(`${data[0].strength.name} (${data[0].strength.equipment})`);
            } else if (exerciseType === 'cardio') {
                setExerciseName(`${data[0].cardio.name} (${data[0].cardio.equipment})`);
            }
        } else {
            setExerciseName(''); // Fallback value when there's no instances
        }
    }

    const secondsToHMS = (d) => {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
      
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay; 
    }    

    const renderExerciseDetails = (exercise) => {
        if (exerciseType === 'strength') {
            return (
                <>
                    <List.Item>{`Weight: ${exercise.weight}`}</List.Item>
                </>
            );
        } else {
            return (
                <>
                    <List.Item>{`Time: ${secondsToHMS(exercise._time)}`}</List.Item>
                </>
            );
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header style={{ backgroundColor: '#f7ca8b' }}>{exerciseName ? `Here are all the times you've recorded ${exerciseName}` : 'No History for this Exercise'}
                <Button floated="right" onClick={onClose}>Close</Button>
            </Modal.Header>
            <Modal.Content>
                {exerciseInstances.map(exercise => (
                    <Segment key={exercise.id}>
                        <Header>{new Date(exercise.workout.created_at).toLocaleString()}</Header>
                        <List>
                            {renderExerciseDetails(exercise)}
                        </List>
                    </Segment>
                ))}
            </Modal.Content>
        </Modal>
    );
};

export default Exercise;
