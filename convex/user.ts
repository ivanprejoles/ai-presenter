import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingUser) {
      // User exists, return their ID
      return existingUser._id;
    } else {
      // Create the user and return the ID
      return await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        userId: args.userId,
      });
    }
  },
});