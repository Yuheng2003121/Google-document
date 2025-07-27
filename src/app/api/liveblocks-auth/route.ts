import { auth, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Liveblocks } from "@liveblocks/node";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveBlocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});
export async function POST(req: Request) {
  const { sessionClaims } = await auth();
  const user = await currentUser();
  if (!sessionClaims || !user) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 401,
    });
  }

  const { room: roomId } = await req.json(); // 从载荷解构出 room 字段

  const document = await convex.query(api.documents.getDocumentById, {
    id: roomId,
  });
  if (!document) {
    return new Response(JSON.stringify({ error: "Document not found" }), {
      status: 404,
    });
  }

  const { id: userOrganizationId } = (sessionClaims as { o: { id: string } }).o;
  const isOwner = document.ownerId === user.id;
  const isOrganizationMember = !!(
    document.organizationId && document.organizationId === userOrganizationId
  );

  if (!isOwner && !isOrganizationMember) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 401,
    });
  }

  const name =  user.fullName || user.primaryEmailAddress?.emailAddress || user.username || "Anonymous"
  const userNameColor = stringToColor(name)
  const session = liveBlocks.prepareSession(user.id, {
    userInfo: {
      name,
      avatar: user.imageUrl,
      color: userNameColor,
    },
  });

  session.allow(roomId, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}