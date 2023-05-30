import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../atoms';
import { List } from 'semantic-ui-react';

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
        <div>
            <h2>Overdue Strengths</h2>
            <List>
                {overdueStrengthsCardios.strengths.map(strength => (
                    <List.Item key={strength.id}>{`${strength.name} (${strength.equipment})`}</List.Item>
                ))}
            </List>
            <h2>Overdue Cardios</h2>
            <List>
                {overdueStrengthsCardios.cardios.map(cardio => (
                    <List.Item key={cardio.id}>{`${cardio.name} (${cardio.equipment})`}</List.Item>
                ))}
            </List>
        </div>
    )
}

export default OverdueExercises;