import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { chatMessages, users, streams } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// GET chat messages for a stream
router.get("/stream/:streamId", async (req: Request, res: Response) => {
  try {
    const { streamId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await db
      .select({
        id: chatMessages.id,
        message: chatMessages.message,
        isBadge: chatMessages.isBadge,
        isGift: chatMessages.isGift,
        giftType: chatMessages.giftType,
        giftAmount: chatMessages.giftAmount,
        isMuted: chatMessages.isMuted,
        createdAt: chatMessages.createdAt,
        sender: {
          id: users.id,
          fullName: users.fullName,
          username: users.username,
          avatar: users.avatar,
        },
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.senderId, users.id))
      .where(eq(chatMessages.streamId, streamId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ data: result.reverse(), count: result.length });
  } catch (error) {
    logger.error({ error }, "Failed to fetch chat messages");
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

// POST send message to stream
router.post("/stream/:streamId", async (req: Request, res: Response) => {
  try {
    const { streamId } = req.params;
    const { senderId, message, isBadge, isGift, giftType, giftAmount } = req.body;

    if (!senderId || !message) {
      return res.status(400).json({ error: "senderId and message required" });
    }

    // Verify stream exists
    const stream = await db.select().from(streams).where(eq(streams.id, streamId)).limit(1);
    if (!stream.length) {
      return res.status(404).json({ error: "Stream not found" });
    }

    const newMessage = await db
      .insert(chatMessages)
      .values({
        id: `msg-${Date.now()}`,
        streamId,
        senderId,
        message,
        isBadge: isBadge || null,
        isGift: isGift || false,
        giftType: giftType || null,
        giftAmount: giftAmount || null,
        isMuted: false,
      })
      .returning();

    res.status(201).json({ data: newMessage[0] });
  } catch (error) {
    logger.error({ error }, "Failed to send chat message");
    res.status(500).json({ error: "Failed to send chat message" });
  }
});

// PUT mute message
router.put("/:messageId/mute", async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const updated = await db
      .update(chatMessages)
      .set({ isMuted: true })
      .where(eq(chatMessages.id, messageId))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ data: updated[0] });
  } catch (error) {
    logger.error({ error }, "Failed to mute message");
    res.status(500).json({ error: "Failed to mute message" });
  }
});

// DELETE message
router.delete("/:messageId", async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const deleted = await db
      .delete(chatMessages)
      .where(eq(chatMessages.id, messageId))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Failed to delete message");
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
