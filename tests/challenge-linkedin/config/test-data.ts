export type UserCredentials = {
  email: string;
  password: string;
  displayName: string;
};

export type CheckoutAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

// Step 1: Read a value from env with a safe fallback.
function readEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

// Step 2: Expose current runtime environment selection.
export const environments = {
  current: readEnv("TEST_ENV", "staging"),
};

// Step 3: Expose reusable URLs for tests.
export const urls = {
  docsBaseUrl: readEnv("BASE_URL_DOCS", "https://playwright.dev"),
  apiBaseUrl: readEnv("BASE_URL_API", "https://api.practicesoftwaretesting.com"),
};

// Step 4: Expose reusable user credentials for auth flows.
export const users: Record<string, UserCredentials> = {
  customer: {
    email: readEnv("USER_CUSTOMER_EMAIL", "customer@practicesoftwaretesting.com"),
    password: readEnv("USER_CUSTOMER_PASSWORD", "welcome01"),
    displayName: readEnv("USER_CUSTOMER_NAME", "Jane Doe"),
  },
};

// Step 5: Expose checkout address data used in checkout forms.
export const checkoutAddress: CheckoutAddress = {
  street: readEnv("CHECKOUT_STREET", "123 Toolshop Street"),
  city: readEnv("CHECKOUT_CITY", "Amsterdam"),
  state: readEnv("CHECKOUT_STATE", "North Holland"),
  country: readEnv("CHECKOUT_COUNTRY", "Netherlands"),
  postalCode: readEnv("CHECKOUT_POSTAL_CODE", "1000AA"),
};
