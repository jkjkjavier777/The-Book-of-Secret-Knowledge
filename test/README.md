# 🧪 Tests for The Book of Secret Knowledge

This directory contains all test files for the project.

## 📁 Structure

```
test/
├── unit/                    # Unit tests for individual components
│   └── core/               # Core service tests
│       ├── validation.test.js  # Input/output validation tests
│       └── retrieval.test.js   # Knowledge retrieval tests
├── integration/            # Integration tests for component interaction
├── e2e/                    # End-to-end tests for complete user journeys
├── safety/                 # Safety and security tests
│   └── safety.test.js      # Tests for blocking harmful content
├── fixtures/               # Test data and fixtures
│   └── sample-knowledge.json # Sample knowledge base for testing
└── mocks/                  # Mock modules and dependencies
```

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e       # End-to-end tests only
npm run test:safety    # Safety tests only

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 📋 Test Categories

### Unit Tests
- Test individual functions and modules in isolation
- Fast execution
- Focus on input/output validation
- Located in `test/unit/`

### Integration Tests
- Test interaction between multiple components
- Verify system behavior across module boundaries
- Located in `test/integration/`

### End-to-End Tests
- Test complete user journeys
- Verify full system functionality
- Located in `test/e2e/`

### Safety Tests
- Test blocking of harmful, dangerous, or unsafe content
- Verify safety mechanisms work correctly
- Located in `test/safety/`

## 🎯 Test Coverage

The project aims for:
- **80%+ overall coverage** (minimum)
- **90%+ for core services** (target)
- **100% for safety-critical functions** (required)

Run `npm run test:coverage` to see current coverage.

## 🔧 Adding New Tests

1. **Create test file** in appropriate directory
2. **Follow naming convention**: `*.test.js`
3. **Use descriptive test names**: `should do something specific`
4. **Group related tests** in `describe` blocks
5. **Mock external dependencies** to ensure isolation

### Example Test Structure

```javascript
/**
 * @file Module Name Tests
 * @purpose What this test validates
 * @dependencies Mocked or external dependencies
 */

describe('Module Name', () => {
  beforeEach(() => {
    // Setup before each test
  });
  
  afterEach(() => {
    // Cleanup after each test
  });
  
  describe('Feature or Function', () => {
    it('should do something specific', () => {
      // Test implementation
    });
  });
});
```

## 🔄 Continuous Integration

Tests run automatically on:
- Every push to `main`, `develop`, and feature branches
- Every pull request to `main`
- Daily scheduled runs

See `.github/workflows/test.yml` for CI configuration.

## 🛡️ Safety Testing

Safety tests are critical for this project. They ensure:
- Harmful content is blocked
- Dangerous instructions are not provided
- Banned patterns are detected and prevented
- User inputs are properly sanitized

**Safety tests must pass for PRs to be merged.**

## 📊 Test Reporting

- Test results are uploaded as artifacts in GitHub Actions
- Coverage reports are generated for each run
- Test failures are reported with detailed information

## 💡 Best Practices

1. **Keep tests isolated** - Each test should be independent
2. **Use mocks for external services** - Never call real APIs in tests
3. **Test edge cases** - Include null, empty, and invalid inputs
4. **Keep tests fast** - Avoid long delays in tests
5. **Update tests with code changes** - Keep tests in sync with implementation
6. **Remove obsolete tests** - Clean up tests for removed features

## 🔗 Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Node.js Testing Guide](https://nodejs.org/en/docs/guides/testing/)

## 📝 Notes

- Tests use Jest as the testing framework
- Mock external dependencies to ensure test isolation
- Safety tests have highest priority
- All tests should pass before merging to main branch
