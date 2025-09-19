import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { URLSearchParams } from "node:url";

function buildClientID() {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (isLocal) {
    return `http://localhost?${new URLSearchParams({ scope: "atproto repo:app.bsky.feed.post?action=create", redirect_uri: Object.assign(new URL(window.location.origin), { hostname: '127.0.0.1' }).href })}`
  }
  return `https://${window.location.host}/oauth-client-metadata.json`
}

export const client = new NodeOAuthClient({
  clientMetadata: {
    client_name: "atproto react router oauth example",
    client_uri: buildClientID(),
    redirect_uris: [`${window.location.host}/oauth/callback`],
    scope: "atproto repo:app.bsky.feed.post?action=create",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    application_type: "web",
    token_endpoint_auth_method: "none",
    dpop_bound_access_tokens: true,
  },
  stateStore: {},
  sessionStore: {}
})
