"use server";

import { db } from "@/lib/prisma";

export async function getDoctorBySpecialty(specialty) {

    try {

        const doctors = await db.user.findMany({
            where:{
                role: "DOCTOR" ,
                verificationStatus: "VERIFIED",
                specialty: specialty.split("%20").join(" "),
            },
            
            orderBy: {
                name: "asc",
            },

        });

        return {doctors};
        
    } catch (error) {

        console.error("Failed to fetch doctors by speciality" , error);
        return {error : "Failed to fetch doctors"};
        
    }
    
}