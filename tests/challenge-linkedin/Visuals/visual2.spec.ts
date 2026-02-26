import { test } from "@playwright/test";
import { DocsCommunityPage } from "../pom/pages/DocsCommunityPage";

test("test", async ({ page }) => {
  const docsCommunity = new DocsCommunityPage(page);

  await docsCommunity.goToDocsHome();
  await docsCommunity.openAmbassadors();
  await docsCommunity.expectSectionToContain("Butch Mayhew");
});

