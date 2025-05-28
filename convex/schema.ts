import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    userId: v.string(),
  }).index("byUserId", ["userId"]),
  files: defineTable({
    name: v.string(),
    userId: v.string(),
    imageUrl: v.string(),
    title: v.string(),
    description: v.string(),
  }).index("byUserId", ["userId"]),
});
