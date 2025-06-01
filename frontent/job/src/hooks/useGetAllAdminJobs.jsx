import { setAllAdminJobs } from "@/redux/jobSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/job/getadminjobs`, { withCredentials: true });

                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                    console.log("API Response:", res.data.jobs);
                } else {
                    console.log("API Response failed:", res.data);
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };

        fetchAllAdminJobs();
    }, [dispatch]); // ✅ No self-assignment

    return null;
};
