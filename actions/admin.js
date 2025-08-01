"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function verifyAdmin(){
    const {userId} = await auth();

    if(!userId){
        return false;
    }

    try {

        const user = await db.user.findUnique({
            where:{
                clerkUserId: userId
            },

        });

        return user?.role === "ADMIN";
        
    } catch (error) {
        console.error("Failer to verify admin" , error);

        return false;
    }
}

//function to get all the pending docs in the app

export async function getPendingDoctors(){

    const isAdmin = await verifyAdmin();

    if(!isAdmin) throw new Error("Unauthorized");

    try {

        const pendingDoctors = await db.user.findMany({
            where:{
                role: "DOCTOR",
                verificationStatus: "PENDING"
            },

            orderBy:{
                createdAt: "desc"
            }
        });

        return {doctors : pendingDoctors};
        
    } catch (error) {

        throw new Error("Failed to fetch pending doctors");
        
    }
}

//function to get all the verified docs in the app

export async function getVerifiedDoctors(){

     const isAdmin = await verifyAdmin();

    if(!isAdmin) throw new Error("Unauthorized");

    try {

        const verifiedDoctors = await db.user.findMany({
            where:{
                role: "DOCTOR",
                verificationStatus: "VERIFIED"
            },

            orderBy:{
                createdAt: "asc"
            }
        });

        return {doctors : verifiedDoctors};
        
    } catch (error) {

        throw new Error("Failed to fetch pending doctors");
        
    }


}


//function to update the Doctor Status

export async function updateDoctorStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const doctorId = formData.get("doctorId");
  const status = formData.get("status");

  if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
    throw new Error("Invalid input");
  }

  try {
    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    revalidatePath("/admin");
    return { success: true };


  } catch (error) {
    console.error("Failed to update doctor status:", error);
    throw new Error(`Failed to update doctor status: ${error.message}`);
  }
}

/**
 * Suspends or reinstates a doctor
 */
export async function updateDoctorActiveStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const doctorId = formData.get("doctorId");
  const suspend = formData.get("suspend") === "true";

  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }

  try {
    const status = suspend ? "PENDING" : "VERIFIED";

    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update doctor active status:", error);
    throw new Error(`Failed to update doctor status: ${error.message}`);
  }
}

