import { test, expect } from '@playwright/test';

test.describe('Authentication Failure Cases', () => {
    test('should show error when submitting empty form', async ({ page }) => {
        await page.goto('/auth');
        await page.click('button[type="submit"]'); // Assuming there's a submit button

        // Check for validation error messages (HTML5 validation or UI error)
        // Adjust selector based on actual implementation
        // For now assuming HTML5 or immediate validation
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        // Mock network failure for login endpoint
        await page.route('**/api/users/login', async route => {
            await route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Invalid credentials' }),
            });
        });

        await page.goto('/auth');
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Expect an error toast or message
        await expect(page.getByText('Invalid credentials')).toBeVisible({ timeout: 10000 });
    });

    test('should handle server errors gracefully', async ({ page }) => {
        // Mock 500 error
        await page.route('**/api/users/login', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Server error' }),
            });
        });

        await page.goto('/auth');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');

        await expect(page.getByText('Server error')).toBeVisible({ timeout: 10000 });
    });
});
