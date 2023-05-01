import { CLIENT_VERSION } from "./utils";

/**
 * Get the Read the Docs API version supported by user's integrations.
 *
 */
function _getMetadataAPIVersion() {
  const meta = document.querySelector("meta[name=readthedocs-api-version]");
  if (meta !== undefined) {
    return meta.getAttribute("content");
  }
  return undefined;
}

/**
 * Load Read the Docs configuration from API endpoint.
 *
 */
export function getReadTheDocsConfig() {
  let url =
    "/_/readthedocs-config/?" +
    new URLSearchParams({
      url: window.location.href,
    });

  // Retrieve a static JSON file when working in development mode
  if (window.location.href.startsWith("http://localhost")) {
    url = "/_/readthedocs-config.json";
  }

  return fetch(url, {
    method: "GET",
    headers: { "X-RTD-Hosting-Integrations-Version": CLIENT_VERSION },
  })
    .then((response) => {
      if (!response.ok) {
        console.debug("Error parsing configuration data");
        return undefined;
      }
      return response.json();
    })
    .then((data) => {
      // We force the user to define the `<meta>` tag to be able to use Read the Docs data directly.
      // This is to keep forward/backward compatibility without breaking integrations.
      const metadataAPIVersion = _getMetadataAPIVersion();
      if (metadataAPIVersion !== undefined) {
        if (metadataAPIVersion !== data.api_version) {
          // When the API scheme version returned doesn't match the one defined via `<meta>` tag by the user,
          // we perform another request to get the Read the Docs response in the structure
          // that's supported by the user and dispatch a custom event letting them know
          // this data is ready to be consumed under `event.detail`.
          fetch(url, {
            method: "GET",
            headers: {
              "X-RTD-Hosting-Integrations-Version": CLIENT_VERSION,
              "X-RTD-Hosting-Integrations-API-Version": metadataAPIVersion,
            },
          })
            .then((response) => {
              if (!response.ok) {
                console.debug("Error parsing configuration data");
                return undefined;
              }
              return response.json();
            })
            .then((data) => {
              const readthedocsDataReady = new CustomEvent(
                "readthedocsdataready",
                { detail: data }
              );
              document.dispatchEvent(readthedocsDataReady);
              return undefined;
            });
        } else {
          const readthedocsDataReady = new CustomEvent("readthedocsdataready", {
            detail: data,
          });
          document.dispatchEvent(readthedocsDataReady);
        }
      }

      return data;
    });
}
