import { AIDoctorAgents } from '@/data/list'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'

const DoctorAgents = () => {
  return (
    <div className='mt-10'>

        <h2 className='text-2xl font-semibold'> Your AI Doctor Specialists
        </h2>

        <div>
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
