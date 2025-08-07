"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { includes, success } from "zod";

//To SET the availabilty slots of the doctor in the doctor dashboard
export async function setAvailabiltySlots(formData){

    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }

    try {
        const doctor = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role: "DOCTOR",
            }
        });

        if(!doctor){
            throw new Error ("Doctor not found");
        }

        const startTime = formData.get("startTime");
        const endTime = formData.get("endTime");


        //Checking the start time and endtime input

        if(!startTime || !endTime){
            throw new Error("Start time and end time are required")
        }

        if(startTime >= endTime){
            throw new Error("Start time must be before end time")
        }

        //Checking if the doctor already has existing slots

        const existingSlots = await db.availability.findMany({
            where:{
                doctorId : doctor.id
            }
        });

        if(existingSlots.length>0){
            const slotsWithNoAppointments = existingSlots.filter(
                (slot) => !slot.appointment
            );

            if(slotsWithNoAppointments.length>0){
                await db.availability.deleteMany({
                    where:{
                        id:{
                            in: slotsWithNoAppointments.map((slot) => slot.id)
                        },
                    }
                })
            }
        }

         //Creating new availability slot

            const newSlot = await db.availability.create({
                data:{
                    doctorId: doctor.id,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    status: "AVAILABLE"
                }
            });

            revalidatePath("/doctor");
            return {success: true, slot: newSlot}

    } catch (error) {

        throw new Error("Failed to set the availability")
        
    }

}

//To GET the availability slots

export async function getAvailabilitySlots() {
    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }

    try {

           const doctor = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role: "DOCTOR",
            }
        });

        if(!doctor){
            throw new Error ("Doctor not found");
        }


        const availabilitySlots = await db.availability.findMany({
            where:{
                doctorId: doctor.id
            },

            orderBy:{
                startTime: "asc",
            },
        });

        return {slots: availabilitySlots}
        
    } catch (error) {
        
        throw new Error("Failed to get the doctor availability")
    }
}

//To GET the doctor's appointments
export async function getDoctorAppointments(){

    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }

    try {

        const doctor = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role: "DOCTOR",
            },
        });

        if(!doctor){
            throw new Error("Doctor not found");
        }

        const appointments = await db.appointment.findMany({
            where:{
                doctorId: doctor.id,
                status:{
                    in: ["SCHEDULED"],
                }
            },

            include:{
                patient: true,
            },

            orderBy:{
                startTime: "asc"
            }
        });

        return {appointments};
        
    } catch (error) {

        throw new Error("Failed to fetch the appointments" + error.message);
        
    }
}

//Cancel Appointment Server Action to cancel the appointment by the doctor

export async function cancelAppointment(formData){
    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }

    try {
       const user = await db.user.findUnique({
        where:{
            clerkUserId: userId
        }
       });

       if(!user){
        throw new Error("User not found");
       }

       const appointmentId = formData.get("appointmentId");

       if(!appointmentId){
        throw new Error("Appointment ID is required");
       }

       const appointment = await db.appointment.findUnique({
        where:{
            id: appointmentId
        },
        include : {
            patient: true,
            doctor: true,
        },
       });

       if(!appointment){
        throw new Error("Appointment not found");
       }

       //Verifying if the user is PATIENT or DOCTOR

       if(appointment.doctorId !== user.id && appointment.patientId !== user.id){
        throw new Error("You are not authorized to cancel this appointment");
       }

       //Cancelling the appointment by the patient
       await db.$transaction(async tx=>{
        await tx.appointment.update({
            where:{
                id: appointmentId,
            },
            data:{
                status: "CANCELLED"
            }
        });

        //Refund credits to the patient

        await tx.creditTransaction.create({
            data:{
                userId: appointment.patientId,
                amount: 2,
                type: "APPOINTMENT_DEDUCTION",
            },
        });

        //Deducting the credits from the doctor's account

        await tx.creditTransaction.create({
            data:{
                userId: appointment.doctorId,
                amount: -2,
                type: "APPOINTMENT_DEDUCTION"
            },
        });

         //Update the patient's credit balance after cancellation(increment)

       await tx.user.update({
        where:{
            id: appointment.patientId
        },

        data:{
            credits: {
                increment : 2
            }
        }
       });

       //Update the doctor's credit balance(decrement)

       await tx.user.update({
         where:{
            id: appointment.doctorId,
         },

         data:{
            credits:{
                decrement: 2
            },
         },
       }); 
    });

    if(user.role === "DOCTOR"){
        revalidatePath("/doctor");
    }else if(user.role === "PATIENT"){
        revalidatePath("/appointments");
    }

    return{success:true};
          
    } catch (error) {

        throw new Error("Failed to cancel the appointment" + error.message);
        
    }
}

//Server action to add the appointment notes
export async function addAppointmentNotes(formData){

    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }

    try {

        const doctor = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role: "DOCTOR",
            },
        });

        if(!doctor){
            throw new Error("Doctor not found");
        }

        const appointmentId = formData.get("appointmentId");
        const notes = formData.get("notes");

        const appointment = await db.appointment.findUnique({
            where:{
                id: appointmentId,
                doctorId: doctor.id,
            }
        });

        if(!appointment){
            throw new Error("Appointment not found");
        }

        const updatedAppointment = await db.appointment.update({
            where:{
                 id: appointmentId
            },

            data:{
                notes
            }
               
        });

        revalidatePath("/doctors");
        return{success: true, appointment: updatedAppointment};
   
    } catch (error) {

        throw new Error("Failed to update note" + error.message);  
    }
}

//Mark the appointment to be completed

export async function markAppointmentCompleted(formData){

    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }

    try {

        const doctor = await db.user.findUnique({
            where:{
                clerkUserId: userId,
                role: "DOCTOR",
            },
        });

        if(!doctor){
            throw new Error("Doctor not found");
        }

        const appointmentId = formData.get("appointmentId");
        if(!appointmentId){
            throw new Error("Appointment Id is required")
        }

        const appointment = await db.appointment.findUnique({
            where:{
                id: appointmentId,
                doctorId: doctor.id,
            },

            include:{
                patient : true
            }
        });

        if(!appointment){
            throw new Error("Appointment not found");
        }

        
        if(appointment.status !== "SCHEDULED"){
            throw new Error("Only scheduled appointments can be marked as completed");
        }

        const now = new Date();
        const appointmentEndTime = new Date(appointment.endTime);

        if(now<appointmentEndTime){
            throw new Error(
                "Cannot mark the appointment as completed before the scheduled end time"
            );
        }

        const updatedAppointment = await db.appointment.update({
            where:{
                id: appointmentId
            },

            data:{
                status: "COMPLETED",
            }
        });

        revalidatePath("/doctor");
        return {success: true, appointment: updatedAppointment};

    } catch (error) {

        throw new Error("Failed to mark appointment as completed" + error.message);  
    }
}
