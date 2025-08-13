import { Props } from 'next/script'
import React from 'react'

type DoctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string   
}

type props = {
  DoctorAgent : DoctorAgent
}

const DoctorAgentCard = ({DoctorAgent} : props) => {
  return (
    <div>
      Doctor Agent
    </div>
  )
}

export default DoctorAgentCard
