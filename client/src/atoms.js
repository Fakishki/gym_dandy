import { atom } from "recoil"

export const userState = atom({
    key: "userState",
    default: "",
})

export const workoutsState = atom({
    key: "workoutsState",
    default: [],
})

export const oneWorkoutState = atom({
    key: "oneWorkoutState",
    default: {},
})