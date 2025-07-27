// app/api/clerk-webhook/route.ts
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";


export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    // 处理用户创建
    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        username,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      await fetchMutation(api.users.createUser, {
        clerkUserId: id,
        email: email_addresses[0].email_address, // 取主邮箱
        username: username || undefined,
        name:
          first_name && last_name ? `${first_name} ${last_name}` : undefined,
        profileImageUrl: image_url || undefined,
        role: "personal", // 默认角色
        organizationIds: [], // 初始为空，后续通过 organizationMembership 事件更新
      });

      console.log("User created in Convex", id);

      return new Response("User created in Convex", { status: 200 });
    }

    // 处理用户更新
    if (eventType === "user.updated") {
      const {
        id,
        email_addresses,
        username,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      await fetchMutation(api.users.updateUser, {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        username: username || undefined,
        name:
          first_name && last_name ? `${first_name} ${last_name}` : undefined,
        profileImageUrl: image_url || undefined,
      });

      return new Response("User updated in Convex", { status: 200 });
    }

    // 处理组织创建
    if (eventType === "organization.created") {
      const { id, name, image_url, created_by } = evt.data;

      await fetchMutation(api.organizations.createOrganization, {
        clerkOrganizationId: id,
        name: name,
        createdBy: created_by!, // Clerk 的用户ID
        logoUrl: image_url || undefined,
      });

      return new Response("Organization created", { status: 200 });
    }

    // 处理用户加入组织
    if (eventType === "organizationMembership.created") {
      const { public_user_data: { user_id }, organization: {id:organization_id} } = evt.data;
      // console.log(`userId: ${user_id}, organizationId: ${organization_id}`);
      

      await fetchMutation(api.users.addToOrganization, {
        clerkUserId: user_id,
        clerkOrganizationId: organization_id,
      });

      return new Response("Membership added", { status: 200 });
    }

    // // 处理用户离开组织
    // if (eventType === "organizationMembership.deleted") {
    //   const { user_id, organization_id } = evt.data;

    //   await fetchMutation(api.users.removeFromOrganization, {
    //     clerkUserId: user_id,
    //     clerkOrganizationId: organization_id,
    //   });

    //   return new Response("Membership removed", { status: 200 });
    // }

    return new Response("Event ignored", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Error", { status: 400 });
  }


  
}
