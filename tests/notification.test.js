import { assert, fixture, html } from "@open-wc/testing";
import { NotificationElement } from "../src/notification";

describe("Notification element", () => {
  it("is defined", () => {
    const elem = document.createElement("readthedocs-notification");
    assert.instanceOf(elem, NotificationElement);
  });

  it("doesn't render if the config is missing", async () => {
    const elem = await fixture(
      html`<readthedocs-notification></readthedocs-notification>`
    );
    assert.shadowDom.equal(elem, ``);
  });
});
