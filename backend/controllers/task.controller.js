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

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getTasks = async (req, res) => {
  try {
        console.log("Role in request:", req.role);
    let matchQuery = {};

    if (req.role !== "admin") {
      matchQuery.createdBy = new mongoose.Types.ObjectId(req.id); 
    }

    const tasks = await Task.find(matchQuery).populate(
      "createdBy",
      "fullname email"
    );

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
