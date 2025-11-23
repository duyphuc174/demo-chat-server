import Conversation from "../models/Conversation.js";
import SocketService from "../services/SocketService.js";

export const createConversation = async (req, res) => {
  try {
    const user = req.user;
    const { name, userIds } = req.body;

    if (!name) {
      return res.status(200).json({
        message: "Vui lòng nhập tên nhóm",
        status: "error",
        data: null,
      });
    }

    if (userIds.length <= 0) {
      return res.status(200).json({
        message: "Vui lòng chọn ít nhất 1 người dùng",
        status: "error",
        data: null,
      });
    }

    const conversation = await Conversation.create({
      name,
      members: [user._id, ...userIds],
      isGroup: true,
      createdBy: user._id,
    });

    SocketService.emitCoversation(conversation);

    return res.status(200).json({
      message: "Tạo nhóm thành công",
      status: "success",
      data: conversation,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      data: null,
    });
  }
};

export const createSingleConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    const conversation = await Conversation.create({
      members: [userId],
    });
  } catch (error) {}
};

export const getMyConversations = async (req, res) => {
  try {
    const { name } = req.query;

    const conversations = await Conversation.find({
      members: { $in: [req.user._id] },
      name: { $regex: name || "", $options: "i" },
    })
      .populate({
        path: "members",
        select: "-password",
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      })
      .populate({
        path: "createdBy",
        select: "-password",
      })
      .sort({ updatedAt: -1 });

    if (!conversations || conversations.length <= 0) {
      return res.status(200).json({
        message: null,
        status: "success",
        data: [],
      });
    }

    return res.status(200).json({
      message: null,
      status: "success",
      data: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      data: null,
    });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "Vui lòng nhập id nhóm",
        status: "error",
        data: null,
      });
    }

    const conversation = await Conversation.findById(id).populate({
      path: "members",
      select: "-password",
    }).populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "-password",
      }
    });

    if (!conversation) {
      return res.status(400).json({
        message: "Không tìm thấy nhóm",
        status: "error",
        data: null,
      });
    }

    return res.status(200).json({
      message: null,
      status: "success",
      data: conversation,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      data: null,
    });
  }
};
