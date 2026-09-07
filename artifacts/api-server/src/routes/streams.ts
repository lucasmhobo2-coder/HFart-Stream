import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { streams, creators, users } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// GET all streams (live or recent)
router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const isLive = req.query.isLive === "true";

    const query = db
      .select({
        id: streams.id,
        title: streams.title,
        description: streams.description,
        category: streams.category,
        thumbnail: streams.thumbnail,
        streamUrl: streams.streamUrl,
        viewerCount: streams.viewerCount,
        likesCount: streams.likesCount,
        startedAt: streams.startedAt,
        isLive: streams.isLive,
        tags: streams.tags,
        visibility: streams.visibility,
        allowClips: streams.allowClips,
        enableChat: streams.enableChat,
        recordStream: streams.recordStream,
        creator: {
          id: creators.id,
          userId: creators.userId,
          isLive: creators.isLive,
          totalViews: creators.totalViews,
          subscriberCount: creators.subscriberCount,
        },
      })
      .from(streams)
      .innerJoin(creators, eq(streams.creatorId, creators.id))
      .orderBy(desc(streams.startedAt))
      .limit(limit)
      .offset(offset);

    if (isLive) {
      query.where(eq(streams.isLive, true));
    }

    const result = await query;
    res.json({ data: result, count: result.length });
  } catch (error) {
    logger.error({ error }, "Failed to fetch streams");
    res.status(500).json({ error: "Failed to fetch streams" });
  }
});

// GET single stream
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await db
      .select()
      .from(streams)
      .where(eq(streams.id, id))
      .limit(1);

    if (!result.length) {
      return res.status(404).json({ error: "Stream not found" });
    }

    res.json({ data: result[0] });
  } catch (error) {
    logger.error({ error }, "Failed to fetch stream");
    res.status(500).json({ error: "Failed to fetch stream" });
  }
});

// POST create new stream
router.post("/", async (req: Request, res: Response) => {
  try {
    const { creatorId, title, description, category, thumbnail, streamUrl, tags, visibility } =
      req.body;

    if (!creatorId || !title) {
      return res.status(400).json({ error: "creatorId and title required" });
    }

    const newStream = await db
      .insert(streams)
      .values({
        id: `stream-${Date.now()}`,
        creatorId,
        title,
        description,
        category,
        thumbnail,
        streamUrl,
        tags: tags || [],
        visibility: visibility || "Public",
        isLive: true,
        viewerCount: 0,
        likesCount: 0,
        allowClips: true,
        enableChat: true,
        recordStream: true,
      })
      .returning();

    res.status(201).json({ data: newStream[0] });
  } catch (error) {
    logger.error({ error }, "Failed to create stream");
    res.status(500).json({ error: "Failed to create stream" });
  }
});

// PUT update stream
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, isLive, viewerCount, likesCount } = req.body;

    const updated = await db
      .update(streams)
      .set({
        ...(title && { title }),
        ...(description && { description }),
        ...(typeof isLive === "boolean" && { isLive }),
        ...(viewerCount && { viewerCount }),
        ...(likesCount && { likesCount }),
        updatedAt: new Date(),
      })
      .where(eq(streams.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Stream not found" });
    }

    res.json({ data: updated[0] });
  } catch (error) {
    logger.error({ error }, "Failed to update stream");
    res.status(500).json({ error: "Failed to update stream" });
  }
});

// PUT end stream
router.put("/:id/end", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await db
      .update(streams)
      .set({
        isLive: false,
        endedAt: new Date(),
      })
      .where(eq(streams.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Stream not found" });
    }

    res.json({ data: updated[0] });
  } catch (error) {
    logger.error({ error }, "Failed to end stream");
    res.status(500).json({ error: "Failed to end stream" });
  }
});

export default router;
