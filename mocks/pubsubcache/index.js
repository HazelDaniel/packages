import express from "express";
import { GlobalRouteCache, RoutePubsubCache } from "pubsubcache";

const app = express();
const PORT = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// CONFIGURATION
GlobalRouteCache.configureGlobalCacheDeserializer((res) => JSON.parse(res));
GlobalRouteCache.configureGlobalCacheSerializer((res) => JSON.stringify(res));

const DELAY_INTERVAL = 5;

let users = {
  1: {
    user_id: "1",
    name: "Alice",
    news: [
      {
        news_id: "101",
        title: "Alice's News",
        content: "This is some news content.",
      },
    ],
  },
  2: {
    user_id: "2",
    name: "Bob",
    news: [
      {
        news_id: "102",
        title: "Bob's News",
        content: "This is Bob's news content.",
      },
    ],
  },
  3: {
    user_id: "3",
    name: "Claire",
    news: [
      {
        news_id: "103",
        title: "Claire's News",
        content: "This is Claire's news content.",
      },
    ],
  },
};

let comments = {
  1: {
    news_id: "101",
    content: "a comment on some news content",
  },
  2: {
    news_id: "102",
    content: "a comment on Bob's news content.",
  },
  3: {
    news_id: "103",
    content: "a comment on Claire's news content.",
  },
  4: {
    news_id: "103",
    content: "another comment on Claire's news content.",
  },
  5: {
    news_id: "101",
    content: "another comment on some news content.",
  },
};

// Helper function to simulate response delays
const delay = (seconds) => {
  return new Promise((resolve, _2) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
};

/**
 * GET /users/:user_id
 * Fetch details for a specific user by user_id
 */
app.get(
  "/users/:user_id",
  GlobalRouteCache.createCacheSubscriber({ catchAll: false }),
  async (req, res) => {
    const { user_id } = req.params;
    let user;
    // cache hit
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }

    // cache miss
    user = users[user_id];
    if (user) {
      await delay(DELAY_INTERVAL);
      res.json(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }
);

/**
 * GET /users
 * Fetch list of all users
 */
app.get(
  "/users",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    let allUsers;
    //cache hit
    if (res.locals.cachedResponse)
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);

    //cache miss
    allUsers = Object.values(users);
    await delay(DELAY_INTERVAL);
    res.json(allUsers);
  }
);

/**
 * GET /users/:user_id/news
 * Fetch news for a specific user
 */
app.get(
  "/users/:user_id/news",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    const { user_id } = req.params;
    let user;
    //cache hit
    if (res.locals.cachedResponse)
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);

    //cache miss
    user = users[user_id];
    if (user && user.news) {
      await delay(DELAY_INTERVAL);
      res.json(user.news);
    } else {
      res.status(404).send({ error: "User or news not found" });
    }
  }
);

/**
 * GET /users/:user_id/news/:news_id
 * Fetch specific news for a specific user
 */
app.get(
  "/users/:user_id/news/:news_id",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    const { user_id, news_id } = req.params;
    const user = users[user_id];

    if (user && user.news) {
      let newsItem;
      // cache hit
      if (res.locals.cachedResponse)
        return res
          .status(res.locals.cachedResponse.statusCode)
          .set(res.locals.cachedResponse.headers)
          .send(res.locals.cachedResponse.body);

      // cache miss
      newsItem = user.news.find((news) => news.news_id === news_id);
      if (newsItem) {
        await delay(DELAY_INTERVAL);
        res.json(newsItem);
      } else {
        res.status(404).send({ error: "News item not found" });
      }
    } else {
      res.status(404).send({ error: "User or news not found" });
    }
  }
);

/**
 * DELETE /users/:user_id/news/:news_id
 * Delete specific news for a specific user
 */
app.delete(
  "/users/:user_id/news/:news_id",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users/:user_id/news"] }),
  (req, res) => {
    const { user_id, news_id } = req.params;
    const user = users[user_id];

    if (user && user.news) {
      user.news = user.news.filter((news) => news.news_id !== news_id);
      res.send({
        message: `Deleted news with ID: ${news_id} for user with ID: ${user_id}`,
      });
    } else {
      res.status(404).send({ error: "User or news not found" });
    }
  }
);

/**
 * PUT /users/:user_id/news/:news_id
 * Update specific news for a specific user
 */
app.put(
  "/users/:user_id/news/:news_id",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users/:user_id/news"] }),
  (req, res) => {
    const { user_id, news_id } = req.params;
    const updatedNews = req.body;
    const user = users[user_id];

    if (user && user.news) {
      let newsItem = user.news.find((news) => news.news_id === news_id);
      if (newsItem) {
        newsItem = { ...newsItem, ...updatedNews }; // Update the news item
        res.send({
          message: `Updated news with ID: ${news_id} for user with ID: ${user_id}`,
          // newsItem,
        });
      } else {
        res.status(404).send({ error: "News item not found" });
      }
    } else {
      res.status(404).send({ error: "User or news not found" });
    }
  }
);

