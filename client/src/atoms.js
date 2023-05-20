import { atom } from "recoil"

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