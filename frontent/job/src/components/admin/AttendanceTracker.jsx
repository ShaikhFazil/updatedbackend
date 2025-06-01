import React from 'react'
import useGetAllAttendance from '@/hooks/useGetAllAttendance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { format, isValid } from "date-fns";
import { useSelector } from 'react-redux';

// Safe date formatting utility functions
const formatDateSafe = (date, dateFormat) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return isValid(dateObj) ? format(dateObj, dateFormat) : "Invalid Date";
};

const calculateDuration = (punchIn, punchOut) => {
  if (!punchIn || !punchOut) return "N/A";
  
  const start = new Date(punchIn);
  const end = new Date(punchOut);
  
  if (!isValid(start) || !isValid(end)) return "Invalid Date";
  
  const durationMs = end - start;
  const durationSeconds = Math.floor(durationMs / 1000);
  
  // Calculate hours, minutes, seconds
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  
  // Format with leading zeros
  const formatNumber = (num) => num.toString().padStart(2, '0');
  
  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
};

const AttendanceTracker = () => {
    const { allAttendance, loading, error } = useSelector((state) => state.attendance);
    useGetAllAttendance();

      const { user } = useSelector((state) => state.auth);
      
    // Process the attendance data
    const attendanceRecords = Array.isArray(allAttendance) 
        ? allAttendance 
        : allAttendance?.attendance || [];


    // Handle loading and error states
    if (loading) return <div className="text-center py-8">Loading attendance data...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (!attendanceRecords.length) return <div className="text-center py-8">No attendance records found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>All Attendance Records</CardTitle>
                      <h1 className="text-4xl font-semibold mb-10 text-center">Welcome, {user?.fullname || user?.name || "User"}</h1>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Punch In</TableHead>
                                <TableHead>Punch Out</TableHead>
                                <TableHead>Duration (HH:MM:SS)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceRecords.map((record) => (
                                <TableRow key={record._id}>
                                    <TableCell className="font-medium">
                                        {record.userId?.fullname || "Unknown"}
                                    </TableCell>
                                    <TableCell>
                                        {formatDateSafe(record.punchIn, "dd MMM yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {formatDateSafe(record.punchIn, "h:mm a")}
                                    </TableCell>
                                    <TableCell>
                                        {record.punchOut 
                                            ? formatDateSafe(record.punchOut, "h:mm a") 
                                            : "Not punched out"}
                                    </TableCell>
                                    <TableCell>
                                        {record.punchOut 
                                            ? calculateDuration(record.punchIn, record.punchOut)
                                            : "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AttendanceTracker;