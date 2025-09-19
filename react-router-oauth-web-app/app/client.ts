import { NodeOAuthClient } from "@atproto/oauth-client-node";
import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node"
import { URLSearchParams } from "node:url";

const stateStore = new Map()
const sessionStore = new Map()

export class StateStore implements NodeSavedStateStore {
  constructor(private db: Map<string, string>) { }
  async get(key: string): Promise<NodeSavedState | undefined> {
    const result = this.db.get(key)

    if (!result) return;
    return JSON.parse(result);
  }
  async set(key: string, value: NodeSavedState) {
    const state = JSON.stringify(value);

    if (this.db.has(key)) {
      this.db.set(key, state)
    }

  }
  async del(key: string) {
    this.db.delete(key)
  }
}

export class SessionStore implements NodeSavedSessionStore {
  constructor(private db: Map<string, string>) { }
  async get(key: string): Promise<NodeSavedSession | undefined> {
    const result = this.db.get(key)

    if (!result) return;
    return JSON.parse(result) as NodeSavedSession;
  }
  async set(key: string, value: NodeSavedSession) {
    const session = JSON.stringify(value);

    if (this.db.has(key)) {
      this.db.set(key, session)
    }
  }
  async del(key: string) {
    this.db.delete(key)
  }
}

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
  stateStore: new StateStore(stateStore),
  sessionStore: new SessionStore(sessionStore)
})
