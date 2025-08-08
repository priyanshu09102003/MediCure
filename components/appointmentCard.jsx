"use client";

import { generateVideoToken } from '@/actions/appointments';
import { addAppointmentNotes, cancelAppointment, markAppointmentCompleted } from '@/actions/doctor';
import useFetch from '@/hooks/use-fetch';
import { Calendar, CheckCircle, Clock, Loader2, Stethoscope, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


const AppointmentCard = ({appointmentInfo , userRole}) => {
    const [open , setOpen] = useState(false);
    const [action , setAction] = useState(null);
    const [notes, setNotes] = useState(appointmentInfo.notes || "");

    //Calling the server actions for different actions

    const {
        loading: cancelLoading,
        fn: submitCancel,
        data: cancelData
    } = useFetch(cancelAppointment);

    const {
        loading: notesLoading,
        fn: submitNotes,
        data: notesData
    } = useFetch(addAppointmentNotes);

    const {
        loading: tokenLoading,
        fn: submitTokenRequest,
        data: tokenData
    } = useFetch(generateVideoToken);

    const{
        loading: completeLoading,
        fn: submitMarkCompleted,
        data: completeData
    } = useFetch(markAppointmentCompleted);


    const otherParty = userRole === "DOCTOR" ? appointmentInfo.patient : appointmentInfo.doctor;

    const otherPartylabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
    const otherPartyIcon = userRole === "DOCTOR" ? <User/> : <Stethoscope/>;
    

    const formatDateTime = (dateString) => {
        try {

            return format(new Date(dateString) , "MMMM d, yyy 'at' h:mm a");
            
        } catch (e) {
            return "Invalid date";
        }
    }

    const formatTime = (dateString) => {
        try {
            return format(new Date(dateString), "h:mm a");
        }
        catch(e){
            return "Invalid Time";
        }
    };

    const canMarkCompleted = () => {
        if(userRole !== "DOCTOR" || appointmentInfo.status !== "SCHEDULED"){
            return false;
        }
        const now = new Date();
        const appointmentEndTime = new Date(appointmentInfo.endTime);
        return now >= appointmentEndTime;
    }

    const  handleMarkComplete = async() => {
        if(completeLoading) return;

        if(
            window.confirm(
                "Are you sure you want to mark this appointment as completed? This action cannot be undone."
            ) 
        ) {
            const formData = new FormData();
            formData.append("appointmentId" , appointmentInfo.id);
            await submitMarkCompleted(formData);
        }
    }

    useEffect(() => {
        if(completeData?.success){
            toast.success("Appointment marked as complete");
            setOpen(false);
        }
    }, [completeData]);


  return (
    <>
        <Card className="border-emerald-700/20 hover:border-emerald-600/60 transition-all cursor-pointer">
        <CardContent className="p-4">
            <div className='flex flex-col md:flex-row justify-between gap-4'>
               <div className='flex items-start gap-3'>
                         <div className='bg-muted/20 rounded-full p-2 mt-1'>
                    {otherPartyIcon}
                        </div>

                        <div>
                            <h3 className='font-medium text-white'>
                                {userRole === "DOCTOR" ?
                                otherParty.name
                                : `Dr. ${otherParty.name}`
                            }
                            </h3>

                            {userRole === "DOCTOR" && (
                                <p className='text-sm text-muted-foreground'>
                                    {otherParty.email}
                                </p>
                            )}

                            {userRole === "PATIENT" && (
                                <p className='text-sm text-muted-foreground'>
                                    {otherParty.speciality}
                                </p>
                            )}

                            <div className='flex items-center mt-2 text-sm text-muted-foreground'>
                                <Calendar className='h-4 w-4 mr-1' />
                                <span>{formatDateTime(appointmentInfo.startTime)}</span>
                            </div>

                            <div className='flex items-center mt-1 text-sm text-muted-foreground'>
                                <Clock className='h-4 w-4 mr-1' />
                                <span>
                                    {formatTime(appointmentInfo.startTime)} - {" "}
                                    {formatTime(appointmentInfo.endTime)}
                                </span>
                            </div>

                </div>
               </div>

               <div className='flex flex-col gap-2 self-end md:self-start'>

                     <Badge 
                        variant="outline"
                        className={
                            appointmentInfo.status === "COMPLETED"
                            ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400 self-start"
                            : appointmentInfo.status === "CANCELLED"
                            ? "bg-red-900/20 border-red-900/30 text-red-400 self-start"
                            : "bg-amber-900/20 border-amber-900/30 text-amber-400 self-start"
                        }>

                            {appointmentInfo.status}
                        </Badge>
                     
                     <div className='flex gap-2 mt-2 flex-wrap'>

                        {canMarkCompleted() && <Button size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                        onClick = {handleMarkComplete}
                        disabled = {completeLoading}
                        >
                            {
                                completeLoading ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                    <>
                                        <CheckCircle className='h-4 w-4 mr-1' />
                                        Complete
                                    </>
                                )
                            }
                            </Button>}

                            <Button 
                            size="sm"
                            className="bg-blue-400 hover:bg-blue-500 cursor-pointer"
                            onClick = {() => setOpen(true)}
                            >
                                View Details
                            </Button>
                     </div>
                            
                
               </div>
            </div>
        </CardContent>

    </Card>

    {/* Appointment Details Dialog */}

        <Dialog open = {open} onOpenChange = {setOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle  className="text-xl md:text-2xl text-white">
                        Appointment Details
                    </DialogTitle>
                    <DialogDescription>
                        {
                            appointmentInfo.status === "SCHEDULED"
                            ? "Manage your upcoming appointment"
                            : "View appointment information"
                        }
                    </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className='space-y-3'>
                            <h4><b>{otherPartylabel}</b></h4>
                            <div className='flex items-center'>
                                <div className='h-5 w-5 text-emerald-400 mr-2'>
                                    {otherPartyIcon}
                                </div>
                                <div>
                                    <p className='text-white font-medium'>
                                        {
                                            userRole === "DOCTOR"
                                            ? otherParty.name
                                            : `Dr. ${otherParty.name}`
                                        }

                                    </p>

                                    {userRole === "DOCTOR" && (
                                        <p className='text-muted-foreground text-sm'> 
                                            {otherParty.email}
                                        </p>
                                    )}

                                    {
                                        userRole === "PATIENT" && (
                                            <p className='text-muted-foreground text-sm'>
                                                {otherParty.specialty}
                                            </p>
                                        )
                                    }

                                </div>

                            </div>

                        </div>

                        {/* Appointment time */}
                         <div className='space-y-3'>
                            <h4 className='text-sm font-medium text-muted-foreground'>
                                Scheduled Time
                                </h4>

                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center'>
                                    <Calendar className='h-5 w-5 text-emerald-400 mr-2' />
                                    <p>{formatDateTime(appointmentInfo.startTime)}</p>
                                </div>
                                <div className='flex items-center'>
                                    <Clock className='h-5 w-5 text-emerald-400 mr-2'/>
                                   <p className='text-white'>
                                    {formatTime(appointmentInfo.startTime)} - {" "}
                                    {formatTime(appointmentInfo.endTime)}
                                   </p>

                                </div>

                            </div>

                        </div>

                        {/* Status */}

                        <div className='space-y-3'>
                            <h4 className='text-sm font-medium text-muted-foreground'>
                                Status
                                </h4>

                           <Badge
                           variant="outline"
                           className={
                            appointmentInfo.status === "COMPLETED"
                            ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400": 
                            appointmentInfo.status === "CANCELLED"
                            ? "bg-red-900/20 border-red-900/30 text-red-400"
                            : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                           }
                           >
                                    {appointmentInfo.status}
                           </Badge>

                        </div>
                       
    


                    {/* Patient Description */}

                    {appointmentInfo.patientDescription && (
                        <div className='space-y-2'>
                            <h4 className='text-sm font-medium text-muted-foreground'>
                                {
                                    userRole === "DOCTOR"
                                    ? "Patient Description"
                                    : "Your Description"
                                }
                            </h4>

                            <div className='p-3 rounded-md bg-muted/20 border border-emerald-900/20'>
                                <p className='text-white whitespace-pre-line'>
                                    {appointmentInfo.patientDescription}
                                </p>
                            </div>

                        </div>
                    )}

                    {appointmentInfo.status === "SCHEDULED" && (
                        <div className='space-y-2'>
                            <h4 className='text-sm font-medium text-muted-foreground'>
                                Video Consultation
                            </h4>
                        </div>
                    )}

                </div>
                   
                </DialogContent>
        </Dialog>

                            
    </>
  )
}

export default AppointmentCard;
