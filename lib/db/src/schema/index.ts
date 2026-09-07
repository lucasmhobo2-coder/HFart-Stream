import {
  pgTable,
  text,
  serial,
  varchar,
  boolean,
  integer,
  decimal,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    password: text("password"), // Null for OAuth users
    avatar: text("avatar").default(
      "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
    ),
    bio: text("bio"),
    bannerUrl: text("banner_url"),
    country: varchar("country", { length: 100 }),
    dateOfBirth: timestamp("date_of_birth"),
    isCreator: boolean("is_creator").default(false),
    verified: boolean("verified").default(false),
    sparklesBalance: decimal("sparkles_balance", { precision: 12, scale: 2 }).default("0"),
    agreedToTerms: boolean("agreed_to_terms").default(false),
    agreedToGuidelines: boolean("agreed_to_guidelines").default(false),
    followersCount: integer("followers_count").default(0),
    followingCount: integer("following_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    usernameIdx: index("users_username_idx").on(table.username),
    creatorIdx: index("users_is_creator_idx").on(table.isCreator),
  })
);

// Follow relationships
export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
  })
);

// ============================================================================
// CREATORS & ANALYTICS
// ============================================================================

export const creators = pgTable(
  "creators",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    isLive: boolean("is_live").default(false),
    totalViews: integer("total_views").default(0),
    totalLikes: integer("total_likes").default(0),
    totalWatchTimeHours: integer("total_watch_time_hours").default(0),
    subscriberCount: integer("subscriber_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("creators_user_id_idx").on(table.userId),
    isLiveIdx: index("creators_is_live_idx").on(table.isLive),
  })
);

export const creatorAnalytics = pgTable(
  "creator_analytics",
  {
    id: serial("id").primaryKey(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => creators.id, { onDelete: "cascade" }),
    date: timestamp("date").defaultNow(),
    dailyViews: integer("daily_views").default(0),
    peakConcurrentViewers: integer("peak_concurrent_viewers").default(0),
    avgWatchTimeMinutes: decimal("avg_watch_time_minutes", { precision: 5, scale: 2 }).default("0"),
    adRevenueHV100: decimal("ad_revenue_hv100", { precision: 10, scale: 2 }).default("0"),
    subscriberRevenue: decimal("subscriber_revenue", { precision: 10, scale: 2 }).default("0"),
    followerGrowth: integer("follower_growth").default(0),
    sharesCount: integer("shares_count").default(0),
    chatMessagesCount: integer("chat_messages_count").default(0),
  },
  (table) => ({
    creatorIdIdx: index("creator_analytics_creator_id_idx").on(table.creatorId),
    dateIdx: index("creator_analytics_date_idx").on(table.date),
  })
);

// ============================================================================
// STREAMS & LIVE CONTENT
// ============================================================================

export const streams = pgTable(
  "streams",
  {
    id: text("id").primaryKey(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => creators.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 50 }).default("Entertainment"),
    thumbnail: text("thumbnail"),
    streamUrl: text("stream_url"), // HLS/RTMP URL
    viewerCount: integer("viewer_count").default(0),
    likesCount: integer("likes_count").default(0),
    startedAt: timestamp("started_at").defaultNow(),
    endedAt: timestamp("ended_at"),
    isLive: boolean("is_live").default(true),
    tags: jsonb("tags").$type<string[]>().default("[]"),
    visibility: varchar("visibility", { length: 20 }).default("Public"), // Public, Followers, Subscribers
    allowClips: boolean("allow_clips").default(true),
    enableChat: boolean("enable_chat").default(true),
    recordStream: boolean("record_stream").default(true),
    recordingUrl: text("recording_url"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    creatorIdIdx: index("streams_creator_id_idx").on(table.creatorId),
    isLiveIdx: index("streams_is_live_idx").on(table.isLive),
    createdAtIdx: index("streams_created_at_idx").on(table.createdAt),
  })
);

export const clips = pgTable(
  "clips",
  {
    id: text("id").primaryKey(),
    streamId: text("stream_id")
      .notNull()
      .references(() => streams.id, { onDelete: "cascade" }),
    creatorId: text("creator_id")
      .notNull()
      .references(() => creators.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 300 }).notNull(),
    thumbnail: text("thumbnail"),
    clipUrl: text("clip_url").notNull(),
    duration: varchar("duration", { length: 20 }),
    views: integer("views").default(0),
    likes: integer("likes").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    streamIdIdx: index("clips_stream_id_idx").on(table.streamId),
    creatorIdIdx: index("clips_creator_id_idx").on(table.creatorId),
  })
);

