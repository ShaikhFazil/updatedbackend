import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {

    const { allAdminJobs, searchJobByText } = useSelector(store => store.job)
    console.log("Redux State:", allAdminJobs);
    const [filter, setFilter] = useState(allAdminJobs);

    const navigate = useNavigate()


    useEffect(() => {
        const filteredCompany = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            return job?.name?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.title?.toLowerCase().includes(searchJobByText.toLowerCase());
        });

        setFilter(filteredCompany);
    }, [allAdminJobs, searchJobByText]);

    console.log("Filtered Jobs:", filter);


    return (
        <div>
            <Table>
                <TableCaption>A list of Your recent Posted Jobs.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filter?.length === 0 ? ( // Safe check using optional chaining
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                Company not found!
                            </TableCell>
                        </TableRow>
                    ) : (
                        filter && filter.map((job) => (
                            <TableRow key={job.id}>

                                <TableCell>{job?.company?.name}</TableCell>
                                <TableCell>{job?.created_by?.fullname}</TableCell>
                                <TableCell>{job.createdAt.split("T")[0]}</TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div className="flex items-center gap-2 w-fit cursor-pointer" onClick={() => navigate(`/admin/companies/${job._id}`)}>
                                                <Edit2 className="w-4" />
                                                <span>Edit</span>
                                            </div>
                                            <div onClick={()=>navigate(`/admin/jobs/${job._id}/applicants`)} className="flex items-center w-fit gap-2 cursor-pointer mt-2">
                                                <Eye/>
                                                <span>Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

        </div>
    )
}

export default AdminJobsTable