import { test } from "@playwright/test";
import { ProductCatalogPage } from "../pom/pages/ProductCatalogPage";

test(
  "first product opens and shows product title",
  { tag: "@ChallengeLinkedin" },
  async ({ page }) => {
    const productCatalog = new ProductCatalogPage(page);

    await productCatalog.goHome();
    await productCatalog.openFirstProduct();
    await productCatalog.expectProductTitleVisible();
  }
);

