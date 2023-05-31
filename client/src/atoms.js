import { atom, selectorFamily } from "recoil"

export const userState = atom({
    key: "userState",
    default: null,
})

export const workoutsState = atom({
    key: "workoutsState",
    default: [],
})

export const oneWorkoutState = atom({
    key: "oneWorkoutState",
    default: {},
})

export const oneStrengthExerciseState = atom({
    key: "oneStrengthExerciseState",
    default: {},
})

export const oneCardioExerciseState = atom({
    key: "oneCardioExerciseState",
    default: {},
})

export const strengthExercisesState = atom({
    key: "strengthExercisesState",
    default: [],
})

export const cardioExercisesState = atom({
    key: "cardioExercisesState",
    default: [],
})

export const selectedStrengthState = atom({
    key: "selectedStrengthState",
    default: null,
})

export const chartDataState = atom({
    key: "chartDataState",
    default: [],
})

export const workoutModificationState = atom({
    key: "workoutModificationState",
    default: Date.now(),
});

export const overdueExercisesState = selectorFamily({
    key: 'overdueExercisesState',
    get: (userId) => ({get}) => {
        const lastModification = get(workoutModificationState);
        if (!userId) return Promise.resolve({strengths: [], cardios: []});

        return fetch(`/overdue_exercises/${userId}`)
            .then(response => response.json())
            .then(data => {
                const sortedStrengths = data.strengths.sort((a, b) => a.name.localeCompare(b.name));
                const sortedCardios = data.cardios.sort((a, b) => a.name.localeCompare(b.name));

                return {strengths: sortedStrengths, cardios: sortedCardios};
            });
    },
});

export const workoutDataState = selectorFamily({
    key: 'workoutDataState',
    get: (workoutId) => ({get}) => {
      return fetch(`/workouts/${workoutId}`)
        .then(res => res.json())
        .catch(error => {
          throw error;
        });
    },
  });