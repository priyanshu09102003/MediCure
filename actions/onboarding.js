"use server";


import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//Server action to set up the role of the user and update in the database(PATIENT or DOCTOR)
export async function setUserRole(formData){

  const {userId} = await auth();

  if(!userId){
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where:{
        clerkUserId: userId
    }
  });

  if(!user) throw new Error("User not found in the database");


  const role = formData.get("role");

  if(!role || !["PATIENT" , "DOCTOR"].includes(role)){
    throw new Error("Invalid role selection");
  }

  try {

    if(role === "PATIENT"){
        await db.user.update({
            where:{
                clerkUserId: userId
            },

            data:{
                role: "PATIENT",
            },
        });

        revalidatePath("/")
        return {success: true, redirect: "/doctors"};
    }

    if(role === "DOCTOR"){
        //Additional info doctor

        const specialty = formData.get("speciality");
        const experience = parseInt(formData.get("experience"), 10);
        const credentialUrl = formData.get("credentialUrl");
        const description = formData.get("description");

        if(!specialty || !experience || !credentialUrl || !description){
            throw new Error("All the fields are required");
        }

        await db.user.update({
            where:{
                clerkUserId: userId
            },

            data:{
                role: "DOCTOR",
                specialty,
                experience,
                credentialUrl,
                description,
                verificationStatus: "PENDING",
            }
        });

        revalidatePath("/");
        return {success: true , redirect: "/doctor/verification"};
    }
    
  } catch (error) {

    console.error("Couldn't set up user Role: " , error);
    throw new Error(`Failed to update the user profile: ${error.message}`);
    
  }
}



//Server action to get the current user's complete profile with all the information

export async function getCurrentUser() {

    const {userId} = await auth();

  if(!userId){
    throw new Error("Unauthorized");
  }

  try {

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return user;  } 
    
    catch (error) {

    console.error("Failed to get user information:", error);
    return null; 
    
  }
    
}