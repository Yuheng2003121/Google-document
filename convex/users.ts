// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 创建用户
export const createUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    name: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("personal")),
    organizationIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", args);
  },
});

// 更新用户
export const updateUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    name: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkUserId, ...rest } = args;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, rest);
  },
});


//用户加入组织
export const addToOrganization = mutation({
  args: {
    clerkUserId: v.string(), 
    clerkOrganizationId: v.string(), 
  },
  handler: async (ctx, args) => {
    // 1. 验证用户是否存在
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!user) {
      console.error(`User ${args.clerkUserId} not found in database`);
      throw new Error("User not found");
    }

   



    // 3. 检查是否已存在关联（避免重复添加）
    if (user.organizationIds.includes(args.clerkOrganizationId)) {
      console.log(
        `User ${args.clerkUserId} already in organization ${args.clerkOrganizationId}`
      );
      return;
    }

    // 4. 更新用户组织列表
    await ctx.db.patch(user._id, {
      organizationIds: [...user.organizationIds, args.clerkOrganizationId],
    });


    console.log(
      `Successfully added user ${args.clerkUserId} to org ${args.clerkOrganizationId}`
    );
  },
});


