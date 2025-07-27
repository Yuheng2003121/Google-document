import { defineSchema, defineTable, SearchFilter } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_organization", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),

  users: defineTable({
    clerkUserId: v.string(), // 对应 Clerk 的 user.id
    email: v.string(), // 对应 Clerk 的 user.email_addresses[0].email_address
    username: v.optional(v.string()), // 对应 Clerk 的 user.username
    name: v.optional(v.string()), // 对应 Clerk 的 user.first_name + last_name
    profileImageUrl: v.optional(v.string()), // 对应 Clerk 的 user.image_url
    role: v.union(v.literal("admin"), v.literal("personal")),
    organizationIds: v.array(v.string()), // 从 Clerk 的 organization_memberships 同步
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_email", ["email"]),

  organizations: defineTable({
    clerkOrganizationId: v.string(), // Clerk 的组织ID
    name: v.string(),
    createdBy: v.string(), // 创建者的 clerkUserId
    logoUrl: v.optional(v.string()),
    metadata: v.optional(v.any()), // 自定义扩展字段
  })
    .index("by_clerkId", ["clerkOrganizationId"])
    .index("by_creator", ["createdBy"]),
}); 


