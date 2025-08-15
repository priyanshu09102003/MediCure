"use client";

import React, { useState } from 'react'
import Data from '../_data/Data';
import Image from 'next/image';

const CategoryList = () => {
    const [categoryList , setCategoryList] = useState(Data.CategoryListData);
    const [selectedCategory, setSelectedCategory] = useState();

  return (
    <div>
      <h2 className='font-semibold text-2xl'>Select Category</h2>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6 mt-6'>
        {categoryList.map((item, index) => (
            <div key={index} className={`flex flex-col justify-center items-center bg-gray-800 border border-gray-700 rounded-lg p-3 lg:p-4 shadow-sm hover:shadow-lg hover:bg-gray-750  transition-all cursor-pointer w-full h-24 lg:h-28 grayscale hover:grayscale-0 ${selectedCategory==index?'grayscale-0' : null}`}
            
            onClick={() => setSelectedCategory(index)}
            >

                <Image src={item.icon}
                alt={item.name}
                height={40}
                width={40}
                className='lg:h-[60px] lg:w-[60px]'
                />
                
                <span className='text-xs lg:text-sm font-medium text-gray-200 mt-1 lg:mt-2 text-center'>{item.name}</span>

            </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList;