import User from "../models/User.js";

const attachUser = async (req, res, next) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(403).json({ message: "User not registered" });
    }

    req.user = user; // includes role
    next();
  } catch (error) {
    return res.status(500).json({ message: "Failed to attach user" });
  }
};

export default attachUser;
