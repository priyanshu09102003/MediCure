"use client";

import React, { useState } from 'react'

const RangeSelector = () => {
  const [radius, setRadius] = useState(10);
  return (
    <div className='mt-6'>
      <h2 className='font-semibold text-2xl mb-6'>Select within Radius (in metres)</h2>

      <input type="range"
      className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
      min="0"
      max="100"
      step="10"
      onChange={(e) => setRadius(e.target.value)}
      defaultValue={radius}
      />

      <label className='text-muted-foreground text-[15px]'>{radius*10} Metres</label>
    </div>
  )
}

export default RangeSelector