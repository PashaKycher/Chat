import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { PiUserCircle } from "react-icons/pi";

const CheckEmailPage = () => {

  const [data, setData] = useState({
    email: ''
  })
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handelSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
      const res = await axios.post(URL, data)
      toast.success(res?.data?.message)
      if (res?.data?.success) {
        setData({
          email: ''
        })
        navigate('/password', { state: res?.data?.data  })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto'>
        <div>
          <PiUserCircle className='text-primery text-6xl mx-auto mb-2' />
        </div>

        <h3>Welcome to Chat App!</h3>

        <form className='grid gap-4 mp-5' onSubmit={handelSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email :</label>
            <input type='email' name='email' id='email' placeholder='enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primery'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className='bg-primery text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white'
          >
            Let's Go
          </button>
        </form>

        <p className='my-3 text-center'>
          New User ?
          <Link className='hover:text-primery font-semibold' to={'/register'}>  Register</Link>
        </p>
      </div>
    </div>
  )
}

export default CheckEmailPage