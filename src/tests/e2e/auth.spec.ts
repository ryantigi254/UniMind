import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/auth');
  });

  test('should show verification message after sign up', async ({ page }) => {
    // Click the sign up tab/link if needed
    await page.getByRole('link', { name: /sign up/i }).click();

    // Fill in the sign up form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('StrongPass123!');

    // Submit the form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Verify verification message appears
    await expect(page.getByText(/Please check your email for verification instructions/i)).toBeVisible();
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    // Click the sign up tab/link
    await page.getByRole('link', { name: /sign up/i }).click();

    // Fill in the sign up form with existing email
    await page.getByLabel(/email/i).fill('existing@example.com');
    await page.getByLabel(/password/i).fill('StrongPass123!');

    // Submit the form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Verify error message appears
    await expect(page.getByText(/Email already registered/i)).toBeVisible();
  });

  test('should block unverified user login', async ({ page }) => {
    // Fill in the login form with unverified email
    await page.getByLabel(/email/i).fill('unverified@example.com');
    await page.getByLabel(/password/i).fill('StrongPass123!');

    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify error message appears
    await expect(page.getByText(/Please verify your email before signing in/i)).toBeVisible();
  });

  test('should allow verified user login', async ({ page }) => {
    // Fill in the login form with verified email
    await page.getByLabel(/email/i).fill('verified@example.com');
    await page.getByLabel(/password/i).fill('StrongPass123!');

    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify successful login
    await expect(page).toHaveURL('http://localhost:4000/');
  });

  test('should prevent login with invalid credentials', async ({ page }) => {
    // Fill in the login form with wrong password
    await page.getByLabel(/email/i).fill('verified@example.com');
    await page.getByLabel(/password/i).fill('WrongPass123!');

    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify error message appears
    await expect(page.getByText(/Invalid login credentials/i)).toBeVisible();
  });

  test('should navigate to terms page when continuing without sign up', async ({ page }) => {
    // Click the continue without sign up button
    await page.getByText('Continue without Sign Up').click();

    // Verify redirect to terms page
    await expect(page).toHaveURL('http://localhost:4000/terms');
    await expect(page.getByText(/Welcome to UniMind/i)).toBeVisible();
    await expect(page.getByText(/What UniMind Is/i)).toBeVisible();
    await expect(page.getByText(/Accept & Continue/i)).toBeVisible();
  });
});