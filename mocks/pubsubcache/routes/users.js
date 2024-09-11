import express from "express";
const usersRouter = express.Router();
import GlobalRouteCache from "express-pubsubcache";
import { users, DELAY_INTERVAL, delay } from "../data.js";

// GET /users/:user_id
usersRouter.get(
  "/:user_id",
  GlobalRouteCache.createCacheSubscriber({ catchAll: false }),
  async (req, res) => {
    const { user_id } = req.params;
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }
    const user = users[user_id];
    if (user) {
      await delay(DELAY_INTERVAL);
      res.json(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }
);

// GET /users
usersRouter.get(
  "/",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }
    const allUsers = Object.values(users);
    await delay(DELAY_INTERVAL);
    res.json(allUsers);
  }
);

// PUT /users/:user_id
usersRouter.put(
  "/:user_id",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users"] }),
  (req, res) => {
    const { user_id } = req.params;
    const updatedUser = req.body;
    const user = users[user_id];
    if (user) {
      users[user_id] = { ...user, ...updatedUser };
      res.send({ message: `Updated user with ID: ${user_id}` });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }
);

// DELETE /users/:user_id
usersRouter.delete(
  "/:user_id",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users"] }),
  (req, res) => {
    const { user_id } = req.params;
    if (users[user_id]) {
      delete users[user_id];
      res.send({ message: `Deleted user with ID: ${user_id}` });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }
);

// POST /users
usersRouter.post("/", GlobalRouteCache.createCachePublisher(), (req, res) => {
  const newUser = req.body;
  const newUserId = String(Object.keys(users).length + 1);
  users[newUserId] = { user_id: newUserId, ...newUser, news: [] };
  res.send({ message: `Created new user with ID: ${newUserId}` });
});

export { usersRouter };
