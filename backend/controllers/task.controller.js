import mongoose from "mongoose";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, startDate, endDate } = req.body;

    const task = new Task({
      title,
      description,
      status,
      startDate,
      endDate,
      createdBy: req.id, 
    });

    console.log("Creating task with createdBy:", req.id);
    await task.save();
    
    // Populate before sending response
    const populatedTask = await Task.findById(task._id).populate('createdBy', 'fullname email');
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getTasks = async (req, res) => {
  try {
    let matchQuery = {};

    if (req.role !== "admin") {
      matchQuery.createdBy = new mongoose.Types.ObjectId(req.id);
    }

    const tasks = await Task.find(matchQuery).populate({
      path: "createdBy",
      select: "fullname email",
    });

    const statusCounts = await Task.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const countObject = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
    };

    statusCounts.forEach((entry) => {
      countObject[entry._id] = entry.count;
    });

    countObject.total = tasks.length;

    res.json({
      tasks,
      count: countObject,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, startDate, endDate } = req.body;

    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check permission - only creator or admin can update
    if (task.createdBy.toString() !== req.id && req.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Not authorized to update this task" });
    }

    // Update task
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.startDate = startDate || task.startDate;
    task.endDate = endDate || task.endDate;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Check permission - only creator or admin can delete
    if (task.createdBy.toString() !== req.id && req.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(id);
    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


// Create task (Admin only)
export const createAdminTask = async (req, res) => {
  try {
    const { title, description, status, startDate, endDate, assignedTo } = req.body;

    // Validate assigned users exist
    const usersExist = await User.find({
      _id: { $in: assignedTo }
    }).select('_id');

    if (usersExist.length !== assignedTo.length) {
      return res.status(400).json({
        success: false,
        message: "One or more assigned users do not exist"
      });
    }

    // Create task with assigned users
    const task = new Task({
      title,
      description,
      status,
      startDate,
      endDate,
      createdBy: req.id,
      assignedTo: assignedTo.map(userId => ({
        user: userId,
        status: "Pending"
      }))
    });

    await task.save();

    // Populate data for response
    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'fullname email')
      .populate('assignedTo.user', 'fullname email');

    res.status(201).json({
      success: true,
      task: populatedTask
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




// Get tasks (Admin sees all, users see only assigned tasks)
export const getAdminTasks = async (req, res) => {
  try {
    let query = {};
    
    if (req.role === "admin") {
      // Admin can see all tasks they created
      query.createdBy = req.id;
    } else {
      // Users can only see tasks assigned to them
      query["assignedTo.user"] = req.id;
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'fullname email')
      .populate('assignedTo.user', 'fullname email');

    // Status counts for dashboard
    const statusCounts = await Task.aggregate([
      { $match: query },
      { $unwind: "$assignedTo" },
      { 
        $match: req.role !== "admin" ? 
          { "assignedTo.user": new mongoose.Types.ObjectId(req.id) } : 
          {}
      },
      {
        $group: {
          _id: "$assignedTo.status",
          count: { $sum: 1 }
        }
      }
    ]);

    const countObject = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
      total: tasks.length
    };

    statusCounts.forEach((entry) => {
      countObject[entry._id] = entry.count;
    });

    res.json({
      success: true,
      tasks,
      counts: countObject
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update task (Admin can update all fields, users can only update status)
export const updateAdminTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, startDate, endDate } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found" 
      });
    }

    // Check permissions
    const isAdmin = req.role === "admin";
    const isCreator = task.createdBy.toString() === req.id;
    const isAssignedUser = task.assignedTo.some(
      assignment => assignment.user.toString() === req.id
    );

    if (!isAdmin && !isCreator && !isAssignedUser) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to update this task" 
      });
    }

    // Different update permissions
    if (isAdmin || isCreator) {
      // Admin/creator can update all fields
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.startDate = startDate || task.startDate;
      task.endDate = endDate || task.endDate;
    } else {
      // Assigned user can only update their status
      const userAssignment = task.assignedTo.find(
        assignment => assignment.user.toString() === req.id
      );
      if (userAssignment && status) {
        userAssignment.status = status;
      }
    }

    await task.save();

    // Return populated task
    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'fullname email')
      .populate('assignedTo.user', 'fullname email');

    res.json({
      success: true,
      task: populatedTask
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete task (Admin or creator only)
export const deleteAdminTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found" 
      });
    }

    // Only admin or creator can delete
    if (task.createdBy.toString() !== req.id && req.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to delete this task" 
      });
    }

    await Task.findByIdAndDelete(id);
    res.json({ 
      success: true,
      message: "Task deleted successfully" 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "employee" })
      .select("fullname email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};
