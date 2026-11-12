const { test, expect } = require('@playwright/test');
const data = require('./fixtures/order-data.json');

test('order an iPhone 12 through checkout', async ({ page }) => {
  await page.goto('/');

  // Add iPhone 12 (product id 1) to the cart and verify the bag
  await page.locator('[id="1"]').getByText('Add to cart', { exact: true }).click();
  await expect(page.locator('.float-cart__content p.title')).toHaveText(data.product.name);

  // Checkout redirects to sign-in
  await page.getByText('Checkout', { exact: true }).click();
  await expect(page).toHaveURL(/signin\?checkout=true/);

  // react-select dropdowns: type the option and press Enter
  await page.locator('#username').locator('input[type="text"]').fill(data.login.username);
  await page.keyboard.press('Enter');
  await page.locator('#password').locator('input[type="text"]').fill(data.login.password);
  await page.keyboard.press('Enter');
  await page.locator('#login-btn').click();

  // Shipping details
  await expect(page).toHaveURL(/\/checkout$/);
  await page.locator('#firstNameInput').fill(data.shipping.firstName);
  await page.locator('#lastNameInput').fill(data.shipping.lastName);
  await page.locator('#addressLine1Input').fill(data.shipping.address);
  await page.locator('#provinceInput').fill(data.shipping.state);
  await page.locator('#postCodeInput').fill(data.shipping.postalCode);
  await page.locator('#checkout-shipping-continue').click();

  // Confirmation
  await expect(page).toHaveURL(/\/confirmation$/);
  await expect(page.getByText('Your Order has been successfully placed.')).toBeVisible();
  await expect(page.getByRole('heading', { name: data.product.name })).toBeVisible();
  await expect(page.getByText(data.product.price)).toBeVisible();
});
