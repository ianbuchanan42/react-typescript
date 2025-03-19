# Testing Guide

## Overview

This project uses Jest and React Testing Library for testing, with axe-core for accessibility testing. The tests are automatically run in GitHub Actions on push to main and pull requests.

## Test Structure

- Tests are located in `src/__tests__/` directory
- Each test file follows the pattern `*.test.tsx`
- Accessibility tests are separated into their own file

## Running Tests Locally

### Accessibility Tests

```bash
npm run test:accessibility
```

### All Tests

```bash
npm test
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

- Uses `ts-jest` for TypeScript support
- Uses `jsdom` for browser environment simulation
- Includes CSS module mocking
- Configured to use a separate TypeScript config for tests

### GitHub Actions (`accessibility.yml`)

The workflow runs on:

- Push to main branch
- Pull requests to main branch

Steps:

1. Checkout repository
2. Setup Node.js 20
3. Install dependencies
4. Build application
5. Run accessibility tests

## Writing Tests

### Accessibility Testing

```typescript
import { render } from '@testing-library/react';
import axe from 'axe-core';

describe('Accessibility Tests', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<YourComponent />);

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Run accessibility check
    const results = await axe.run(container);

    // Assert no violations
    expect(results.violations).toHaveLength(0);
  });
});
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component Tests', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

## Best Practices

1. Test user interactions, not implementation details
2. Use semantic queries (getByRole, getByText) over test IDs
3. Test accessibility for all major components
4. Mock external dependencies and API calls
5. Use async/await for asynchronous operations
6. Keep tests focused and isolated

## Troubleshooting

- If tests fail in CI but pass locally, check for environment-specific issues
- For accessibility failures, use the axe-core results to identify specific violations
- Check the GitHub Actions logs for detailed error messages
