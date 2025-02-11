import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Avatar from '../components/Avatar'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handelSubmit = async (e) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`
    try {
      const res = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
        },
        withCredentials: true
      })
      toast.success(res?.data?.message)
      if (res?.data?.success) {
        navigate('/email')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto'>
          <div className='flex justify-center w-fit mx-auto mb-2 items-center flex-col'>
            <Avatar
              width={40}
              height={40}
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
            />
            <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
            <h2 className='font-semibold text-lg mt-1'>You new password: 456789</h2>
          </div>
          {/* login */}
          <p className='my-3 text-center'>
            Try to login:
            <span className='hover:text-primery font-semibold' onClick={handelSubmit}>  Login</span>
          </p>
        </div>
      </div>
      )
}

      export default ForgotPassword