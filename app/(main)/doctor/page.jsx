import { getAvailabilitySlots, getDoctorAppointments } from '@/actions/doctor';
import { getCurrentUser } from '@/actions/onboarding'
import { redirect } from 'next/navigation';
import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';
import AvailabilitySettings from './_components/availability-settings';

const DoctorDashboard = async() => {
    const user = await getCurrentUser();

    const [appointmentsData , availabilityData] = await Promise.all([
        getDoctorAppointments(),
        getAvailabilitySlots(),
    ])

    if(user?.role !== "DOCTOR"){
        redirect("/onboarding");
    }

    //if user is not verified, route to the verification page

    if(user?.verificationStatus !== "VERIFIED"){
        redirect("/doctor/verification");
    }


  return (
    <Tabs defaultValue="appointments" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <TabsList className="lg:col-span-1 bg-muted/30 border h-14 lg:h-40 flex flex-row lg:flex-col w-full p-2 lg:p-1 rounded-md lg:space-y-2 space-x-2 lg:space-x-0">
                    <TabsTrigger value="appointments"
                        className="flex-1 lg:flex lg:items-center lg:justify-start lg:px-4 lg:py-3 w-full cursor-pointer"
                        >
                        <Calendar className='h-4 w-4 mr-2 hidden lg:inline' />
                        <span>Appointments</span>
                    </TabsTrigger>
                    
                    <TabsTrigger value="availability"
                        className="flex-1 lg:flex lg:items-center lg:justify-start lg:px-4 lg:py-3 w-full cursor-pointer"
                        >
                        <Clock className='h-4 w-4 mr-2 hidden lg:inline' />
                        <span>Set Availability</span>
                    </TabsTrigger>
                </TabsList>
                
                <div className='md:col-span-3'>
                    <TabsContent value='appointments' className='border-none p-0'>
                        To be done
                    </TabsContent>

                    <TabsContent value='availability' className='border-none p-0'>
                        <AvailabilitySettings slots={availabilityData.slots || []} />
                    </TabsContent>
                </div>


                
                        
            </Tabs>
  )
}

export default DoctorDashboard
