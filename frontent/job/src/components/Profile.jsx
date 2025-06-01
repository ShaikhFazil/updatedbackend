import React, { useState } from 'react'
import Navbar from './ui/shared/Navbar'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAllAppliedJobs from '@/hooks/useGetAllAppliedJobs'


// const skills = ["HTML", "CSS", "JAVASCRIPT", "REACTJS"]

const isResume = true

const Profile = () => {

  useGetAllAppliedJobs()

  const [open, setOpen] = useState(false)

  const { user } = useSelector(store => store.auth)

  return (
    <div>
      <Navbar />
      <div className='max-w-4xl mx-auto border border-gray-200 rounded-2xl my-5 p-8'>

        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-20 w-20 rounded-md'>
              <AvatarImage src={user?.profile?.profilePhoto} alt='profileimg' />
            </Avatar>
            <div>
              <h1 className='font-medium text-xl'>{user?.fullname}</h1>
              <p>{user?.profile?.bio}</p>
            </div>
          </div>
          <Button className='text-right' onClick={() => setOpen(true)}><Pen /></Button>
        </div>
        <div className='my-5'>
          <div className='flex items-center gap-3 my-2'>
            <Mail />
            <span>{user?.email}</span>

          </div>
          <div className='flex items-center gap-3 my-2'>
            <Contact />
            <span>{user?.phoneNumber}</span>

          </div>
        </div>
        <div>
          <h1>Skillls</h1>
          <div className='flex items-center gap-1'>
            {
              user?.profile?.skills.length > 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item.toUpperCase()}</Badge>) : "N/A"
            }

          </div>
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>

          <Label className='text-md font-bold'>Resume</Label>
          {
            isResume ? <a target='_blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
          }
        </div>

      </div>
      <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
        <h1 className='text-lg font-bold my-5'>Applied Jobs</h1>
        {/*Application table */}
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />

    </div>
  )
}

export default Profile