import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { users, creators, follows } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// GET user profile
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const creatorProfile = await db
      .select()
      .from(creators)
      .where(eq(creators.userId, userId))
      .limit(1);

    res.json({
      data: {
        ...user[0],
        creator: creatorProfile[0] || null,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch user profile");
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// GET user followers
router.get("/:userId/followers", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        username: users.username,
        avatar: users.avatar,
        verified: users.verified,
        bio: users.bio,
        followersCount: users.followersCount,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId))
      .limit(limit)
      .offset(offset);

    res.json({ data: result, count: result.length });
  } catch (error) {
    logger.error({ error }, "Failed to fetch followers");
    res.status(500).json({ error: "Failed to fetch followers" });
  }
});

// GET user following
router.get("/:userId/following", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        username: users.username,
        avatar: users.avatar,
        verified: users.verified,
        bio: users.bio,
        followersCount: users.followersCount,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId))
      .limit(limit)
      .offset(offset);

    res.json({ data: result, count: result.length });
  } catch (error) {
    logger.error({ error }, "Failed to fetch following");
    res.status(500).json({ error: "Failed to fetch following" });
  }
});

// POST follow user
router.post("/:userId/follow/:targetUserId", async (req: Request, res: Response) => {
  try {
    const { userId, targetUserId } = req.params;

    if (userId === targetUserId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    // Check if already following
    const existing = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, userId), eq(follows.followingId, targetUserId)))
      .limit(1);

    if (existing.length) {
      return res.status(400).json({ error: "Already following this user" });
    }

    await db.insert(follows).values({
      followerId: userId,
      followingId: targetUserId,
    });

    // Update follower counts
    const followerCount = await db
      .select()
      .from(follows)
      .where(eq(follows.followingId, targetUserId));

    const followingCount = await db
      .select()
      .from(follows)
      .where(eq(follows.followerId, userId));

    await db
      .update(users)
      .set({ followersCount: followerCount.length })
      .where(eq(users.id, targetUserId));

    await db
      .update(users)
      .set({ followingCount: followingCount.length })
      .where(eq(users.id, userId));

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error({ error }, "Failed to follow user");
    res.status(500).json({ error: "Failed to follow user" });
  }
});

// DELETE unfollow user
router.delete("/:userId/follow/:targetUserId", async (req: Request, res: Response) => {
  try {
    const { userId, targetUserId } = req.params;

    await db
      .delete(follows)
      .where(and(eq(follows.followerId, userId), eq(follows.followingId, targetUserId)));

    // Update follower counts
    const followerCount = await db
      .select()
      .from(follows)
      .where(eq(follows.followingId, targetUserId));

    const followingCount = await db
      .select()
      .from(follows)
      .where(eq(follows.followerId, userId));

    await db
      .update(users)
      .set({ followersCount: followerCount.length })
      .where(eq(users.id, targetUserId));

    await db
      .update(users)
      .set({ followingCount: followingCount.length })
      .where(eq(users.id, userId));

    res.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Failed to unfollow user");
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

// PUT update user profile
router.put("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { fullName, username, bio, avatar, bannerUrl, country, sparklesBalance } = req.body;

    const updated = await db
      .update(users)
      .set({
        ...(fullName && { fullName }),
        ...(username && { username }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
        ...(bannerUrl && { bannerUrl }),
        ...(country && { country }),
        ...(sparklesBalance && { sparklesBalance }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: updated[0] });
  } catch (error) {
    logger.error({ error }, "Failed to update user profile");
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

export default router;
