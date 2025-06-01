import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";

const AppliedJobTable = () => {
    const { allAppliedJob } = useSelector((store) => store.job);

    console.log(allAppliedJob)

    return (
        <div>
            <Table>
                <TableCaption>A list of Applied Jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!allAppliedJob || allAppliedJob.length === 0 ? (
                        <span>You have not applied for any job</span>
                    ) : (
                        allAppliedJob.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage
                                            src={item?.job?.company?.logo}
                                            alt="company logo"
                                        />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{item?.job?.title}</TableCell>
                                <TableCell>{item?.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <Badge>{item?.status?.toUpperCase()}</Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AppliedJobTable;
