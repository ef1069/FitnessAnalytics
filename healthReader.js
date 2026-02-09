const fs = require('fs/promises');

async function readHealthData() {
    try {
        const data = await fs.readFile('data/health-metrics.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log("Something went wrong:", error.message);
        throw error;
    }
}

async function countHealthEntries() {
    try {
        const obj = await readHealthData();
        const metrics = obj && Array.isArray(obj.metrics) ? obj.metrics : [];
        const count = metrics.length;
        console.log(`Total health entries: ${count}`);
        return count;
    } catch (error) {
        console.log("Could not count health entries:", error.message);
        return 0;
    }
}

if (require.main === module) {
    countHealthEntries();
}

module.exports = { readHealthData, countHealthEntries };