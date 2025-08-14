import { AIDoctorAgents } from '@/data/list'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'
import { Badge } from '@/components/ui/badge'


const DoctorAgents = () => {
  return (
    <div className='mt-10'>

      <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium">
        <h2 className='text-2xl font-semibold'> Your AI Health Specialists
        </h2>
      </Badge>

        

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6'>
            {AIDoctorAgents.map((doctor, index) => (
                <div key={index}>
                    <DoctorAgentCard DoctorAgent={doctor} />
                </div>
            ))}
        </div>
      
    </div>
  )
}

export default DoctorAgents
