import { NodeOAuthClient } from "@atproto/oauth-client-node";
import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node"

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

const IS_DEV = process.env.NODE_ENV === "development";
const PUBLIC_URL = "https://example.com";
const LOCAL_URL = "http://[::1]:5173";
const APP_URL = IS_DEV ? LOCAL_URL : PUBLIC_URL;

export const client = new NodeOAuthClient({
  clientMetadata: {
    client_id: !IS_DEV
      ? `${PUBLIC_URL}/client-metadata.json`
      : `http://localhost?redirect_uri=${encodeURIComponent(
        `${APP_URL}/oauth/callback`,
      )}&scope=${encodeURIComponent("atproto repo:app.bsky.feed.post?action=create")}`,
    client_uri: APP_URL,
    client_name: "atproto react router oauth example",
    redirect_uris: [`${APP_URL}/oauth/callback`],
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
