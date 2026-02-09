const fs = require('fs');
const { PassThrough } = require('stream');
const { readWorkoutData, countWorkouts, calculateTotalMinutes } = require('../workoutReader');

jest.mock('fs');

describe('workoutReader', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('readWorkoutData()', () => {
        test('should read valid CSV file and return array of workout objects', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.write('2024-01-01,Running,30,300\n');
            mockStream.write('2024-01-02,Cycling,45,400\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const result = await readWorkoutData();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });

        test('should return array with objects containing expected properties', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.write('2024-01-01,Running,30,300\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const result = await readWorkoutData();
            expect(result.length).toBe(1);
            expect(result[0]).toHaveProperty('date');
            expect(result[0]).toHaveProperty('exercise');
            expect(result[0]).toHaveProperty('duration');
            expect(result[0]).toHaveProperty('calories');
            expect(result[0].exercise).toBe('Running');
        });

        test('should handle empty CSV file', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const result = await readWorkoutData();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });

    describe('countWorkouts()', () => {
        test('should return correct total count of workouts', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.write('2024-01-01,Running,30,300\n');
            mockStream.write('2024-01-02,Cycling,45,400\n');
            mockStream.write('2024-01-03,Yoga,60,200\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const count = await countWorkouts();
            expect(typeof count).toBe('number');
            expect(count).toBe(3);
        });

        test('should handle empty CSV file', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const count = await countWorkouts();
            expect(typeof count).toBe('number');
            expect(count).toBe(0);
        });

        test('should return a number data type', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.write('2024-01-01,Running,30,300\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const count = await countWorkouts();
            expect(Number.isInteger(count)).toBe(true);
        });
    });

    describe('calculateTotalMinutes()', () => {
        test('should calculate correct total workout minutes', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.write('2024-01-01,Running,30,300\n');
            mockStream.write('2024-01-02,Cycling,45,400\n');
            mockStream.write('2024-01-03,Yoga,60,200\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const total = await calculateTotalMinutes();
            expect(typeof total).toBe('number');
            expect(total).toBe(135);
        });

        test('should handle invalid duration values', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.write('2024-01-01,Running,30,300\n');
            mockStream.write('2024-01-02,Cycling,invalid,400\n');
            mockStream.write('2024-01-03,Yoga,60,200\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const total = await calculateTotalMinutes();
            expect(typeof total).toBe('number');
            expect(total).toBe(90); // 30 + 60, skipping invalid
        });

        test('should handle empty CSV file', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const total = await calculateTotalMinutes();
            expect(typeof total).toBe('number');
            expect(total).toBe(0);
        });

        test('should return a number data type', async () => {
            const mockStream = new PassThrough();
            mockStream.write('date,exercise,duration,calories\n');
            mockStream.write('2024-01-01,Running,30,300\n');
            mockStream.end();

            fs.createReadStream.mockReturnValue(mockStream);

            const total = await calculateTotalMinutes();
            expect(Number.isInteger(total)).toBe(true);
        });
    });
});