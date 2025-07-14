import { test, expect } from "@playwright/test";

const EMAIL = "saleemabdullah764@gmail.com";
const PASSWORD = "abdullah123";
const EVENT_TITLE = `Playwright Test Event ${Date.now()}`;
const EVENT_DESCRIPTION = `This is a test event created by Playwright. ${Date.now()}`;
const UPDATED_DESCRIPTION = `This is an updated description. ${Date.now()}`;

// Helper: login and return page
async function login(page) {
  await page.goto("http://localhost:3000/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: /login/i }).click();
  await expect(page.getByTestId("calendar-page")).toBeVisible();
}

test.describe("Calendar Event CRUD", () => {
  test("should login, create, edit, and delete an event", async ({ page }) => {
    // 1. Login
    await login(page);

    // 2. Open Add New Event dialog
    await page.getByRole("button", { name: /add new event/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // 3. Fill event form and create event
    await page.getByLabel("Event title").fill(EVENT_TITLE);
    await page.getByLabel("Event description").fill(EVENT_DESCRIPTION);
    await page
      .getByTestId("start-datetime")
      .getByText("MM/DD/YYYY hh:mm aa")
      .click();
    await page
      .getByTestId("start-datetime")
      .getByRole("spinbutton", { name: "Month" })
      .type("07");
    await page
      .getByTestId("start-datetime")
      .getByRole("spinbutton", { name: "Day" })
      .type("14");
    await page
      .getByTestId("start-datetime")
      .getByRole("spinbutton", { name: "Year" })
      .type("2025");
    await page
      .getByTestId("start-datetime")
      .getByRole("spinbutton", { name: "Hours" })
      .type("12");
    await page
      .getByTestId("start-datetime")
      .getByRole("spinbutton", { name: "Minutes" })
      .type("00");
    await page
      .getByTestId("start-datetime")
      .getByRole("spinbutton", { name: "Meridiem" })
      .type("PM");

    // end date
    await page
      .getByTestId("end-datetime")
      .getByText("MM/DD/YYYY hh:mm aa")
      .click();
    await page
      .getByTestId("end-datetime")
      .getByRole("spinbutton", { name: "Month" })
      .type("07");
    await page
      .getByTestId("end-datetime")
      .getByRole("spinbutton", { name: "Day" })
      .type("15");
    await page
      .getByTestId("end-datetime")
      .getByRole("spinbutton", { name: "Year" })
      .type("2025");
    await page
      .getByTestId("end-datetime")
      .getByRole("spinbutton", { name: "Hours" })
      .type("12");
    await page
      .getByTestId("end-datetime")
      .getByRole("spinbutton", { name: "Minutes" })
      .type("00");
    await page
      .getByTestId("end-datetime")
      .getByRole("spinbutton", { name: "Meridiem" })
      .type("PM");
    // Submit
    await page.getByTestId("event-form-submit").click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // 4. Verify event appears in calendar (search by title)
    await page
      .getByPlaceholder("Search events by title, description, or tags...")
      .fill(EVENT_TITLE);
    await page
      .getByPlaceholder("Search events by title, description, or tags...")
      .click();
    await page
      .getByRole("option", { name: new RegExp(EVENT_TITLE) })
      .first()
      .click();
    await expect(page.getByLabel("Event title")).toHaveValue(EVENT_TITLE);
    await expect(page.getByLabel("Event description")).toHaveValue(
      EVENT_DESCRIPTION
    );

    // 5. Edit event description
    await page.getByLabel("Event description").fill(UPDATED_DESCRIPTION);
    await page.getByRole("button", { name: /update/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // 6. Reopen event and verify update
    await page
      .getByPlaceholder("Search events by title, description, or tags...")
      .fill(EVENT_TITLE);
    await page
      .getByPlaceholder("Search events by title, description, or tags...")
      .click();
    await page
      .getByRole("option", { name: new RegExp(EVENT_TITLE) })
      .first()
      .click();
    await expect(page.getByLabel("Event description")).toHaveValue(
      UPDATED_DESCRIPTION
    );

    // 7. Delete event
    await page.getByRole("button", { name: /delete/i }).click();
    await page.getByRole("dialog", { name: /delete event/i });
    await page
      .getByRole("button", { name: /^delete$/i })
      .last()
      .click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // 8. Verify event is gone
    await page
      .getByPlaceholder("Search events by title, description, or tags...")
      .fill(EVENT_TITLE);
    await page
      .getByPlaceholder("Search events by title, description, or tags...")
      .click();
    await expect(
      page.getByRole("option", { name: new RegExp(EVENT_TITLE) })
    ).toHaveCount(0);
  });
});
