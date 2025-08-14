"use client";

import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, Stethoscope } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

const AddNotes = () => {
    const [note , setNote] = useState();
    
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button className="cursor-pointer bg-emerald-400 hover:bg-emerald-500"> <Stethoscope className='h-5 w-5' /> Find your Specialist</Button>
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
            <DialogTitle>Tell us your symptoms</DialogTitle>

            <DialogDescription asChild>
                <div>
                    Share your symptoms or concerns with us, and we’ll help you find the right specialist for your needs
                    
                    <Textarea placeholder = "Describe your issue here..."   className="h-[120px] mt-4 shadow-2xl" 
                    onChange = {(e) => setNote(e.target.value)}
                    />
                </div>
            </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <DialogClose asChild><Button variant="destructive" className="cursor-pointer">Cancel</Button></DialogClose>

                <Button className="cursor-pointer" disabled = {!note}>Find Specialist <ArrowRightIcon className='h-5 w-5' /></Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddNotes
