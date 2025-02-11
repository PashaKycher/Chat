import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Avatar from '../components/Avatar'
import { useDispatch } from 'react-redux'
import { setToken } from '../redux/userSlice'

const CheckPasswordPage = () => {

  const [data, setData] = useState({
    password: ''
  })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email')
    }
  }, [])

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
      const res = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      })
      toast.success(res?.data?.message)

      if (res?.data?.success) {
        dispatch(setToken(res?.data?.token))
        localStorage.setItem("token", res?.data?.token)
        setData({
          password: ''
        })
        navigate(`/`) // navigator to user
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  const handelForgotPassword = () => {
    navigate('/forgot-password', { state: location?.state })
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
        </div>

        <form className='grid gap-4 mp-5' onSubmit={handelSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input type='password' name='password' id='password' placeholder='enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primery'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className='bg-primery text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white'
          >
            Login
          </button>
        </form>

        <p className='my-3 text-center hover:text-primery font-semibold' onClick={handelForgotPassword}>Forgot password ?</p>
      </div>
    </div>
  )
}

export default CheckPasswordPage
