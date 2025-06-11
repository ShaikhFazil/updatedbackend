import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  punchIn: {
    type: Date,
    required: true,
  },
  punchOut: {
    type: Date,
  },
    punchInLocationName: { type: String },
  punchOutLocationName: { type: String },
}, { timestamps: true });
export const Attendance = mongoose.model("Attendance", attendanceSchema);