import PageHeader from '@/components/page-header'
import { BrainCircuit, Stethoscope } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import HistoryList from './_components/HistoryList'
import DoctorAgents from './_components/DoctorAgents'
import AddNotes from './_components/AddNotes'

const AIHealthConsultants = () => {
  return (
    <div className='container mx-auto px-4 py-24 space-y-3'>
      <PageHeader 
      icon={<BrainCircuit/>}
      title= "AI Health Consultants"
      backLink='/'
      backLabel='Back'
      />

      <div className='flex justify-between items-center'> 
        <h2 className='text-2xl font-semibold'>My Dashboard </h2>
        <AddNotes />
      </div>

      <HistoryList />
      <DoctorAgents />
      
      
    </div>
  )
}

export default AIHealthConsultants
