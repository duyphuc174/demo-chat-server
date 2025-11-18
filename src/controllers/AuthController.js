import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, fullname, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập tài khoản và mật khẩu",
        status: "error",
        data: null,
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Tài khoản đã tồn tại",
        status: "error",
        data: null,
      });
    }

    const user = await User.create({
      username,
      fullname,
      password,
    });

    return res.status(200).json({
      message: "Đăng ký tài khoản thành công",
      status: "success",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, status: "error", data: null });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Sai tên tài khoản hoặc mật khẩu",
        status: "error",
        data: null,
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Sai tên tài khoản hoặc mật khẩu",
        status: "error",
        data: null,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    delete user.password;

    return res.status(200).json({
      message: "Đăng nhập thành công",
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, status: "error", data: null });
  }
};
