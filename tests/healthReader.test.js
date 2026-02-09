const fs = require('fs/promises');
const { readHealthData, countHealthEntries } = require('../healthReader');

jest.mock('fs/promises');

describe('healthReader', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('readHealthData()', () => {
        test('should read valid health JSON file and return data object', async () => {
            const mockData = {
                user: "Alex",
                metrics: [
                    { date: "2024-01-01", type: "sleep", duration: "7.5" },
                    { date: "2024-01-01", type: "nutrition", calories: "2100" }
                ]
            };

            fs.readFile.mockResolvedValue(JSON.stringify(mockData));

            const result = await readHealthData();
            expect(result).toEqual(mockData);
            expect(result.user).toBe("Alex");
            expect(Array.isArray(result.metrics)).toBe(true);
        });

        test('should throw error when file is missing', async () => {
            fs.readFile.mockRejectedValue(new Error('ENOENT: no such file or directory'));

            await expect(readHealthData()).rejects.toThrow();
        });

        test('should handle invalid JSON gracefully', async () => {
            fs.readFile.mockResolvedValue('invalid json {]');

            await expect(readHealthData()).rejects.toThrow();
        });
    });

    describe('countHealthEntries()', () => {
        test('should return correct count of health entries', async () => {
            const mockData = {
                user: "Alex",
                metrics: [
                    { date: "2024-01-01", type: "sleep", duration: "7.5" },
                    { date: "2024-01-01", type: "nutrition", calories: "2100" },
                    { date: "2024-01-02", type: "sleep", duration: "8.0" },
                    { date: "2024-01-02", type: "nutrition", calories: "2250" }
                ]
            };

            fs.readFile.mockResolvedValue(JSON.stringify(mockData));

            const count = await countHealthEntries();
            expect(count).toBe(4);
        });

        test('should return 0 when file is missing', async () => {
            fs.readFile.mockRejectedValue(new Error('File not found'));

            const count = await countHealthEntries();
            expect(count).toBe(0);
        });

        test('should handle empty metrics array', async () => {
            const mockData = {
                user: "Alex",
                metrics: []
            };

            fs.readFile.mockResolvedValue(JSON.stringify(mockData));

            const count = await countHealthEntries();
            expect(count).toBe(0);
        });

        test('should return data structure with user and metrics array', async () => {
            const mockData = {
                user: "Alex",
                metrics: [
                    { date: "2024-01-01", type: "sleep", duration: "7.5" }
                ]
            };

            fs.readFile.mockResolvedValue(JSON.stringify(mockData));

            const result = await readHealthData();
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('metrics');
            expect(Array.isArray(result.metrics)).toBe(true);
            expect(typeof result.user).toBe('string');
        });
    });
});
