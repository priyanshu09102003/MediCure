import PageHeader from '@/components/page-header';
import { MapIcon } from 'lucide-react';
import React from 'react'
import CategoryList from './_components/categoryList';
import RangeSelector from './_components/RangeSelector';
import SelectRating from './_components/SelectRating';

const HospitalLocatorPage = () => {
  return (
    <section>
      <div className='container mx-auto py-24'>
        <PageHeader 
          icon={<MapIcon />}
          title="Medical Facilities"
          backLink='/'
          backLabel='Back'
        />
        
        {/* Desktop Layout */}
        <div className='hidden lg:grid lg:grid-cols-4 h-screen gap-6'>
          {/* Options */}

          <div className='col-span-1'>
            <CategoryList />
            <RangeSelector />
            <SelectRating />
          </div>
          {/* Realtime-Map */}
          <div className='col-span-3'>
            Map Integration
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className='lg:hidden space-y-8'>
          {/* Categories Section */}
          <div>
            <CategoryList />
            <RangeSelector />
            <SelectRating />
          </div>

          {/* Map Section */}
          <div className='h-96 bg-gray-800 rounded-lg flex items-center justify-center text-gray-200'>
            Map Integration
          </div>
        </div>
      </div>
    </section>
  )
}

export default HospitalLocatorPage;