/**
 * PUT /users/:user_id
 * Update user details
 */
app.put(
  "/users/:user_id",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users"] }),
  (req, res) => {
    const { user_id } = req.params;
    const updatedUser = req.body;
    let user;
    user = users[user_id];
    if (user) {
      users[user_id] = { ...user, ...updatedUser };
      res.send({
        message: `Updated user with ID: ${user_id}`,
        // user: users[user_id],
      });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  }
);

/**
 * DELETE /users/:user_id
 * Delete a user
 */
app.delete(
  "/users/:user_id",
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

/**
 * POST /users
 * Create a new user
 */
app.post("/users", GlobalRouteCache.createCachePublisher(), (req, res) => {
  const newUser = req.body;
  const newUserId = String(Object.keys(users).length + 1); // Simple ID generation

  users[newUserId] = { user_id: newUserId, ...newUser, news: [] }; // Create a new user
  res.send({
    message: `Created new user with ID: ${newUserId}`,
    // user: users[newUserId],
  });
});

/**
 * POST /users/:user_id/news
 * Create a new user
 */
app.post(
  "/users/:user_id/news",
  GlobalRouteCache.createCachePublisher({ cascade: ["/users/:user_id"] }),
  (req, res) => {
    let newNews = req.body;
    const { user_id } = req.params;
    const equivUser = users[user_id];
    if (!equivUser) {
      return res.status(404).send({ message: "ERROR: user not found" });
    }
    const newNewsID = String(equivUser.news.length); // Simple ID generation
    newNews = { ...req.body, news_id: newNewsID };
    if (newNewsID === 0) {
      equivUser.news = [];
    }
    equivUser.news.push(newNews);
    // users[newUserId] = { user_id: newUserId, ...newUser, news: [] }; // Create a new user
    res.send({
      message: `Created new user news with ID: ${newNewsID}`,
      // user: users[newUserId],
    });
  }
);

// GET /users/:user_id/news/:news_id/comments
// Fetch all comments for specific news
app.get(
  "/users/:user_id/news/:news_id/comments",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    const { news_id } = req.params;
    console.log(`request full route is: ${req.baseUrl}${req.url} `);
    console.log(
      `request full route pattern is: ${req.baseUrl}${req.route.path} `
    );

    // cache hit
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }

    // cache miss
    const newsComments = Object.entries(comments)
      .filter(([id, comment]) => comment.news_id === news_id)
      .map(([id, comment]) => ({ id, ...comment }));

    if (newsComments.length > 0) {
      await delay(DELAY_INTERVAL);
      res.json(newsComments);
    } else {
      res.status(404).send({ message: "No comments found for this news." });
    }
  }
);

// GET /users/:user_id/news/:news_id/comments/:comment_id
// Fetch a specific comment for a specific news
app.get(
  "/users/:user_id/news/:news_id/comments/:comment_id",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res) => {
    const { comment_id, news_id } = req.params;

    // cache hit
    if (res.locals.cachedResponse) {
      return res
        .status(res.locals.cachedResponse.statusCode)
        .set(res.locals.cachedResponse.headers)
        .send(res.locals.cachedResponse.body);
    }

    // cache miss
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
// Create a new comment for specific news
app.post(
  "/users/:user_id/news/:news_id/comments",
  GlobalRouteCache.createCachePublisher({
    cascade: ["/users/:user_id/news/:news_id"],
  }),
  (req, res) => {
    const { news_id } = req.params;
    const { content } = req.body;

    // cache miss
    const newCommentId = Object.keys(comments).length + 1;
    comments[newCommentId] = {
      news_id: news_id,
      content: content,
    };

    res.status(201).json({ id: newCommentId, ...comments[newCommentId] });
  }
);

// PUT /users/:user_id/news/:news_id/comments/:comment_id
// Update a specific comment for a specific news
app.put(
  "/users/:user_id/news/:news_id/comments/:comment_id",
  GlobalRouteCache.createCachePublisher({
    cascade: ["/users/:user_id/news/:news_id"],
  }),
  async (req, res) => {
    const { comment_id, news_id } = req.params;
    const { content } = req.body;

    const comment = comments[comment_id];

    if (comment && comment.news_id === news_id) {
      comments[comment_id].content = content;
      return res.json({ id: comment_id, ...comments[comment_id] });
    } else {
      res.status(404).send({
        message: "Comment not found or does not belong to this news.",
      });
    }
  }
);

// DELETE /users/:user_id/news/:news_id/comments/:comment_id
// Delete a specific comment for a specific news
app.delete(
  "/users/:user_id/news/:news_id/comments/:comment_id",
  GlobalRouteCache.createCachePublisher({
    cascade: ["/users/:user_id/news/:news_id"],
  }),
  async (req, res) => {
    const { comment_id, news_id } = req.params;

    const comment = comments[comment_id];

    if (comment && comment.news_id === news_id) {
      delete comments[comment_id];
      return res.json({ message: "Comment deleted successfully." });
    } else {
      res.status(404).send({
        message: "Comment not found or does not belong to this news.",
      });
    }
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
