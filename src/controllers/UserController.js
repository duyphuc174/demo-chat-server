import User from "../models/User.js";

export const findUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const user = req.user;

    const users = await User.find({
      username: { $regex: search || "", $options: "i" },
      _id: { $ne: user.id },
    }).select("-password");

    return res.status(200).json({
      message: null,
      status: "success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
      data: null,
    });
  }
};
