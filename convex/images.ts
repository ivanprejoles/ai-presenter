import { v } from "convex/values";
import { query } from "./_generated/server";

// In a Convex query function
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
