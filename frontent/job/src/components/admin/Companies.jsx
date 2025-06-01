import React, { useEffect, useState } from 'react'
import Navbar from '../ui/shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable '
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const Companies = () => {

    useGetAllCompanies()
    const navigate = useNavigate()

    const [input, setInput] = useState()

    const dispatch = useDispatch()

    useEffect(()=>{
dispatch(setSearchCompanyByText(input))
    },[input])

    return (
        <div>
            <Navbar />
            <div>
                <div className='flex items-center justify-between max-w-6xl mx-auto my-10'>
                    <Input className='w-fit'
                        placeholder='Filter by Name'
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button onClick={() => navigate('/admin/companies/create')}>New Company</Button>
                </div>


            </div>
            <CompaniesTable />

        </div>
    )
}

export default Companies