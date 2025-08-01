import PageHeader from '@/components/page-header'
import { Stethoscope } from 'lucide-react'
import React from 'react'

export const metadata = {
    title: "Doctor's Dashboard - MediCure",
    description: "Manage your appointments and availability"
}

const DoctorDashboardLayout = ({children}) => {
  return (
    <div className='container mx-auto px-4 py-22'>

        <PageHeader icon={<Stethoscope/>} title={"Doctor's Dashboard"} />
      {children}
    </div>
  )
}

export default DoctorDashboardLayout
