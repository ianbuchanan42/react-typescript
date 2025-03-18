import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import axe from 'axe-core';
import ProductsApp from '../components/ProductsApp/ProductsApp';

interface AxeResults {
  violations: Array<{
    id: string;
    impact: string;
    tags: string[];
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      impact: string;
      target: string[];
      failureSummary: string;
    }>;
  }>;
}

interface AxeOptions {
  rules?: {
    [key: string]: { enabled: boolean };
  };
}

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(<ProductsApp />);

    // Wait for the component to load and render
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    // Run axe-core analysis with color contrast rules disabled
    const results = await act(async () => {
      return await (
        axe as unknown as {
          run: (
            element: HTMLElement,
            options?: AxeOptions
          ) => Promise<AxeResults>;
        }
      ).run(container, {
        rules: {
          'color-contrast': { enabled: false },
        },
      });
    });

    // Check for violations
    expect(results.violations).toHaveLength(0);
  });
});
