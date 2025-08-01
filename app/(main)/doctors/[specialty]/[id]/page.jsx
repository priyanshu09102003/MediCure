import { getAvailableTimeSlots, getDoctorsbyId } from '@/actions/appointments';
import { redirect } from 'next/navigation';
import React from 'react'
import DoctorProfileComponent from './_components/doctor-profile';

const DoctorProfilePage = async({params}) => {

    const {id} = await params;

    try {

        const [doctorData , slotsData] = await Promise.all([
            getDoctorsbyId(id),
            getAvailableTimeSlots(id)
        ]);

         return (
                <DoctorProfileComponent doctor={doctorData.doctor} availableDays={slotsData.days || []} />
            )
        
    } catch (error) {
         console.error("Error loading the doctor profile");
         redirect("/doctors");
    }
 
}

export default DoctorProfilePage
