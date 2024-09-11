import express from "express";
const newsRouter = express.Router();
import { GlobalRouteCache } from "express-pubsubcache";
import { users, delay, DELAY_INTERVAL } from "../data.js";

// GET /users/:user_id/news
newsRouter.get(
  "/:user_id/news",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    const { user_id } = req.params;
    const user = users[user_id];
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }
    if (user && user.news) {
      await delay(DELAY_INTERVAL);
      res.json(user.news);
    } else {
      res.status(404).send({ error: "User or news not found" });
    }
  }
);

// GET /users/:user_id/news/:news_id
newsRouter.get(
  "/:user_id/news/:news_id",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    const { user_id, news_id } = req.params;
    const user = users[user_id];
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }
    const newsItem = user.news.find((news) => news.news_id === news_id);
    if (newsItem) {
      await delay(DELAY_INTERVAL);
      res.json(newsItem);
    } else {
      res.status(404).send({ error: "News item not found" });
    }
  }
);

// DELETE /users/:user_id/news/:news_id
newsRouter.delete(
  "/:user_id/news/:news_id",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users/:user_id/news"] }),
  (req, res) => {
    const { user_id, news_id } = req.params;
    const user = users[user_id];
    if (user && user.news) {
      user.news = user.news.filter((news) => news.news_id !== news_id);
      res.send({
        message: `Deleted news with ID: ${news_id} for user ${user_id}`,
      });
    } else {
      res.status(404).send({ error: "User or news not found" });
    }
  }
);

// PUT /users/:user_id/news/:news_id
newsRouter.put(
  "/:user_id/news/:news_id",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users/:user_id/news"] }),
  (req, res) => {
    const { user_id, news_id } = req.params;
    const updatedNews = req.body;
    const user = users[user_id];
    const newsItem = user.news.find((news) => news.news_id === news_id);
    if (newsItem) {
      Object.assign(newsItem, updatedNews);
      res.send({ message: `Updated news with ID: ${news_id}` });
    } else {
      res.status(404).send({ error: "News item not found" });
    }
  }
);

// POST /users/:user_id/news
newsRouter.post(
  "/:user_id/news",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users/:user_id"] }),
  (req, res) => {
    const { user_id } = req.params;
    const user = users[user_id];
    if (!user) return res.status(404).send({ message: "User not found" });
    const newNews = { news_id: String(user.news.length), ...req.body };
    user.news.push(newNews);
    res.send({ message: `Created new news for user ${user_id}` });
  }
);

export { newsRouter };
