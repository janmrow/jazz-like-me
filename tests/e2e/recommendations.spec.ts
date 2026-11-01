import { test, expect } from "@playwright/test";

test("selecting discovery tags shows jazz album recommendations", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Jazz Like Me" })
  ).toBeVisible();

  const calmButton = page.getByRole("checkbox", { name: "calm" });
  await calmButton.click();
  await expect(calmButton).toHaveAttribute("aria-checked", "true");

  await expect(
    page.getByRole("heading", { name: "Up to three albums for you" })
  ).toBeVisible();

  const recommendations = page.locator(".recommendations .album-card");
  await expect(recommendations).toHaveCount(3);

  const firstAlbum = recommendations.first();
  await expect(firstAlbum.locator(".album-title")).not.toBeEmpty();
  await expect(firstAlbum.locator(".album-artist")).not.toBeEmpty();

  const energeticButton = page.getByRole("checkbox", { name: "energetic" });
  await energeticButton.click();
  await expect(energeticButton).toHaveAttribute("aria-checked", "true");
  await expect(calmButton).toHaveAttribute("aria-checked", "false");

  await expect(recommendations).toHaveCount(3);
});
