// convex/users.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserWithFiles = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get the user
    const user = await ctx.db
      .query("users")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) {
      return null;
    }

    // Get all files for this user
    const files = await ctx.db
      .query("files")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .collect();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: id, ...userWithoutUserId } = user;

    return {
      user: userWithoutUserId,
      files,
    };
  },
});
