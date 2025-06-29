import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save(); // 👈 save instead of create

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Successful login
    res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const searchUsers = async (req, res) => {
  const keyword = req.query.q;
  const users = await User.find({
    name: { $regex: keyword, $options: 'i' },
    _id: { $ne: req.user._id }
  }).select('name email');
  res.json(users);
};
// controllers/authController.js
export const checkAuth = async (req, res) => {
 
  
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    res.status(200).json(req.user); // sends user info back
  } catch (err) {
    res.status(500).json({ message: 'Failed to check auth' });
  }
};

