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