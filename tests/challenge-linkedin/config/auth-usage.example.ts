import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/customer.json" });

// logged-in tests here
