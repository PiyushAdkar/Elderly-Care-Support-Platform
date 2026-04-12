const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    role: {
      type: String,
      required: true,
      enum: ["elder", "caretaker"],
      default: "elder",
    },
    phone: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    emergencyContacts: {
      type: [emergencyContactSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "A user can have at most 5 emergency contacts.",
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// --- Indexes ---
userSchema.index({ role: 1 });

// --- Middleware ---
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// --- Methods ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// --- Sample Document ---
/*
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Margaret Thompson",
  "age": 78,
  "role": "elder",
  "phone": "+91-9876543210",
  "email": "margaret.thompson@example.com",
  "password": "$2b$10$hashedpasswordhere",
  "emergencyContacts": [
    { "name": "James Thompson", "relation": "Son", "phone": "+91-9123456789" },
    { "name": "Dr. Priya Sharma", "relation": "Family Doctor", "phone": "+91-9988776655" }
  ],
  "isActive": true,
  "createdAt": "2024-09-01T08:00:00.000Z",
  "updatedAt": "2024-09-15T10:30:00.000Z"
}
*/

module.exports = mongoose.model("User", userSchema);
