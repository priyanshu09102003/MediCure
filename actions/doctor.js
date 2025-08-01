"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

    return [];
}