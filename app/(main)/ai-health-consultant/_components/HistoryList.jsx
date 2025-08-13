"use client";

import Image from 'next/image';
import React, { useState } from 'react'

const HistoryList = () => {
    const [historyList , setHistoryList] = useState([]);

  return (
    <div className='mt-10'>
        {historyList.length == 0?
        (
            <div className='flex items-center flex-col justify-center p-7 border-2 border-dashed rounded-2xl'>
                <Image src={'/medical.png'} alt='medical-list' width={150} height={150}     />

                <h2 className='font-semibold text-xl mt-2'>No Recent Consultations</h2>
                <p className='text-muted-foreground text-sm'>Start an instant consultation now for an immediate checkup</p> 

            </div>
        ) : (

            <div>
                List
            </div>
        )
    }
      
    </div>
  )
}

export default HistoryList
