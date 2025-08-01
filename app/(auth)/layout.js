import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex justify-center pt-30 mb-6'>
      {children}
    </div>
  )
}

export default AuthLayout;
