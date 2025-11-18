import User from "../models/User.js";

export const findUsers = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(200).json({
        message: null,
        status: "success",
        data: [],
      });
    }

    const users = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("-password");

    return res.status(200).json({
      message: null,
      status: "success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Không tìm thấy người dùng",
      status: "error",
      data: null,
    });
  }
};
