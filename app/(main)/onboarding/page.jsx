"use client";

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod"
import z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Stethoscope, User } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { setUserRole } from '@/actions/onboarding';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SPECIALTIES } from '@/lib/speciality';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';



//Schema of the doctor form using react Hook form and ZOD

const doctorFormSchema = z.object({
    speciality: z.string().min(1, "This field is required"),
    experience: z.number().min(1, "Experience must be atleast 1 year").max(70 , "Experience must be less than 70 years"),
    credentialUrl: z.string().url("Please enter a valid URL").min(1, "This field is required"),

    description: z.string().min(20, "Description must be atleast 20 characters").max(1000, "Description cannot exceed more than 1000 characters")
});

const OnboardingPage = () => {

    


    const [step, setStep] = useState("choose-role");

    const router = useRouter();

    const {data , fn:submitUserRole, loading} = useFetch(setUserRole);

   const {register , handleSubmit, formState:{errors}, setValue , watch} = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues:{
        speciality: "",
        experience: undefined,
        credentialUrl: "",
        description: ""
    }
   });

   const specialityValue = watch("speciality");

   const handlePatientSelection = async () => {
    if(loading) return;

    const formData = new FormData();

    formData.append("role" , "PATIENT");

    await submitUserRole(formData);
   };

   useEffect(() => {

    if(data && data?.success){

        toast.success("Role Selected!")
        router.push(data.redirect);
    }

   } , [data])

   const onDoctorSubmit = async(data) =>{
        console.log("Form data:", data); // Debug log
        console.log("Errors:", errors); // Debug log

        if(loading) return;

        const formData = new FormData();

        formData.append("role" , "DOCTOR");
        formData.append("speciality" , data.speciality);
        formData.append("experience" , data.experience.toString());
        formData.append("credentialUrl" , data.credentialUrl);
        formData.append("description" , data.description);

        await submitUserRole(formData);
   }

   
   if(step === "choose-role"){

    return(
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            <Card className="border-emerald-900/20 hover:border-emerald-600/40 cursor-pointer transition-all"
            onClick={() => !loading && handlePatientSelection()}
            >
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">

                    <div className='p-4 bg-emerald-900/20 rounded-full mb-4'>
                         <User className='h-8 w-8 text-emerald-400' />

                    </div>

                    <CardTitle className="text-xl font-semibold text-white mb-3 gradient-title">Join as a Patient</CardTitle>

                    <CardDescription className="mb-4">
                        Book doctor appointments instantly, consult AI health assistants 24/7, and manage your health smarter than before.
                    </CardDescription>

                    <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" disabled={loading}>
                        {loading ? (<>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                        Submitting your request...
                    </>) : (
                       " Continue as Patient"
                    )}
                    </Button>
                </CardContent>
            </Card>


            <Card className="border-emerald-900/20 hover:border-emerald-600/40 cursor-pointer transition-all"
            onClick = {() => !loading && setStep("doctor-form")}>

                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">

                    <div className='p-4 bg-emerald-900/20 rounded-full mb-4'>
                         <Stethoscope className='h-8 w-8 text-emerald-400' />

                    </div>

                    <CardTitle className="text-xl font-semibold text-white mb-3 gradient-title">Join as a Doctor</CardTitle>

                    <CardDescription className="mb-4">
                        Create your professional profile, set your availability and provide consultation to your patients.
                    </CardDescription>

                    <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" disabled = {loading}>Continue as Doctor</Button>
                </CardContent>
            </Card>
        </div>
    );

   }

   if(step === "doctor-form"){
    return (
        <Card className="border-emerald-900/20">
            <CardContent className="pt-6">
                <div className='mb-6'>
                    <CardTitle className="text-2xl md:text-3xl font-bold mb-3 text-white">Complete Your Profile</CardTitle>
                    <CardDescription>
                        Please provide your professional details for the verification process
                    </CardDescription>
                </div>

                <form className='space-y-6' onSubmit={handleSubmit(onDoctorSubmit)}>

                        <div className='space-y-3'>

                            <Label htmlFor="speciality">Medical Speciality</Label>

                            <input type="hidden" {...register("speciality")} />

                            <Select 
                            value = {specialityValue}
                            onValueChange = {(value) => setValue("speciality" , value, { shouldValidate: true })}>

                                <SelectTrigger id="speciality">
                                    <SelectValue placeholder="Select your speciality" />
                                </SelectTrigger>

                                <SelectContent>
                                    {SPECIALTIES.map((spec) => {
                                        return(
                                            <SelectItem 
                                            key={spec.name}
                                            value = {spec.name}
                                            >

                                                <div className="flex items-center gap-2">

                                                    <span className='text-emerald-400'>{spec.icon}</span>

                                                    {spec.name}

                                                </div>
                                                
                                                
                                                </SelectItem>
                                        )
                                        
                                        

                                    })}
                                    
                                </SelectContent>
                            </Select>

                            {errors.speciality && <p className='text-sm font-medium text-red-500 mt-1'>{errors.speciality.message}</p>}

                        </div>

                         <div className='space-y-3'>

                            <Label htmlFor="experience">Years of Experience</Label>

                            <Input id="experience" type="number" placeholder="Enter your years of experience"
                             {...register("experience" , {
                                valueAsNumber: true,
                                setValueAs: (value) => value === "" ? undefined : Number(value)
                             })}                           
                            />

                            

                            {errors.experience && <p className='text-sm font-medium text-red-500 mt-1'>{errors.experience.message}</p>}

                        </div>

                        <div className='space-y-3'>

                            <Label htmlFor="credentialUrl">Link to Credential URL </Label>

                            <Input id="credentialUrl" type="url" placeholder="Eg: https://example.com/my-medical-degree.pdf"
                             {...register("credentialUrl")}                           
                            />

                            

                            {errors.credentialUrl && <p className='text-sm font-medium text-red-500 mt-1'>{errors.credentialUrl.message}</p>}

                            <p className='text-sm text-muted-foreground'>
                                Please provide the link to your medical degree/license/certification for the verification process
                            </p>

                        </div>

                         <div className='space-y-3'>

                            <Label htmlFor="description">A short description about yourself</Label>

                            <Textarea id="description" 
                            placeholder="Describe your expertise, services and your approach to patient care..."
                             {...register("description")}                           
                            />

                            

                            {errors.description && <p className='text-sm font-medium text-red-500 mt-1'>{errors.description.message}</p>}

                        </div>
                    

                    <div className='pt-2 flex items-center justify-between'>
                        <Button variant="secondary" disabled={loading} onClick={() => setStep("choose-role")} type="button" className="cursor-pointer">
                              <ArrowLeft className='h-4 w-4' />  Back
                        </Button>
                        
                        
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer" disabled={loading}>
                        
                        {loading ? 
                                (<>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                Submitting...
                            </>) : 
                            (
                                "Submit for Verification"
                            )}

                        </Button>
                    </div>



                </form>
            </CardContent>
        </Card>
    )
   }
}

export default OnboardingPage