export const recordings = pgTable(
  "recordings",
  {
    id: text("id").primaryKey(),
    streamId: text("stream_id")
      .notNull()
      .references(() => streams.id, { onDelete: "cascade" }),
    creatorId: text("creator_id")
      .notNull()
      .references(() => creators.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 300 }).notNull(),
    category: varchar("category", { length: 50 }),
    thumbnail: text("thumbnail"),
    recordingUrl: text("recording_url").notNull(),
    duration: varchar("duration", { length: 20 }),
    views: integer("views").default(0),
    likes: integer("likes").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    streamIdIdx: index("recordings_stream_id_idx").on(table.streamId),
    creatorIdIdx: index("recordings_creator_id_idx").on(table.creatorId),
  })
);

// ============================================================================
// CHAT & MESSAGING
// ============================================================================

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: text("id").primaryKey(),
    streamId: text("stream_id")
      .notNull()
      .references(() => streams.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    isBadge: varchar("badge", { length: 50 }), // SUB 12MO, MOD, VIP, etc.
    isGift: boolean("is_gift").default(false),
    giftType: varchar("gift_type", { length: 100 }),
    giftAmount: integer("gift_amount"),
    isMuted: boolean("is_muted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    streamIdIdx: index("chat_messages_stream_id_idx").on(table.streamId),
    senderIdIdx: index("chat_messages_sender_id_idx").on(table.senderId),
    createdAtIdx: index("chat_messages_created_at_idx").on(table.createdAt),
  })
);

export const directMessages = pgTable(
  "direct_messages",
  {
    id: text("id").primaryKey(),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: text("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    read: boolean("read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    senderIdIdx: index("direct_messages_sender_id_idx").on(table.senderId),
    recipientIdIdx: index("direct_messages_recipient_id_idx").on(table.recipientId),
    createdAtIdx: index("direct_messages_created_at_idx").on(table.createdAt),
  })
);

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(), // live, follower, reply, message, subscription, announcement
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    read: boolean("read").default(false),
    avatar: text("avatar"),
    linkAction: text("link_action"), // Navigation path or external URL
    sourceUserId: text("source_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    typeIdx: index("notifications_type_idx").on(table.type),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
  })
);

// ============================================================================
// COMMUNITY & ENGAGEMENT
// ============================================================================

export const communityPosts = pgTable(
  "community_posts",
  {
    id: text("id").primaryKey(),
    creatorId: text("creator_id")
      .notNull()
      .references(() => creators.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    image: text("image"),
    likes: integer("likes").default(0),
    commentsCount: integer("comments_count").default(0),
    sharesCount: integer("shares_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    creatorIdIdx: index("community_posts_creator_id_idx").on(table.creatorId),
    createdAtIdx: index("community_posts_created_at_idx").on(table.createdAt),
  })
);

export const communityPostLikes = pgTable(
  "community_post_likes",
  {
    postId: text("post_id")
      .notNull()
      .references(() => communityPosts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.userId] }),
  })
);

// ============================================================================
// MONETIZATION & GIFTS
// ============================================================================

export const virtualGifts = pgTable(
  "virtual_gifts",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    icon: text("icon").notNull(),
    costSparkles: integer("cost_sparkles").notNull(),
    color: varchar("color", { length: 20 }).default("#FF6B6B"),
  },
  (table) => ({
    costSparklesIdx: index("virtual_gifts_cost_sparkles_idx").on(table.costSparkles),
  })
);

export const giftTransactions = pgTable(
  "gift_transactions",
  {
    id: text("id").primaryKey(),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    streamId: text("stream_id")
      .notNull()
      .references(() => streams.id, { onDelete: "cascade" }),
    giftId: text("gift_id")
      .notNull()
      .references(() => virtualGifts.id, { onDelete: "restrict" }),
    quantity: integer("quantity").default(1),
    totalSparkles: integer("total_sparkles").notNull(),
    message: text("message"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    senderIdIdx: index("gift_transactions_sender_id_idx").on(table.senderId),
    streamIdIdx: index("gift_transactions_stream_id_idx").on(table.streamId),
    giftIdIdx: index("gift_transactions_gift_id_idx").on(table.giftId),
  })
);

