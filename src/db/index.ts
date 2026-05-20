import Dexie, { type Table}  from 'dexie'
import type { Workout, Exercise, WorkoutTemplate } from "../types";

class GymDatabase extends Dexie {

    workouts!: Table<Workout>
    exercises!: Table<Exercise>
    templates!: Table<WorkoutTemplate>

    constructor() {
        super('GymTrackerDB');

        this.version(2).stores({
            workouts: 'id, date, completed',
            exercises: 'id, muscleGroup, equipment',
            templates: 'id',
        })
    }
}

export const db = new GymDatabase()