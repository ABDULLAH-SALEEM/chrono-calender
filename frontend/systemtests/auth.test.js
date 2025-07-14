import { test, expect } from "@playwright/test";

function generateUniqueEmail() {
  return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
}

test.describe("Authentication Flow", () => {
  test("User can register and then login", async ({ page }) => {
    const email = generateUniqueEmail();
    const password = "TestPassword123!";
    const name = "Test User";

    // Go to register page
    await page.goto("/register");

    // Fill registration form using MUI TextField labels
    await page.getByLabel("Name").fill(name);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: /register/i }).click();

    // Expect to be redirected to home (or check for a UI element that only appears after login)
    await expect(page).toHaveURL(/\/$/);
    // Optionally, check for a UI element that confirms login, e.g. a sidebar, profile, etc.

    // Sign out using the sidebar sign out button
    // Open sidebar if needed (for mobile, you may need to click the menu icon)
    // Try to find the 'Sign Out' button and click it
    await page.getByRole("button", { name: /sign out/i }).click();
    // After sign out, expect to be redirected to login page
    await expect(page).toHaveURL(/\/$/);

    // Go to login page (redundant if already redirected, but safe)
    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: /login/i }).click();

    // Expect to be redirected to home (or check for a UI element that confirms login)
    await expect(page).toHaveURL(/\/$/);
    // Optionally, check for a UI element that confirms login
    await page.getByRole("button", { name: /sign out/i }).click();
  });
});
