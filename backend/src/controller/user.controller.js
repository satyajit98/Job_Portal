import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.Handler.js";

// signup user
export const register = async (req, res, next) => {
  // validate user
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return next(errorHandler(500, "all fields are required", false));
    }

    // search for exists user
    const user = await User.findOne({ email });
    if (user) {
      return next(errorHandler(400, "This user is already exists", flase));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // create User
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
// create token
const createToken = (_id) => {
  return jwt.sign({ id: _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // check all fields are required or not
    if (!email || !password || !role) {
      return next(errorHandler(400, "all fields are required", false));
    }

    // checking if user exist

    let user = await User.find({ email });
    if (!user) {
      return next(errorHandler(500, "Incorrect email or password", false));
    }

    // password matching

    const isPasswordMach = await bcrypt.compare(password, user.password);
    if (!isPasswordMach) {
      return next(errorHandler(400, "Incorrect email or password", false));
    }

    // check role is correct or not
    if (role !== User.role) {
      return next(
        errorHandler(400, "Account doesn't exist with current role.", false)
      );
    }

    // token generate
    const token = createToken(user._id);

    // redeclear user

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        sucess: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// logout
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
