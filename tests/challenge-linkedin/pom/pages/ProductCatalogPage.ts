import { expect, Locator, Page } from "@playwright/test";

export class ProductCatalogPage {
  private page: Page;
  readonly firstProduct: Locator;
  readonly productName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstProduct = page.getByTestId(/^product-/).first();
    this.productName = page.getByTestId("product-name");
  }

  async goHome(): Promise<void> {
    await this.page.goto("/");
  }

  async openFirstProduct(): Promise<void> {
    await expect(this.firstProduct).toBeVisible();
    await this.firstProduct.click();
    await expect(this.page).toHaveURL(/\/product\//);
  }

  async expectProductTitleVisible(): Promise<void> {
    await expect(this.productName).toBeVisible();
  }
}
