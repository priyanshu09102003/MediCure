import { Card, CardContent } from '@/components/ui/card'
import { SPECIALTIES } from '@/lib/speciality'
import Link from 'next/link'
import React from 'react'

const SpecialitiesPage = () => {
  return (
    <>

        <div className='flex flex-col items-center justify-center mb-8 text-center'>
            <h1 className='text-3xl md:text-4xl font-bold gradient-title mb-3'>Find Your Doctor</h1>
            <p className='text-muted-foreground text-lg'>
                Find Your Perfect Doctor by Specialty
            </p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>

            {SPECIALTIES.map((specialty) => (
                <Link key={specialty.name} href={`/doctors/${specialty.name}`}>

                    <Card className="hover:border-white transition-all cursor-pointer border-emerald-900/20 h-full">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                            <div className='w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4'>
                                <div>{specialty.icon}</div>
                            </div>

                            <h3 className='font-medium text-white'>{specialty.name}</h3>
                        </CardContent>
                    </Card>

                </Link>
            ))}

        </div>
      
    </>
  )
}

export default SpecialitiesPage
