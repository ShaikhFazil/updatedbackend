import { Attendance } from "../models/attendance.modal.js";
import { User } from "../models/user.model.js";

// Record punch in
export const punchIn = async (req, res) => {
  try {
    // if (!req.id) {
    //   return res.status(401).json({ msg: "User not authenticated" });
    // }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      userId: req.id, 
      punchIn: {      
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ msg: "You have already punched in today" });
    }

    const attendance = new Attendance({
      userId: req.id,  
      punchIn: new Date(),
    });


    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Record punch out
export const punchOut = async (req, res) => {
  try {
    // if (!req.id) {
    //   return res.status(401).json({ msg: "User not authenticated" });
    // }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.id,   
      punchIn: {         
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
      punchOut: { $exists: false } 
    });

    if (!attendance) {
      return res.status(400).json({ msg: "No active punch-in found for today" });
    }

    attendance.punchOut = new Date();
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get user's attendance
export const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.id })
      .sort({ punchIn: -1 }); 
    
    res.status(200).json({
      success: true,
      attendance 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all attendance (admin only)
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("userId", ["fullname", "email"]) 
      .sort({ punchIn: -1 }); 
    
    res.status(200).json({
      success: true,
      attendance
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