// ============================================================================
// ADS & MONETIZATION
// ============================================================================

export const adCampaigns = pgTable(
  "ad_campaigns",
  {
    id: text("id").primaryKey(),
    advertiserName: varchar("advertiser_name", { length: 255 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    videoUrl: text("video_url"),
    bannerImage: text("banner_image"),
    durationSeconds: integer("duration_seconds").notNull(),
    cpm: decimal("cpm", { precision: 8, scale: 2 }).notNull(), // Cost per 1000 impressions
    budget: decimal("budget", { precision: 12, scale: 2 }).notNull(),
    spent: decimal("spent", { precision: 12, scale: 2 }).default("0"),
    impressions: integer("impressions").default(0),
    clicks: integer("clicks").default(0),
    status: varchar("status", { length: 20 }).default("Active"), // Active, Paused, Scheduled, Ended
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    statusIdx: index("ad_campaigns_status_idx").on(table.status),
    startDateIdx: index("ad_campaigns_start_date_idx").on(table.startDate),
  })
);

// ============================================================================
// SUBSCRIPTIONS
// ============================================================================

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    subscriberId: text("subscriber_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    creatorId: text("creator_id")
      .notNull()
      .references(() => creators.id, { onDelete: "cascade" }),
    tier: varchar("tier", { length: 20 }).default("Basic"), // Basic, Premium, VIP
    monthlyPrice: decimal("monthly_price", { precision: 8, scale: 2 }).notNull(),
    isActive: boolean("is_active").default(true),
    renewalDate: timestamp("renewal_date"),
    createdAt: timestamp("created_at").defaultNow(),
    cancelledAt: timestamp("cancelled_at"),
  },
  (table) => ({
    subscriberIdIdx: index("subscriptions_subscriber_id_idx").on(table.subscriberId),
    creatorIdIdx: index("subscriptions_creator_id_idx").on(table.creatorId),
    isActiveIdx: index("subscriptions_is_active_idx").on(table.isActive),
  })
);

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  creatorProfile: one(creators, { fields: [users.id], references: [creators.userId] }),
  follows: many(follows, { relationName: "follower" }),
  following: many(follows, { relationName: "following" }),
  sentMessages: many(directMessages, { relationName: "sender" }),
  receivedMessages: many(directMessages, { relationName: "recipient" }),
  notifications: many(notifications),
  chatMessages: many(chatMessages),
}));

export const creatorsRelations = relations(creators, ({ one, many }) => ({
  user: one(users, { fields: [creators.userId], references: [users.id] }),
  streams: many(streams),
  clips: many(clips),
  recordings: many(recordings),
  analytics: many(creatorAnalytics),
  posts: many(communityPosts),
  subscriptions: many(subscriptions),
}));

export const streamsRelations = relations(streams, ({ one, many }) => ({
  creator: one(creators, { fields: [streams.creatorId], references: [creators.id] }),
  chatMessages: many(chatMessages),
  clips: many(clips),
  recordings: many(recordings),
  giftTransactions: many(giftTransactions),
}));

export const clipsRelations = relations(clips, ({ one }) => ({
  stream: one(streams, { fields: [clips.streamId], references: [streams.id] }),
  creator: one(creators, { fields: [clips.creatorId], references: [creators.id] }),
}));

export const recordingsRelations = relations(recordings, ({ one }) => ({
  stream: one(streams, { fields: [recordings.streamId], references: [streams.id] }),
  creator: one(creators, { fields: [recordings.creatorId], references: [creators.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  stream: one(streams, { fields: [chatMessages.streamId], references: [streams.id] }),
  sender: one(users, { fields: [chatMessages.senderId], references: [users.id] }),
}));

export const directMessagesRelations = relations(directMessages, ({ one }) => ({
  sender: one(users, {
    fields: [directMessages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  recipient: one(users, {
    fields: [directMessages.recipientId],
    references: [users.id],
    relationName: "recipient",
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  subscriber: one(users, { fields: [subscriptions.subscriberId], references: [users.id] }),
  creator: one(creators, { fields: [subscriptions.creatorId], references: [creators.id] }),
}));

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertCreatorSchema = createInsertSchema(creators).omit({ id: true, createdAt: true });
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Creator = typeof creators.$inferSelect;

export const insertStreamSchema = createInsertSchema(streams).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStream = z.infer<typeof insertStreamSchema>;
export type Stream = typeof streams.$inferSelect;

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
