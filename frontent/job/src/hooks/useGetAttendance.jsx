import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    getMyAttendanceStart,
    getMyAttendanceSuccess,
    getMyAttendanceFailure,
} from "../redux/attendanceSlice";
import axios from "axios";
import { toast } from "sonner";
import { ATTENDANCE_API_END_POINT } from "@/utils/constant";

const useGetAttendance = () => {
    const dispatch = useDispatch();

    const refetch = useCallback(async () => {
        try {
            dispatch(getMyAttendanceStart());
            const res = await axios.get(`${ATTENDANCE_API_END_POINT}/user-all`, {
                withCredentials: true,
            });
            dispatch(getMyAttendanceSuccess(res.data));
        } catch (error) {
            dispatch(
                getMyAttendanceFailure(error.response?.data?.message || error.message)
            );
            toast.error(error.response?.data?.message || "Failed to load attendance");
        }
    }, [dispatch]);

    useEffect(() => {
        refetch(); // Fetch on mount
    }, [refetch]);

    return { refetch };
};

export default useGetAttendance;
