import React, { useEffect, useState } from 'react'
import Navbar from '../ui/shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable.jsx'
import {useGetAllAdminJobs} from '@/hooks/useGetAllAdminJobs.jsx'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {

  useGetAllAdminJobs()

  const [input, setInput] = useState("")

  const navigate = useNavigate()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSearchJobByText(input))
  }, [input])

  return (
    <div>
      <Navbar />
      <div>
        <div className='flex items-center justify-between max-w-6xl mx-auto my-10'>
          <Input className='w-fit'
            placeholder='Filter by Name'
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate('/admin/jobs/create')}>Post Jobs</Button>
        </div>


      </div>
      <AdminJobsTable />

    </div>
  )
}

export default AdminJobs