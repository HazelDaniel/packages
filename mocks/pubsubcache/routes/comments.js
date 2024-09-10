import express from "express";
const commentsRouter = express.Router();
import { delay, DELAY_INTERVAL, comments } from "../data.js";

import { GlobalRouteCache } from "pubsubcache";

// GET /users/:user_id/news/:news_id/comments
commentsRouter.get(
  "/:user_id/news/:news_id/comments",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    const { news_id } = req.params;
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }
    const newsComments = Object.entries(comments)
      .filter(([id, comment]) => comment.news_id === news_id)
      .map(([id, comment]) => ({ id, ...comment }));
    if (newsComments.length > 0) {
      await delay(DELAY_INTERVAL);
      res.json(newsComments);
    } else {
      res.status(404).send({ message: "No comments found." });
    }
  }
);

// GET /users/:user_id/news/:news_id/comments/:comment_id
commentsRouter.get(
  "/:user_id/news/:news_id/comments/:comment_id",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    const { comment_id, news_id } = req.params;
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }
    const comment = comments[comment_id];
    if (comment && comment.news_id === news_id) {
      await delay(DELAY_INTERVAL);
      res.json({ id: comment_id, ...comment });
    } else {
      res.status(404).send({ message: "Comment not found." });
    }
  }
);

// POST /users/:user_id/news/:news_id/comments
commentsRouter.post(
  "/:user_id/news/:news_id/comments",
  GlobalRouteCache.createCachePublisher({
    cascade: ["/users/:user_id/news/:news_id"],
  }),
  (req, res) => {
    const { news_id } = req.params;
    const { content } = req.body;
    const newCommentId = String(Object.keys(comments).length + 1);
    comments[newCommentId] = { news_id, content };
    res.status(201).json({ id: newCommentId, ...comments[newCommentId] });
  }
);

// PUT /users/:user_id/news/:news_id/comments/:comment_id
commentsRouter.put(
  "/:user_id/news/:news_id/comments/:comment_id",
  GlobalRouteCache.createCachePublisher({
    cascade: ["/users/:user_id/news/:news_id"],
  }),
  (req, res) => {
    const { comment_id, news_id } = req.params;
    const { content } = req.body;
    const comment = comments[comment_id];
    if (comment && comment.news_id === news_id) {
      comments[comment_id].content = content;
      res.send({ message: `Updated comment with ID: ${comment_id}` });
    } else {
      res.status(404).send({
        message: "Comment not found or doesn't belong to the specified news.",
      });
    }
  }
);

// DELETE /users/:user_id/news/:news_id/comments/:comment_id
commentsRouter.delete(
  "/:user_id/news/:news_id/comments/:comment_id",
  GlobalRouteCache.createCachePublisher({
    cascade: ["/users/:user_id/news/:news_id"],
  }),
  (req, res) => {
    const { comment_id, news_id } = req.params;
    const comment = comments[comment_id];
    if (comment && comment.news_id === news_id) {
      delete comments[comment_id];
      res.send({ message: `Deleted comment with ID: ${comment_id}` });
    } else {
      res.status(404).send({
        message: "Comment not found or doesn't belong to the specified news.",
      });
    }
  }
);

export { commentsRouter };
