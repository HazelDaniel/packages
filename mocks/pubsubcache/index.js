import express from "express";
import {GlobalRouteCache} from "express-pubsubcache";
import { usersRouter } from "./routes/users.js";
import { commentsRouter } from "./routes/comments.js";
import { newsRouter } from "./routes/news.js";

const app = express();
const PORT = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());
app.use("/users", usersRouter);
app.use("/users", newsRouter);
app.use("/users", commentsRouter);

// CONFIGURATION
GlobalRouteCache.configureGlobalCacheDeserializer((res) => JSON.parse(res));
GlobalRouteCache.configureGlobalCacheSerializer((res) => JSON.stringify(res));


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
