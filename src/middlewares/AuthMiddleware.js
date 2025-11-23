import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(200).json({
        message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
        status: "error",
        data: null,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log(error);
    
    return res.status(200).json({
      message: error.message,
      status: "error",
      data: null,
    });
  }
};
