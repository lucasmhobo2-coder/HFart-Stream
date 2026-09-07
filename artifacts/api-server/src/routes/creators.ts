import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { creators, users, creatorAnalytics, subscriptions } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// GET all creators
router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await db
      .select({
        id: creators.id,
        userId: creators.userId,
        isLive: creators.isLive,
        totalViews: creators.totalViews,
        totalLikes: creators.totalLikes,
        subscriberCount: creators.subscriberCount,
        user: {
          id: users.id,
          fullName: users.fullName,
          username: users.username,
          avatar: users.avatar,
          verified: users.verified,
          bio: users.bio,
          followersCount: users.followersCount,
          followingCount: users.followingCount,
        },
      })
      .from(creators)
      .innerJoin(users, eq(creators.userId, users.id))
      .orderBy(desc(creators.totalViews))
      .limit(limit)
      .offset(offset);

    res.json({ data: result, count: result.length });
  } catch (error) {
    logger.error({ error }, "Failed to fetch creators");
    res.status(500).json({ error: "Failed to fetch creators" });
  }
});

// GET single creator profile
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db
      .select({
        id: creators.id,
        userId: creators.userId,
        isLive: creators.isLive,
        totalViews: creators.totalViews,
        totalLikes: creators.totalLikes,
        totalWatchTimeHours: creators.totalWatchTimeHours,
        subscriberCount: creators.subscriberCount,
        user: {
          id: users.id,
          fullName: users.fullName,
          username: users.username,
          email: users.email,
          avatar: users.avatar,
          bannerUrl: users.bannerUrl,
          bio: users.bio,
          country: users.country,
          verified: users.verified,
          followersCount: users.followersCount,
          followingCount: users.followingCount,
        },
      })
      .from(creators)
      .innerJoin(users, eq(creators.userId, users.id))
      .where(eq(creators.id, id))
      .limit(1);

    if (!result.length) {
      return res.status(404).json({ error: "Creator not found" });
    }

    res.json({ data: result[0] });
  } catch (error) {
    logger.error({ error }, "Failed to fetch creator");
    res.status(500).json({ error: "Failed to fetch creator" });
  }
});

// GET creator analytics
router.get("/:id/analytics", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db
      .select()
      .from(creatorAnalytics)
      .where(eq(creatorAnalytics.creatorId, id))
      .orderBy(desc(creatorAnalytics.date))
      .limit(30); // Last 30 days

    res.json({ data: result });
  } catch (error) {
    logger.error({ error }, "Failed to fetch creator analytics");
    res.status(500).json({ error: "Failed to fetch creator analytics" });
  }
});

// GET current analytics summary
router.get("/:id/analytics/summary", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const creator = await db
      .select()
      .from(creators)
      .where(eq(creators.id, id))
      .limit(1);

    if (!creator.length) {
      return res.status(404).json({ error: "Creator not found" });
    }

    const analytics = await db
      .select()
      .from(creatorAnalytics)
      .where(eq(creatorAnalytics.creatorId, id))
      .orderBy(desc(creatorAnalytics.date))
      .limit(1);

    res.json({
      data: {
        totalViews: creator[0].totalViews,
        totalLikes: creator[0].totalLikes,
        subscriberCount: creator[0].subscriberCount,
        totalWatchTimeHours: creator[0].totalWatchTimeHours,
        ...analytics[0],
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch analytics summary");
    res.status(500).json({ error: "Failed to fetch analytics summary" });
  }
});

// GET creator subscriptions
router.get("/:id/subscriptions", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.creatorId, id))
      .orderBy(desc(subscriptions.createdAt));

    res.json({ data: result, count: result.length });
  } catch (error) {
    logger.error({ error }, "Failed to fetch subscriptions");
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

// PUT update creator status
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isLive, totalViews, totalLikes } = req.body;

    const updated = await db
      .update(creators)
      .set({
        ...(typeof isLive === "boolean" && { isLive }),
        ...(totalViews && { totalViews }),
        ...(totalLikes && { totalLikes }),
      })
      .where(eq(creators.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Creator not found" });
    }

    res.json({ data: updated[0] });
  } catch (error) {
    logger.error({ error }, "Failed to update creator");
    res.status(500).json({ error: "Failed to update creator" });
  }
});

export default router;
