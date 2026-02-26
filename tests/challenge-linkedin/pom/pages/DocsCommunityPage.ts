import { expect, Locator, Page } from "@playwright/test";
import { urls } from "../../config/test-data";

export class DocsCommunityPage {
  private page: Page;
  readonly communityLink: Locator;
  readonly docsSidebar: Locator;
  readonly ambassadorsLink: Locator;
  readonly section: Locator;

  constructor(page: Page) {
    this.page = page;
    this.communityLink = page.getByRole("link", { name: "Community" });
    this.docsSidebar = page.getByLabel("Docs sidebar");
    this.ambassadorsLink = this.docsSidebar.getByRole("link", {
      name: "Ambassadors",
    });
    this.section = page.locator("section");
  }

  async goToDocsHome(): Promise<void> {
    await this.page.goto(urls.docsBaseUrl);
  }

  async openAmbassadors(): Promise<void> {
    await this.communityLink.click();
    await this.ambassadorsLink.click();
  }

  async expectSectionToContain(text: string): Promise<void> {
    await expect(this.section).toContainText(text);
  }
}
