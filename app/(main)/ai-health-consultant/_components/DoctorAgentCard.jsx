import Image from 'next/image'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from 'lucide-react'

const DoctorAgentCard = ({ DoctorAgent }) => {
  return (
    <Card className="overflow-hidden">
      <div className="w-full">
        <Image 
          src={DoctorAgent.image}
          alt={DoctorAgent.specialist}
          width={400}
          height={350}
          className="w-full h-[320px] object-cover object-top"
        />
      </div>
             
      <CardContent className="p-6">
        <h2 className="font-semibold text-lg mb-2 gradient-title">
          {DoctorAgent.specialist}
        </h2>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {DoctorAgent.description}
        </p>

        <Button className="w-full mt-4 cursor-pointer">Start Consultation <ArrowRightIcon className='h-5 w-5 ml-3' /> </Button>
                      
      </CardContent>
     </Card>
  )
}

export default DoctorAgentCard