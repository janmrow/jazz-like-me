import { test, expect } from "@playwright/test";

test("selecting a tag shows jazz album recommendations", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Jazz Like Me" })
  ).toBeVisible();

  const tagButton = page.getByRole("checkbox", { name: "calm" });
  await tagButton.click();
  await expect(tagButton).toHaveAttribute("aria-checked", "true");

  await expect(
    page.getByRole("heading", { name: /albums for you/i })
  ).toBeVisible();

  const recommendations = page.locator(".recommendations .album-card");
  await expect(recommendations).toHaveCount(3);

  const firstAlbum = recommendations.first();
  await expect(firstAlbum.locator(".album-title")).not.toBeEmpty();
  await expect(firstAlbum.locator(".album-artist")).not.toBeEmpty();
});
