// convex/organizations.ts
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// 创建组织
export const createOrganization = mutation({
  args: {
    clerkOrganizationId: v.string(),
    name: v.string(),
    createdBy: v.string(),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("organizations", args);
  },
});




export const addDocument = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
    organizationId: v.optional(v.string()), // 新增可选参数
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Not authenticated");

    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled",
      initialContent: args.initialContent,
      ownerId: user.subject,
      organizationId: args.organizationId, // 关联组织
    });
  },
});


export const getUserOrganizations = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. 通过 clerkUserId 查询用户
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // 2. 返回用户的 organizationIds
    return user.organizationIds;
  },
});

