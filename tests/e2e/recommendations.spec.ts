import { test, expect } from "@playwright/test";

test("selecting a tag shows three jazz album recommendations", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Jazz Like Me" })
  ).toBeVisible();

  const tagButton = page.getByRole("checkbox", { name: "calm" });
  await tagButton.click();
  await expect(tagButton).toHaveAttribute("aria-checked", "true");

  await expect(
    page.getByRole("heading", { name: "Three albums for you" })
  ).toBeVisible();

  const recommendations = page.locator(".recommendations .album-card");
  await expect(recommendations).toHaveCount(3);

  const firstAlbum = recommendations.first();
  await expect(firstAlbum.locator(".album-title")).toContainText(
    "At the Pershing: But Not for Me"
  );
});
