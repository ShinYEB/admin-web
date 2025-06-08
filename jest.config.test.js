nextJest = require('next/jest').default;
originalJestConfig = require('./jest.config');

// jest.config.test.js
jest.mock('next/jest', () => {
    const mockCreateJestConfig = jest.fn(config => {
        // Return a function that returns the config to simulate the actual behavior
        return () => ({ ...config, transformed: true });
    });
    
    return {
        __esModule: true,
        default: jest.fn(() => mockCreateJestConfig)
    };
});

describe('Jest Configuration', () => {
    let originalJestConfig;
    let nextJest;
    let createJestConfigMock;
    
    beforeEach(() => {
        // Clear module cache to ensure fresh imports
        jest.resetModules();
        // Import after mocks are set up
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('nextJest is called with the correct directory', () => {
        expect(nextJest).toHaveBeenCalledWith({ dir: './' });
    });

    test('createJestConfig is called with the correct custom configuration', () => {
        const mockCreateJestConfig = nextJest.mock.results[0].value;
        
        expect(mockCreateJestConfig).toHaveBeenCalledWith(expect.objectContaining({
            setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
            testEnvironment: 'jest-environment-jsdom',
            moduleNameMapper: expect.objectContaining({
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
                '\\.(jpg|jpeg|png|gif|webp|svg|ttf|eot|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
                '^@/(.*)$': '<rootDir>/$1',
            })
        }));
    });

    test('module exports the result of createJestConfig', () => {
        // Given the mock implementation, we should have the transformed config
        const expectedConfig = expect.any(Function);
        expect(originalJestConfig).toEqual(expectedConfig);
    });

    test('exported config function returns transformed config when executed', () => {
        // Test that the returned function behaves as expected
        const result = originalJestConfig();
        expect(result).toHaveProperty('transformed', true);
        expect(result).toHaveProperty('setupFilesAfterEnv');
        expect(result).toHaveProperty('testEnvironment', 'jest-environment-jsdom');
    });

    test('customJestConfig contains proper CSS module mapping', () => {
        const mockCreateJestConfig = nextJest.mock.results[0].value;
        const calledConfig = mockCreateJestConfig.mock.calls[0][0];
        
        expect(calledConfig.moduleNameMapper['\\.(css|less|scss|sass)$']).toBe('identity-obj-proxy');
    });

    test('customJestConfig contains proper asset file mapping', () => {
        const mockCreateJestConfig = nextJest.mock.results[0].value;
        const calledConfig = mockCreateJestConfig.mock.calls[0][0];
        
        expect(calledConfig.moduleNameMapper['\\.(jpg|jpeg|png|gif|webp|svg|ttf|eot|woff|woff2)$'])
            .toBe('<rootDir>/__mocks__/fileMock.js');
    });
});