import express from "express";
import GlobalRouteCache from "express-pubsubcache";
import { usersRouter } from "./routes/users.js";
import { commentsRouter } from "./routes/comments.js";
import { newsRouter } from "./routes/news.js";
import { DELAY_INTERVAL, delay } from "./data.js";

const app = express();
const PORT = 3000;

// CONFIGURATION
GlobalRouteCache.configureGlobalCacheDeserializer((res) => JSON.parse(res));
GlobalRouteCache.configureGlobalCacheSerializer((res) => JSON.stringify(res));

// Middleware for parsing JSON bodies
app.use(express.json());
app.use("/users", usersRouter);
app.use("/users", newsRouter);
app.use("/users", commentsRouter);

app.get(
  "/owners/:owner_id",
  GlobalRouteCache.createCacheSubscriber({catchAll: true}),
  async (req, res, next) => {
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }
    await delay(DELAY_INTERVAL);
    return res.json({});
  }
);

app.get(
  "*",
  GlobalRouteCache.createCacheSubscriber({ catchAll: true }),
  async (req, res, next) => {
    GlobalRouteCache.pub("*", true);
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }
    await delay(DELAY_INTERVAL);
    res.json({});
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
