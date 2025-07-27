import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

//分页查询函数定义
export const getDocuments = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    //这里user的属性可以从JWT template拓展
    const user = await ctx.auth.getUserIdentity();
    // const userId = user?.subject; // 获取目前登录userId
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    let documents;

    //这里的user.organization_id是用户目前登录的组织ID(convex管理的, 而user表里organizationIds则是该用户加入的所有组织id
    const organizationId = user.organization_id || undefined; //这里的user.organization_id是需要从clerk JWT template手动拓展的:  "organization_id": "{{organization.id}}",

    //根据传来是否有search, 和目前登录用户是否加入organization 决定不同的查询
    if (args.search && organizationId) {
      documents = await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q
            .search("title", args.search!)
            .eq("organizationId", organizationId as string)
        )
        .paginate(args.paginationOpts);
    } else if (organizationId) {
      documents = await ctx.db
        .query("documents")
        // eq("ownerId", user.subject)​​：确保只返回当前用户拥有的文档（ownerId匹配用户 ID）。
        .withIndex("by_organization", (q) =>
          q.eq("organizationId", organizationId as string)
        )
        .paginate(args.paginationOpts);
    } else if (args.search) {
      //只搜索该用户的documents
      documents = await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          //​​withSearchIndex​​：使用名为 search_title的搜索索引，快速查找标题包含 args.search的文档。
          // eq("ownerId", user.subject)​​：确保只返回当前用户拥有的文档（ownerId匹配用户 ID）。
          q.search("title", args.search!).eq("ownerId", user.subject)
        )
        .paginate(args.paginationOpts);
    } else {
      //只搜索该用户的documents
      documents = await ctx.db
        .query("documents")
        // eq("ownerId", user.subject)​​：确保只返回当前用户拥有的文档（ownerId匹配用户 ID）。
        .withIndex("by_owner", (q) => q.eq("ownerId", user.subject))
        .paginate(args.paginationOpts);
    }

    return documents;
  },
});

export const addDocument = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const organizationId = (user.organization_id || undefined) as string ;

    const documenId = await ctx.db.insert("documents", {
      title: args.title ?? "Untitled",
      initialContent: args.initialContent,
      organizationId: organizationId,
      ownerId: user.subject,
    });

    return documenId;
  },
});

export const deleteDocumentById = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const document = await ctx.db.get(args.documentId);
    const isOrganizationMember =
      document?.organizationId === user.organization_id; //检查要删除的doc属于的organization是否属于该登录用户属于的organization
    const isOwner = document?.ownerId === user.subject;
  
    
    if (!document) {
      throw new ConvexError("Document not found");
    }

    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Not authorized to delete this document");
    }

    return await ctx.db.delete(args.documentId);
  },
});

export const updateDocumentById = mutation({
  args: { documentId: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

   const document = await ctx.db.get(args.documentId);
   const isOrganizationMember =
     document?.organizationId === user.organization_id; //检查要删除的doc属于的organization是否属于该登录用户属于的organization
   const isOwner = document?.ownerId === user.subject;

   if (!document) {
     throw new ConvexError("Document not found");
   }

   if (!isOwner && !isOrganizationMember) {
     throw new ConvexError("Not authorized to Update this document");
   }

    return await ctx.db.patch(args.documentId, { title: args.title });
  },
});


export const getDocumentById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError("Document not found");
    return document;
  },
})

export const getDocumentsByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, args) => {
    const documents = [];
    for(const id of args.ids) {
      const document = await ctx.db.get(id);
      if(document) {
        documents.push({id: document._id, name: document.title});
      } else {
        documents.push({id, name: "Deleted Document"})
      }
    }
    
    return documents;
  },
});