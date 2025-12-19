import { test, expect } from '@playwright/experimental-ct-react';
import PageLoader from '../../src/components/PageLoader';

test.use({ viewport: { width: 500, height: 500 } });

test('should render loader correctly', async ({ mount }) => {
    const component = await mount(<PageLoader />);
    await expect(component).toBeVisible();

    // Check if the spinner element is present
    const spinner = component.locator('.animate-spin');
    await expect(spinner).toBeVisible();
});
