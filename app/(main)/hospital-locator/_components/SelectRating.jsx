import React from 'react'
import { Badge } from '@/components/ui/badge'
import Data from '../_data/Data'

const SelectRating = () => {
  return (
    <div className='mt-5'>
      <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium">
        <h3 className='text-2xl font-semibold'> Ratings
        </h3>
      </Badge>

       <div className='mt-4'>
            {Data.ratingList.map((item) => (
                <div className='flex justify-between'>
                    <label>{item.icon}</label>
                    <input type="checkbox" />
                </div>
            ))}
        </div>
    </div>
  )
}

export default SelectRating
