const fs = require('fs');
const csv = require('csv-parser');

async function readWorkoutData() {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream('data/workouts.csv')
            .pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function countWorkouts() {
    try {
        const workouts = await readWorkoutData();
        const count = workouts.length;
        console.log(`Total workouts: ${count}`);
        return count;
    } catch (error) {
        console.log("Could not count workouts:", error.message);
        return 0;
    }
}

async function calculateTotalMinutes() {
    try {
        const workouts = await readWorkoutData();
        let totalMinutes = 0;
        
        for (let i = 0; i < workouts.length; i++) {
            const duration = parseInt(workouts[i].duration, 10);
            if (!isNaN(duration)) {
                totalMinutes += duration;
            }
        }
        
        console.log(`Total workout minutes: ${totalMinutes}`);
        return totalMinutes;
    } catch (error) {
        console.log("Could not calculate total minutes:", error.message);
        return 0;
    }
}

if (require.main === module) {
    (async () => {
        await countWorkouts();
        await calculateTotalMinutes();
    })();
}

module.exports = { readWorkoutData, countWorkouts, calculateTotalMinutes };