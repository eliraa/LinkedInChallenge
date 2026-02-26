import { expect, Locator, Page } from "@playwright/test";

type BillingAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export class CheckoutPage {
  private page: Page;
  readonly proceed1: Locator;
  readonly proceed2: Locator;
  readonly proceed3: Locator;
  readonly street: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly postalCode: Locator;
  readonly paymentMethod: Locator;
  readonly finishButton: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly loginSubmit: Locator;
  readonly paymentContainer: Locator;
  readonly visibleSpinners: Locator;

  readonly firstProduct: Locator;
  readonly addToCart: Locator;
  readonly cartToast: Locator;
  readonly paymentSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.proceed1 = page.getByTestId("proceed-1");
    this.proceed2 = page.getByTestId("proceed-2");
    this.proceed3 = page.getByTestId("proceed-3");
    this.street = page.getByTestId("street");
    this.city = page.getByTestId("city");
    this.state = page.getByTestId("state");
    this.country = page.getByTestId("country");
    this.postalCode = page.getByTestId("postal_code");
    this.paymentMethod = page.getByTestId("payment-method");
    this.finishButton = page.getByTestId("finish");
    this.email = page.getByTestId("email");
    this.password = page.getByTestId("password");
    this.loginSubmit = page.getByTestId("login-submit");
    this.paymentContainer = page
      .locator("section, form, div")
      .filter({ has: page.getByTestId("payment-method") })
      .first();
    this.visibleSpinners = page.locator(
      ".spinner-border:visible, .loading-spinner:visible, [data-test='spinner']:visible, [data-test='loading']:visible"
    );

    this.firstProduct = page.getByTestId(/^product-/).first();
    this.addToCart = page.getByTestId("add-to-cart");
    this.cartToast = page.getByRole("alert").filter({
      hasText: /product added to shopping cart/i,
    });
    this.paymentSuccessMessage = page.getByTestId("payment-success-message");
  }

  async openFirstProduct(): Promise<void> {
    await expect(this.firstProduct).toBeVisible();
    await this.firstProduct.click();
    await expect(this.page).toHaveURL(/\/product\//);
  }

  async addCurrentProductToCart(): Promise<void> {
    await expect(this.addToCart).toBeVisible();
    await this.addToCart.click();
    await expect(this.cartToast).toBeVisible();
  }

  async proceedFromCart(): Promise<void> {
    await expect(this.proceed1).toBeVisible();
    await this.proceed1.click();
  }

  async proceedFromSignInIfPresent(): Promise<void> {
    if (await this.proceed2.isVisible()) {
      await this.proceed2.click();
    }
  }

  async expectLoginStepVisible(): Promise<void> {
    await expect(this.loginSubmit).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.expectLoginStepVisible();
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginSubmit.click();
  }

  async expectProceed2Visible(): Promise<void> {
    await expect(this.proceed2).toBeVisible();
  }

  async fillBillingAddress(address: BillingAddress): Promise<void> {
    await expect(this.street).toBeVisible();

    await this.street.fill(address.street);
    await expect(this.street).toHaveValue(address.street);

    await this.city.fill(address.city);
    await expect(this.city).toHaveValue(address.city);

    await this.country.fill(address.country);
    await this.country.press("Tab");

    await this.state.fill(address.state);
    await this.state.press("Tab");
    await expect(this.state).toHaveValue(address.state);

    await this.postalCode.fill(address.postalCode);
    await this.postalCode.press("Tab");
    await expect(this.postalCode).toHaveValue(address.postalCode);
  }

  async proceedToPayment(): Promise<void> {
    await expect(this.proceed3).toBeVisible();
    await this.proceed3.click();
    await expect(this.paymentMethod).toBeVisible();
  }

  async selectPaymentMethod(value: string): Promise<void> {
    await this.paymentMethod.selectOption(value);
  }

  async waitForPaymentContainer(): Promise<void> {
    await expect(this.paymentContainer).toBeVisible();
  }

  async expectNoVisibleSpinners(): Promise<void> {
    await expect(this.visibleSpinners).toHaveCount(0);
  }

  async finish(): Promise<void> {
    await expect(this.finishButton).toBeVisible();
    await this.finishButton.click();
    await expect(this.paymentSuccessMessage).toBeVisible();
  }
}
