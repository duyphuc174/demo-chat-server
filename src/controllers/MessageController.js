import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const user = req.user;
    const { conversationId, content } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(200).json({
        message: "Nhóm không tồn tại",
        status: "error",
        data: null,
      });
    }

    const message = await Message.create({
      conversationId,
      sender: user._id,
      content,
      attachments: [],
    });

    if (!message) {
      return res.status(200).json({
        message: "Không thể gửi tin nhắn",
        status: "error",
        data: null,
      });
    }

    conversation.lastMessage = message._id;
    conversation.unreadCount += 1;
    await conversation.save();

    return res.status(200).json({
      message: null,
      status: "success",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      data: null,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.query;

    const messages = await Message.find({ conversationId }).populate({
      path: "sender",
      select: "-password",
    }).sort({ createdAt: -1 });

    if (!messages || messages.length <= 0) {
      return res.status(200).json({
        message: null,
        status: "success",
        data: [],
      });
    }

    return res.status(200).json({
      message: null,
      status: "success",
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      data: null,
    });
  }
};
