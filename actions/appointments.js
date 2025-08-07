"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCreditsForAppointment } from "./credits";
import { revalidatePath } from "next/cache";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";


const credentials = new Auth({
    applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
    privateKey: process.env.VONAGE_PRIVATE_KEY
});

const vonage = new Vonage(credentials, {});

export async function getDoctorsbyId(doctorId) {
    try {
        const doctor = await db.user.findUnique({
            where: {
                id: doctorId,
                role: "DOCTOR",
                verificationStatus: "VERIFIED"
            },
        });

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        return { doctor };
        
    } catch (error) {
        console.error("Error fetching doctor:", error);
        throw new Error("Failed to fetch doctor details");
    }
}

// Getting the available time slots of the doctor
export async function getAvailableTimeSlots(doctorId) {
    try {
        const doctor = await db.user.findUnique({
            where: {
                id: doctorId,
                role: "DOCTOR",
                verificationStatus: "VERIFIED"
            },
        });

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const availability = await db.availability.findFirst({
            where: {
                doctorId: doctor.id,
                status: "AVAILABLE"
            }
        });

        if (!availability) {
            throw new Error("No availability set by the doctor");
        }

        const now = new Date();
        const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];
        const lastDay = endOfDay(days[3]);

        const existingAppointments = await db.appointment.findMany({
            where: {
                doctorId: doctor.id,
                status: "SCHEDULED",
                startTime: {
                    lte: lastDay
                }
            }
        });

        const availableSlotsByDay = {};

        for (const day of days) {
            const dayString = format(day, "yyyy-MM-dd");
            availableSlotsByDay[dayString] = [];

            const availabilityStart = new Date(availability.startTime);
            const availabilityEnd = new Date(availability.endTime);

            // Setting the day to the current day we're processing
            availabilityStart.setFullYear(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
            );

            availabilityEnd.setFullYear(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
            );

            let current = new Date(availabilityStart);
            let end = new Date(availabilityEnd);

            while (isBefore(addMinutes(current, 30), end) || +addMinutes(current, 30) === +end) {
                const next = addMinutes(current, 30);

                if (isBefore(current, now)) {
                    current = next;
                    continue;
                }

                const overlaps = existingAppointments.some(appointment => {
                    const aStart = new Date(appointment.startTime);
                    const aEnd = new Date(appointment.endTime);

                    return (
                        (current >= aStart && current < aEnd) ||
                        (next > aStart && next <= aEnd) ||
                        (current <= aStart && next >= aEnd)
                    );
                });

                if (!overlaps) {
                    availableSlotsByDay[dayString].push({
                        startTime: current.toISOString(),
                        endTime: next.toISOString(),
                        formatted: `${format(current, "h:mm a")} - ${format(
                            next,
                            "h:mm a"
                        )}`,
                        day: format(current, "EEEE, MMMM d")
                    });
                }

                current = next;
            }
        }

        const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
            date,
            displayDate:
                slots.length > 0
                    ? slots[0].day
                    : format(new Date(date), "EEEE, MMMM d"),
            slots,
        }));

        return { days: result };
    } catch (error) {
        console.error("Error fetching available time slots:", error);
        throw new Error("Failed to fetch available time slots");
    }
}

