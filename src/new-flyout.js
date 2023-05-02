import READTHEDOCS_LOGO from "./images/logo-wordmark-dark.svg";
import { html, nothing, render, LitElement } from "lit";

import styleSheet from "./new-flyout.css";
import { AddonBase } from "./utils";

export class FlyoutElement extends LitElement {
  static elementName = "readthedocs-flyout";

  static properties = {
    config: { state: true },
  };

  static styles = styleSheet;

  constructor() {
    super();

    this.className = this.className || "raised floating bottom-right";
    this.config = {};
  }

  loadConfig(config) {
    this.config = config;
  }

  renderFooter() {
    return nothing;
  }

  renderSearch() {
    return nothing;
  }

  renderVCS() {
    return nothing;
  }

  renderReadTheDocs() {
    return nothing;
  }

  renderDownloads() {
    return html`
      <div class="downloads">
        <h3>Downloads</h3>
        <ul>
          <li><a href="">PDF</a></li>
        </ul>
      </div>
    `;
  }

  renderDownloads() {
    if (!this.config.addons.flyout.downloads) {
      return nothing;
    }

    // NOTE: all these `render*()` functions could be merged together and use attributes
    // to deal with the small differences between each of them
    return html`
      <div class="downloads">
        <h3>Downloads</h3>
        <ul>
          ${this.config.addons.flyout.downloads.map(
            (download, index) => html`
              <li><a href="${download.url}">${download.name}</a></li>
            `
          )}
        </ul>
      </div>
    `;
  }

  renderVersions() {
    // TODO: use `this.config.versions.flyout` instead here.
    // This "filter" will implies `active=True and hidden=False`
    if (!this.config.addons.flyout.versions) {
      return nothing;
    }

    // NOTE: all these `render*()` functions could be merged together and use attributes
    // to deal with the small differences between each of them
    return html`
      <div class="versions">
        <h3>Versions</h3>
        <ul>
          ${this.config.addons.flyout.versions.map(
            (version, index) => html`
              <li><a href="${version.url}">${version.slug}</a></li>
            `
          )}
        </ul>
      </div>
    `;
  }

  renderLanguages() {
    if (!this.config.addons.flyout.translations) {
      return nothing;
    }

    // NOTE: all these `render*()` functions could be merged together and use attributes
    // to deal with the small differences between each of them
    return html`
      <div class="languages">
        <h3>Languages</h3>
        <ul>
          ${this.config.addons.flyout.translations.map(
            (translation, index) => html`
              <li><a href="${translation.url}">${translation.slug}</a></li>
            `
          )}
        </ul>
      </div>
    `;
    return html`
      <div class="languages">
        <h3>Languages</h3>
        <ul>
          <li><a href="">es</a></li>
        </ul>
      </div>
    `;
  }

  render() {
    // The element doesn't yet have our config, don't render it.
    if (!this.config) {
      // nothing is a special Lit response type
      return nothing;
    }

    return html`
      <div class="container">
        <img class="logo" src="${READTHEDOCS_LOGO}" alt="Read the Docs" />
        ${this.renderLanguages()} ${this.renderVersions()}
        ${this.renderDownloads()} ${this.renderReadTheDocs()}
        ${this.renderVCS()} ${this.renderSearch()} ${this.renderFooter()}
      </div>
    `;
  }
}

/**
 * Flyout addon
 *
 * @param {Object} config - Addon configuration object
 */
export class FlyoutAddon extends AddonBase {
  constructor(config) {
    super();

    customElements.define("readthedocs-flyout", FlyoutElement);

    // If there are no elements found, inject one
    let elems = document.querySelectorAll("readthedocs-flyout");
    if (!elems.length) {
      elems = [new FlyoutElement()];
      render(elems[0], document.body);
    }

    for (const elem of elems) {
      elem.loadConfig(config);
    }
  }

  static isEnabled(config) {
    return config.addons && config.addons.flyout.enabled;
  }
}
