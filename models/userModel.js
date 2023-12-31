const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "نام خود را وارد کنید"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  phone: {
    type: Number,
    required: [true, "شماره تلفن وارد نمایید"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "یک رمز عبور وارد نمایید"],
    minlength: 2,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// userSchema.pre("save", async function (next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified("password")) return next();

//   // Hash the password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12);

//   // Delete confirmPassword field
//   this.confirmPassword = undefined;
//   next();
// });

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre("remove", async function (next) {
  // Assuming 'Order' is the model for orders
  await Order.updateMany({ user: this._id }, { $set: { user: null } });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
