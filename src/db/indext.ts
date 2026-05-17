import Dexie, { type Table}  from 'dexie'
import type { Workout, Exercise } from "../types";

class GymDatabase extends Dexie {

    workout!: Table<Workout>

    exercise!: Table<Exercise>

    constructor() {
        super('GymTrackerDB');

        this.version(1).stores({
            workouts: 'id, date, completed',

            exercise: 'id, muscleGroup, equipment'
        })
    }
}

export const db = new GymDatabase()