require('dotenv').config();
const { readHealthData, countHealthEntries } = require('./healthReader');
const { readWorkoutData, countWorkouts, calculateTotalMinutes } = require('./workoutReader');

async function processData() {
    try {
        const userName = process.env.USER_NAME;
        const weeklyGoal = parseInt(process.env.WEEKLY_GOAL, 10);

        console.log(`\n=== Fitness Analytics Report ===`);
        console.log(`User: ${userName}`);
        console.log(`Weekly Goal: ${weeklyGoal} minutes\n`);

        const healthCount = await countHealthEntries();
        const workoutCount = await countWorkouts();
        const totalMinutes = await calculateTotalMinutes();

        console.log(`\n=== Summary ===`);
        console.log(`Health Entries: ${healthCount}`);
        console.log(`Total Workouts: ${workoutCount}`);
        console.log(`Total Workout Minutes: ${totalMinutes}`);

        if (totalMinutes >= weeklyGoal) {
            console.log(`\n✓ Great job, ${userName}! You have met your weekly goal of ${weeklyGoal} minutes.`);
        } else {
            const remaining = weeklyGoal - totalMinutes;
            console.log(`\n✗ ${userName}, you are ${remaining} minutes short of your weekly goal of ${weeklyGoal} minutes.`);
        }
    } catch (error) {
        console.log("Error processing data:", error.message);
    }
}

processData();

