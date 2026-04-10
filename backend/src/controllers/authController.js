const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { createError } = require("../utils/errorHandler");

// ─── Signup ───────────────────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, age, role, phone, email, password, emergencyContacts } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return sendError(res, 409, "An account with this email or phone already exists.");
    }

    const user = await User.create({
      name,
      age,
      role: role || "elder",
      phone,
      email,
      password,
      emergencyContacts: emergencyContacts || [],
    });

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(res, 201, "Account created successfully.", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        age: user.age,
        role: user.role,
        phone: user.phone,
        email: user.email,
        emergencyContacts: user.emergencyContacts,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, "Invalid email or password.");
    }

    if (!user.isActive) {
      return sendError(res, 403, "Your account has been deactivated.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password.");
    }

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(res, 200, "Login successful.", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        age: user.age,
        role: user.role,
        phone: user.phone,
        email: user.email,
        emergencyContacts: user.emergencyContacts,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get own profile ──────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return sendSuccess(res, 200, "Profile fetched.", user);
  } catch (err) {
    next(err);
  }
};

// ─── Update profile ───────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "age", "phone", "emergencyContacts"];
    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return sendSuccess(res, 200, "Profile updated.", user);
  } catch (err) {
    next(err);
  }
};

// ─── Change password ──────────────────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return sendError(res, 401, "Current password is incorrect.");
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return sendSuccess(res, 200, "Password changed successfully.");
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getProfile, updateProfile, changePassword };
