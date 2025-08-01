import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Medal, User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const DoctorProfileComponent = ({doctor , availableDays}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {/* Left Section - FIXED - showing doctor image */}

      <div className='md:col-span-1'>

        <div className='md:sticky md:top-24'>

            <Card className="border-emerald-700/40">
                <CardContent className="pt-6">
                    <div className='flex flex-col items-center text-center'>
                        <div className='relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-emerald-900/20'>

                        {
                            doctor.imageUrl?(
                                <Image
                                    src={doctor.imageUrl}
                                    alt={doctor.name}
                                    fill
                                    className='object-cover'
                                />
                            ) :(
                                <div className='w-full h-full flex items-center justify-center'>

                                    <User className='h-16 w-16 text-emerald-400' />

                                </div>
                            )
                        }

                        </div>

                        <h2 className='text-xl font-bold text-white mb-3'>
                            Dr. {doctor.name}
                        </h2>

                        <Badge className="bg-emerald-900/20 border-emerald-900/30 text-emerald-400 mb-4" variant="outline">

                            {doctor.specialty}

                        </Badge>

                        <div className='flex items-center justify-center mb-3'>
                            <Medal className='h-5 w-5 text-emerald-400 mr-2' />
                            <span className='text-muted-foreground'>
                                {doctor.experience} years of experience
                            </span>
                        </div>

                    </div>
                </CardContent>
            </Card>

        </div>
      </div>



      {/* Right Section - Movable - showing the availability slots */}

      <div className='md:col-span-2 space-y-6'>

      </div>

    </div>
  )
}

export default DoctorProfileComponent
