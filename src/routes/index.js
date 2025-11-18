import AuthRouter from "./AuthRouter.js";
import UserRouter from "./UserRouter.js";
import ConversationRouter from "./ConversationRouter.js";
import MessageRouter from "./MessageRouter.js";

export default (app) => {
  app.use("/api/auth", AuthRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/conversations", ConversationRouter);
  app.use("/api/messages", MessageRouter);
};
