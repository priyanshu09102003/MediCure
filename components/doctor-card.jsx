import React from 'react'
import { Card, CardContent } from './ui/card'
import { Calendar, Stethoscope } from 'lucide-react'
import { Badge } from './ui/badge'
import { Star } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

const DoctorCard = ({doctor}) => {
  return (
    <Card className="border-emerald-900/20 hover:border-emerald-400/30 transition-all cursor-pointer">
      
      <CardContent className="p-6">
        <div className='flex items-start gap-5'>

          <div className='relative flex-shrink-0'>
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center shadow-lg ring-1 ring-emerald-500/20'>
              {doctor.imageUrl ? (
                <img 
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className='w-16 h-16 rounded-2xl object-cover'
                />
              ) : (
                <Stethoscope className='h-7 w-7 text-emerald-400' />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
 
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-xl leading-tight truncate">
                  {doctor.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1 font-medium">
                  {doctor.specialty}
                </p>
              </div>
              
              <Badge
                variant="outline"
                className="bg-emerald-500/10 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 font-medium shadow-sm"
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                Verified
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <p className="text-sm text-slate-300 font-medium">
                {doctor.experience} years experience
              </p>
            </div>


            <div className="mb-6">
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                {doctor.description}
              </p>
            </div>

            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 group/btn border-0 relative overflow-hidden"
            >
              <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                <Calendar className='h-4 w-4 mr-2.5 relative z-10' />
                <span className="relative z-10">Book Appointment</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DoctorCard