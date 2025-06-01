import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { format, isValid } from "date-fns";
import useAttendance from "../hooks/useAttendance";
import useGetAttendance from "../hooks/useGetAttendance";
import { Badge } from "../components/ui/badge";

const formatDateSafe = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return isValid(dateObj) ? format(dateObj, "h:mm a") : "Invalid Date";
};

const formatDaySafe = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return isValid(dateObj) ? format(dateObj, "dd MMM yyyy") : "Invalid Date";
};

const AttendanceForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { myAttendance, todayAttendance, loading } = useSelector((state) => state.attendance);
  const { punchIn, punchOut } = useAttendance();
  const { refetch } = useGetAttendance();

  const handlePunchIn = async () => {
    await punchIn();
    refetch();
  };

  const handlePunchOut = async () => {
    await punchOut();
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-semibold mb-10 text-center">Welcome, {user?.fullname || user?.name || "User"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAttendance ? (
              <div className="space-y-3">
                <div className="text-gray-600 font-medium">
                  {formatDaySafe(todayAttendance.punchIn)}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Punch In: {formatDateSafe(todayAttendance.punchIn)}
                  </Badge>
                  {todayAttendance.punchOut ? (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Punch Out: {formatDateSafe(todayAttendance.punchOut)}
                    </Badge>
                  ) : (
                    <Button size="sm" onClick={handlePunchOut} disabled={loading}>
                      Punch Out
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <Button onClick={handlePunchIn} disabled={loading} className="w-full">
                Punch In
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Attendance History</CardTitle>
          {user.role === "admin" && 
          <div>
            hello admin
            </div>}
        </CardHeader>
        <CardContent>
          {Array.isArray(myAttendance) && myAttendance.length > 0 ? (
            <div className="space-y-6">
              {myAttendance.map((record) => (
                <div key={record._id} className="border-b pb-4 last:border-b-0">
                  <div className="font-semibold text-gray-700">
                    {formatDaySafe(record.punchIn)}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Punch In: {formatDateSafe(record.punchIn)}
                    </Badge>
                    {record.punchOut && (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Punch Out: {formatDateSafe(record.punchOut)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No attendance records found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceForm;
