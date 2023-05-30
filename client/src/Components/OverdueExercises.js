import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../atoms';
import { List, Segment } from 'semantic-ui-react';

const OverdueExercises = () => {
    const [overdueStrengthsCardios, setOverdueStrengthsCardios] = useState({strengths: [], cardios: []});
    const [user] = useRecoilState(userState);

    useEffect(() => {
        fetchOverdueStrengthsCardios();
    }, [user]);

    const fetchOverdueStrengthsCardios = async () => {
        if (!user) return;
        const response = await fetch(`/overdue_exercises/${user.id}`);
        const data = await response.json();
        setOverdueStrengthsCardios(data);
    }

    return (
        <Segment>
            <h2>Can't decide on an exercise?</h2>
            <h3>Here are some of your favorite exercises that you haven't performed in over 10 days:</h3>
            <h4>Overdue Strength Exercises:</h4>
            <List>
                {overdueStrengthsCardios.strengths.map(strength => (
                    <List.Item key={strength.id}>{`${strength.name} (${strength.equipment})`}</List.Item>
                ))}
            </List>
            <h4>Overdue Cardio Exercises:</h4>
            <List>
                {overdueStrengthsCardios.cardios.map(cardio => (
                    <List.Item key={cardio.id}>{`${cardio.name} (${cardio.equipment})`}</List.Item>
                ))}
            </List>
            <h4>You can add Exercises to your Favorites in the Exercise Library</h4>
        </Segment>
    )
}

export default OverdueExercises;