import { data } from "react-router";
import type { Route } from "./+types/_index";
import { OAuthResolverError } from "@atproto/oauth-client-node";
import { client } from "~/client";
import { redirect } from "react-router";

export function meta(meta: Route.MetaArgs) {
  return [
    { title: "React Router OAuth AT Proto" },
    { name: "description", content: "Example React Router application with atprotocol oauth" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const handle = formData.get('handle') as string

    if (!handle || typeof handle !== 'string') {
      return data({
        error: 'Error: Invalid handle'
      }, { status: 400 })
    }

    const redirectURL = await client.authorize(handle, {
      signal: new AbortController().signal
    })

    throw redirect(redirectURL.toString())
  } catch (error) {
    if (error instanceof OAuthResolverError) {
      return data({ error: error.message }, { status: 400 })
    }

    throw error
  }

}

export default function Index() {
  return (
    <form method="post" action=".">
      <label htmlFor="identifier">AT Protocol Handle</label>
      <input type="text" name="identifier" id="identifier" required aria-describedby="identifierHint" />
      <span id="identifierHint">
        <p>If you're a Bluesky user, you already have an AT Protocol handle - it's what comes after the @ sign when people mention you. You can see your handle on your Bluesky profile page.</p>
        <p>You can create an AT Protocol account via Bluesky, but <a href="https://atproto.com/guides/self-hosting">other options</a> are available.</p>
        <p><button id="bsky-button">Create Account with Bluesky Social</button></p>
        <p>You may alternatively enter your DID, PDS URL, or entryway URL (eg, <code>https://pds.example.com</code>).</p>
      </span>
      <button type="submit">log in</button>
    </form>
  )
}
