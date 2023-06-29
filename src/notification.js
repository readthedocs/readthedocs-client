import { library, icon } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleXmark,
  faCodePullRequest,
} from "@fortawesome/free-solid-svg-icons";
import { html, nothing, render, LitElement } from "lit";

import styleSheet from "./notification.css";
import { AddonBase } from "./utils";

export class NotificationElement extends LitElement {
  /** @static @property {string} - registered HTML element tag name */
  static elementName = "readthedocs-notification";

  /** @static @property {Object} - Lit reactive properties */
  static properties = {
    className: { state: true },
    config: {
      state: true,
      // Update derived fields from config data
      // TODO the URLs here should come from a backend API instead
      hasChanged: (before, after) => {
        if (after && Object.keys(after).length) {
          this.urls = {
            build: `${window.location.protocol}//${after.domains.dashboard}/projects/${after.project.slug}/builds/${after.build.id}/`,
            external: `${after.project.repository_url}/pull/${after.version.slug}`,
          };
        }
      },
    },
    urls: { state: true },
  };

  /** @static @property {Object} - Lit stylesheets to apply to elements */
  static styles = styleSheet;

  constructor() {
    super();

    this.className = this.className || "raised floating";
    this.config = {};
    this.urls = {
      build: null,
      external: null,
    };
  }

  loadConfig(config) {
    this.config = config;
  }

  render() {
    // The element doesn't yet have our config, don't render it.
    if (!this.config) {
      // nothing is a special Lit response type
      return nothing;
    }

    try {
      if (
        this.config.features.external_version_warning.enabled &&
        this.config.version.external
      ) {
        return this.renderExternalVersionWarning();
      }
    } catch (TypeError) {
      // Configuration options are missing or configuration is empty.
    }

    // TODO support the outdated version warning
  }

  renderExternalVersionWarning() {
    library.add(faCircleXmark);
    library.add(faCodePullRequest);
    const xmark = icon(faCircleXmark, {
      title: "Close notification",
    });
    const iconPullRequest = icon(faCodePullRequest, {
      title: "This version is a pull request version",
      classes: ["header", "icon"],
    });

    return html`
      <div>
        ${iconPullRequest.node[0]}
        <div class="title">
          This page was created from a pull request build
          <a href="#" class="right" @click=${this.closeNotification}>
            ${xmark.node[0]}
          </a>
        </div>
        <div class="content">
          This page
          <a href="${this.urls.build}">was created</a>
          from a pull request (<a href="${this.urls.external}"
            >#${this.config.version.slug}</a
          >).
        </div>
      </div>
    `;
  }

  closeNotification(e) {
    // TODO add cookie to allow closing this notification for all page views on this
    // PR build.
    this.remove();

    // Avoid event propagation
    return false;
  }
}

customElements.define("readthedocs-notification", NotificationElement);

/**
 * Notification addon
 *
 * Currently this addon is used to warn readers that the documentation is built
 * from a pull request.
 *
 * The default implementation is a floating element, but this can also be hard
 * coded into the page from the author or theme author. If there is a hardcoded
 * element, we do not inject a new element, but the web component is
 * initialized as normal by the browser.
 *
 * We load the param ``config`` into the elements after creation and API
 * response, as this is needed to give hardcoded elements access to ``config``
 *
 * @param {Object} config - Addon configuration object
 */
export class NotificationAddon extends AddonBase {
  constructor(config) {
    super();

    // If there are no elements found, inject one
    let elems = document.querySelectorAll("readthedocs-notification");
    if (!elems.length) {
      elems = [new NotificationElement()];
      render(elems[0], document.body);
    }

    for (const elem of elems) {
      elem.loadConfig(config);
    }
  }

  /**
   * Test if addon is enabled in the configuration
   *
   * @param {Object} config - Addon configuration object
   */
  static isEnabled(config) {
    // TODO support the outdated version warning feature here too.
    return (
      config.features &&
      config.features.external_version_warning.enabled &&
      config.version.external
    );
  }
}
