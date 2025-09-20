import { client } from "~/client";

export async function loader() {
  return Response.json(client.clientMetadata)
}
