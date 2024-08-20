const express = require("express");
const connectDatabase = require("./config/db/Database");
const app = express();
const corsMiddleware = require("./middleware/cors");
const authMiddleware = require("./middleware/auth");
const commentRoutes = require("./routes/commentRoute");
const authRoutes = require("./routes/authRoute");
const postRoutes = require("./routes/postRoute");
const likeRoutes = require("./routes/likeRoute");

corsMiddleware(app);
require("dotenv").config({
  path: "config/.env",
});
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/comments", commentRoutes);
app.use("/likes", likeRoutes);

connectDatabase();

app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});
