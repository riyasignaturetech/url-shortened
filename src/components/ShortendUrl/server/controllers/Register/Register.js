const User = require("../../models/User");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(409).json({ message: "Username or email already taken" });

    const user = await User.create({ username, email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { register };
