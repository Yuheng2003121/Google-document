"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
export async function getUsers() {
  const {sessionClaims} = await auth()
  const clerk = await clerkClient();
  const { id: userOrganizationId } = (sessionClaims as { o: { id: string } }).o;
  const response = await clerk.users.getUserList({
    organizationId: [userOrganizationId],
  });

  const users = response.data.map(user => {
    return {
      id: user.id,
      name: user.fullName || user.primaryEmailAddress?.emailAddress || user.username || "Anonymous",
      avatar: user.imageUrl,
    };
  })

  return users;
}

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getDocumentsByIds, {ids})
}