// Server Action to book appointments
export async function bookAppointments(formData) {
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        console.log("Starting appointment booking process...");
        console.log("Clerk User ID:", userId);

        // Getting the patient trying to book the appointment - FIXED FIELD NAME
        const patient = await db.user.findUnique({
            where: {
                clerkUserId: userId, // Correct field name from schema
                role: "PATIENT"
            },
        });

        if (!patient) {
            throw new Error("Patient not found");
        }

        console.log("Patient found:", patient.id, "Credits:", patient.credits);

        // Parsing the form data
        const doctorId = formData.get("doctorId");
        const startTime = new Date(formData.get("startTime"));
        const endTime = new Date(formData.get("endTime"));
        const patientDescription = formData.get("description") || null;

        console.log("Form data parsed:", { 
            doctorId, 
            startTime: startTime.toISOString(), 
            endTime: endTime.toISOString(),
            description: patientDescription 
        });

        if (!doctorId || !startTime || !endTime) {
            throw new Error("Doctor ID, start time, and end time are required");
        }

        // Validate that startTime is before endTime
        if (startTime >= endTime) {
            throw new Error("Start time must be before end time");
        }

        // Validate that the appointment is in the future
        if (startTime <= new Date()) {
            throw new Error("Cannot book appointments in the past");
        }

        const doctor = await db.user.findUnique({
            where: {
                id: doctorId,
                role: "DOCTOR",
                verificationStatus: "VERIFIED"
            },
        });

        if (!doctor) {
            throw new Error("Doctor not found or not verified");
        }

        console.log("Doctor found:", doctor.id, doctor.name);

        if (patient.credits < 2) {
            throw new Error("Insufficient credits to book an appointment");
        }

        // Check for overlapping appointments
        console.log("Checking for overlapping appointments...");
        const overlappingAppointments = await db.appointment.findFirst({
            where: {
                doctorId: doctor.id,
                status: "SCHEDULED",
                OR: [
                    {
                        // New appointment starts during an existing appointment
                        AND: [
                            { startTime: { lte: startTime } },
                            { endTime: { gt: startTime } }
                        ]
                    },
                    {
                        // New appointment ends during an existing appointment  
                        AND: [
                            { startTime: { lt: endTime } },
                            { endTime: { gte: endTime } }
                        ]
                    },
                    {
                        // New appointment completely contains an existing appointment
                        AND: [
                            { startTime: { gte: startTime } },
                            { endTime: { lte: endTime } }
                        ]
                    },
                    {
                        // Existing appointment completely contains new appointment
                        AND: [
                            { startTime: { lte: startTime } },
                            { endTime: { gte: endTime } }
                        ]
                    }
                ],
            }
        });

        if (overlappingAppointments) {
            console.log("Overlapping appointment found:", overlappingAppointments);
            throw new Error("This time slot is already booked");
        }

        console.log("No overlapping appointments found");

        // Create video session
        console.log("Creating video session...");
        const sessionId = await createVideoSession();
        console.log("Video session created:", sessionId);

        // Deduct credits
        console.log("Deducting credits...");
        const { success, error: creditError } = await deductCreditsForAppointment(
            patient.id,
            doctor.id
        );

        if (!success) {
            throw new Error(creditError || "Failed to deduct credits");
        }

        console.log("Credits deducted successfully");

        // Creating appointment with the video session id
        console.log("Creating appointment record...");
        const appointment = await db.appointment.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                startTime,
                endTime,
                patientDescription,
                status: "SCHEDULED",
                videoSessionId: sessionId
            }
        });

        console.log("Appointment created successfully:", appointment.id);

        revalidatePath("/appointments");
        revalidatePath("/doctors");

        return { success: true, appointment: appointment };

    } catch (error) {
        console.error("Booking error:", error);
        throw new Error(error.message || "Failed to book the appointment");
    }
}

async function createVideoSession() {
    try {
        console.log("Creating Vonage video session...");
        
        if (!process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID || !process.env.VONAGE_PRIVATE_KEY) {
            throw new Error("Vonage credentials not configured");
        }

        const session = await vonage.video.createSession({ mediaMode: "routed" });
        
        console.log("Vonage session created successfully");
        return session.sessionId;
    
    } catch (error) {
        console.error("Failed to create video session:", error);
        throw new Error("Failed to create a video session");
    }
}

//Server action to generate the video token for consultation

export async function generateVideoToken(formData){
    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized");
    }

    try {

        const user = await db.user.findUnique({
            where:{
                clerkUserId: userId,
            },
        });

        if(!user){
            throw new Error("User not found");
        }

        const appointmentId = formData.get("appointmentId");

        const appointment = await db.appointment.findUnique({
            where:{
                id: appointmentId,
            },
        });

        if(!appointment){
            throw new Error("Appointment not found");
        }

        if(appointment.doctorId !== user.id && appointment.patientId !== user.id){
            throw new Error("You are not authorized to join this call");
        }

        if(appointment.status !== "SCHEDULED"){
            throw new Error("This appointment is not correctly scheduled");
        }


        // Verify the appointment is within a valid time range (e.g., starting 5 minutes before scheduled time)
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const timeDifference = (appointmentTime - now) / (1000 * 60); // difference in minutes

    if (timeDifference > 30) {
      throw new Error(
        "The call will be available 30 minutes before the scheduled time"
      );
    }

    // Generate a token for the video session
    // Token expires 2 hours after the appointment start time
    const appointmentEndTime = new Date(appointment.endTime);
    const expirationTime =
      Math.floor(appointmentEndTime.getTime() / 1000) + 60 * 60; // 1 hour after end time

    // Use user's name and role as connection data
    const connectionData = JSON.stringify({
      name: user.name,
      role: user.role,
      userId: user.id,
    });

    const token = vonage.video.generateClientToken(appointment.videoSessionId, {
        role: "publisher",
        expireTime: expirationTime,
        data: connectionData,
    });

    await db.appointment.update({
        where:{
            id: appointmentId,
        },

        data:{
            videoSessionToken: token
        }
    });

    return{
        success: true,
        videoSessionId: appointment.videoSessionId,
        token: token,
    };


        
    } catch (error) {
        throw  new Error("Failed to generate the video token" + error.message);
    }
}