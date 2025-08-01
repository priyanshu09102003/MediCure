import { getCurrentUser } from '@/actions/onboarding';
import React from 'react'
import { redirect } from 'next/navigation';

export const metadata = {
    title: "Onboarding - MediCure",
    description: "Complete your profile to start with MediCure"
};

const OnboardingLayout = async ({children}) => {

    const user = await getCurrentUser();

    if(user){
        if(user.role === "PATIENT"){
            redirect("/doctors");
        } else if(user.role === "DOCTOR"){
            if(user.verificationStatus === "VERIFIED"){
                redirect("/doctor");
            }

            else{
                redirect("/doctor/verification");
            }
        }

        else if (user.role === "ADMIN"){
            redirect("/admin");
        }
    }

  return (



    <div className='container mx-auto px-4 py-26'>

        <div className='max-w-3xl mx-auto'>

            <div className='text-center mb-10'>
                <h1 className='text-3xl md:text-4xl font-bold gradient-title mb-2'>Welcome to MediCure</h1>
                <p className='text-muted-foreground text-lg'>Tell us how you want to use the platform</p>
            </div>

             {children}
        </div>
     
    </div>
  )
}

export default OnboardingLayout;
