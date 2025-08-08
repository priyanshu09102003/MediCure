import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from 'lucide-react';
import AppointmentCard from '@/components/appointmentCard';

const DoctorAppointmentList = ({appointment}) => {
  return (
    <Card className="border-emerald-900/20">
        <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold gradient-title text-white flex items-center">
                <Calendar className='h-5 w-5 mr-2 text-emerald-400' />
                Upcoming Appointments
            </CardTitle>
            
        </CardHeader>

        <CardContent>
            {appointment.length > 0 ? (<div className='space-y-4'>
                {appointment.map(appointment=>(
                    <AppointmentCard
                    key={appointment.id}
                    appointmentInfo={appointment}
                    userRole="DOCTOR"
                    />
                ))}
            </div>) : 
            (<div className='text-center py-8'>
                <Calendar className='h-12 w-12 mx-auto text-muted-foreground mb-3' />
                <h3 className='text-xl font-medium text-white mb2'>No upcoming appointments</h3>
                <p className='text-muted-foreground'>
                    You don't have any scheduled appointments yet. Make sure you have set your availability to allow patients to book.
                </p>
            </div>)}
        </CardContent>
    </Card>
  )
}

export default DoctorAppointmentList;
