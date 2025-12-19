import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;
    const { firstName, lastName, email } = req.body;

    let user = await User.findOne({ firebaseUid: firebaseUser.uid });

    if (user) {
      return res.status(200).json({ user });
    }

    user = await User.create({
      firebaseUid: firebaseUser.uid,
      email,
      firstName,
      lastName,
      role: "user",
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("❌ registerUser error:", error.message);
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const getMe = async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;

    let user = await User.findOne({
      firebaseUid: firebaseUser.uid,
    });

    // 🔥 IMPORTANT FIX
    if (!user) {
      user = await User.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: "New",
        lastName: "User",
        role: "user",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
