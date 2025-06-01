import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;
    if ((!fullname, !email, !phoneNumber, !password)) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    
        if (user) {
          return res.status(400).json({
            message: "User already exist with its email.",
            success: false,
          });
        }
        
               const userCount = await User.countDocuments();
           const empId = `EMP-${String(userCount + 1).padStart(3, "0")}`;

           const hashedPassword = await bcrypt.hash(password, 10);

             // Initialize user data without profile photo
    const userData = {
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      empId,
    };

    // const file = req.file;
    // const fileuri = getDataUri(file);
    // const cloudResponse = await cloudinary.uploader.upload(fileuri.content);

       // Only process profile photo if file exists
    if (req.file) {
      const fileuri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileuri.content);
      userData.profile = {
        profilePhoto: cloudResponse.secure_url,
      };
    }

    await User.create(userData);


    // await User.create({
    //   fullname,
    //   email,
    //   phoneNumber,
    //   password: hashedPassword,
    //   empId,
    //   profile:{
    //     profilePhoto: cloudResponse.secure_url,
    //   }
    // });

    return res.status(200).json({
      message: "Account created succesfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
     return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Check role
    // if (role !== user.role) {
    //   return res.status(400).json({
    //     message: "Account doesn't exist with current role.",
    //     success: false,
    //   });
    // }

    const tokenData = { userId: user._id };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userResponse = {
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  phoneNumber: user.phoneNumber,
  profile: user.profile,
  role: user.role, 
  empId: user.empId,
};


    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
     secure: process.env.NODE_ENV === "production",
  sameSite: "None",
      })
      .json({
        message: `Welcome Back ${user.fullname}`,
        user: userResponse,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber } = req.body;

    const file = req.file;
    const fileuri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileuri.content);

    let skillsArray = skills ? skills.split(",") : [];

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not Found",
        success: false,
      });
    }

    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    //resume will come over here
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; // save the cloudaniry url
      user.profile.resumeOriginalName = file.originalname; // save the orginal file name
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "profile is updated succesfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
