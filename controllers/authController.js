import Admin from "../models/AdminModel.js";
import AppError from "../utils/appError.js";
import generateToken from "../utils/tokenutils.js";
import { sendEmail } from "../utils/email.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";

export async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    return next(new AppError("Incorrect Email or Password", 400));
  }
  const isCorrect = await admin.correctPassword(password, admin.password);

  if (!isCorrect) {
    return next(new AppError("Incorrect Email or Password", 400));
  }

  const token = generateToken(admin._id);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "login succesful",
    data: {
      data: admin,
      token
    },
  });
}

export async function protect(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in Please log in to get access", 401),
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await Admin.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 404),
    );
  }
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password was recently changed. Please log in again.", 401),
    );
  }
  req.user = currentUser;
  next();
}

export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return next(
        new AppError("There is no admin with this email address.", 404),
      );
    }

    const resetToken = admin.createPasswordResetToken();

    await admin.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/admin/resetpassword/${resetToken}`;

    const message = `Forgot your password?

Click the link below to reset your password:

${resetURL}

This password reset link is valid for 10 minutes.

If you did not request a password reset, please ignore this email.`;

    try {
      await sendEmail({
        email: admin.email,
        subject: "Your password reset token (valid for 10 minutes)",
        message,
      });
    } catch (err) {
      console.log("EMAIL ERROR:", err);

      // Remove reset token if email failed
      admin.passwordResetToken = undefined;
      admin.passwordResetExpires = undefined;

      await admin.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Please try again later.",
          500,
        ),
      );
    }

    res.status(200).json({
      status: "success",
      message: "Password reset token sent to your email.",
    });
  } catch (err) {
    next(err);
  }
}
export async function resetPassword(req, res, next) {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const admin = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return next(new AppError("Token is invalid or has expired.", 400));
    }

    admin.password = req.body.password;
    admin.passwordConfirm = req.body.passwordConfirm;

    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;

    await admin.save();

    const token = generateToken(admin._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      status: "success",
      message: "Password reset successful.",
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const admin = await Admin.findById(req.user._id).select("+password");

    if (!admin) {
      return next(new AppError("Admin no longer exists.", 404));
    }

    if (
      !(await admin.correctPassword(req.body.passwordCurrent, admin.password))
    )
      return next(new AppError("Your current password is incorrect", 401));
    admin.password = req.body.password;
    admin.passwordConfirm = req.body.passwordConfirm;

    await admin.save();

    const token = generateToken(admin._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({
      status: "success",
      message: "Password updated successfully.",
    });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
}
