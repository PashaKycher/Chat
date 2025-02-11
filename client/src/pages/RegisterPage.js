import React, { useState } from 'react'
import { IoClose } from "react-icons/io5"
import { Link, useNavigate } from 'react-router-dom'
import uploadFile from '../helpers/uploadFile'
import axios from 'axios'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [data, setData] = useState({
    name: '',
    lastName: '',
    city: '',
    email: '',
    phone: '',
    password: '',
    profile_pic: ''
  })
  const [uploadPhoto, setUploadPhoto] = useState('')
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

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]
    const uploadPhoto = await uploadFile(file)
    setUploadPhoto(file)
    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }
    })
  }

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handelSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`
    try {
      const res = await axios.post(URL, data)
      toast.success(res?.data?.message)
      if (res?.data?.success) {
        setData({
          name: '',
          lastName: '',
          city: '',
          email: '',
          phone: '',
          password: '',
          profile_pic: ''
        })
        setUploadPhoto(null)
        navigate('/email')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto'>
        <h3 className='w-fit ml-auto'>Welcome to Chat App!</h3>
        {/* form */}
        <form className='grid gap-4 mp-5' onSubmit={handelSubmit}>
          {/* name */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>First name* :</label>
            <input type='text' name='name' id='name' placeholder='enter your First name'
              className='bg-slate-100 px-2 py-1 focus:outline-primery'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
          {/* last name */}
          {/* <div className='flex flex-col gap-1'>
            <label htmlFor='lastName'>Last name :</label>
            <input type='text' name='lastName' id='lastName' placeholder='enter your Last name'
              className='bg-slate-100 px-2 py-1 focus:outline-primery'
              value={data.lastName}
              onChange={handleOnChange}
              required
            />
          </div> */}
          {/* city */}
          {/* <div className='flex flex-col gap-1'>
            <label htmlFor='city'>City :</label>
            <input type='text' name='city' id='city' placeholder='enter your City'
              className='bg-slate-100 px-2 py-1 focus:outline-primery'
              value={data.city}
              onChange={handleOnChange}
              required
            />
          </div> */}
          {/* email */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email* :</label>
            <input type='email' name='email' id='email' placeholder='enter your Email'
              className='bg-slate-100 px-2 py-1 focus:outline-primery'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          {/* phone */}
          {/* <div className='flex flex-col gap-1'>
            <label htmlFor='phone'>Phone :</label>
            <input type='phone' name='phone' id='phone' placeholder='enter your Phone'
              className='bg-slate-100 px-2 py-1 focus:outline-primery'
              value={data.phone}
              onChange={handleOnChange}
              required
            />
          </div> */}
          {/* password */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password* :</label>
            <input type='password' name='password' id='password' placeholder='enter your Password'
              className='bg-slate-100 px-2 py-1 focus:outline-primery'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          {/* photo */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='profile_pic'>Photo :
              <div className='h-14 bg-slate-200 flex justify-center rounded 
                              items-center hover:cursor-pointer
                              hover:border-2 hover:border-primery'
              >
                <p className='text-sm max-w-[300px] text-eclipsis line-clamp-1'>
                  {uploadPhoto?.name ? uploadPhoto?.name : 'Upload profile photo'}
                </p>
                {
                  uploadPhoto?.name &&
                  <button className='text-lg ml-2 hover:text-red-600'
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                }
              </div>
            </label>
            <input type='file' name='profile_pic' id='profile_pic'
              className='bg-slate-100 px-2 py-1 focus:outline-primery hidden'
              onChange={handleUploadPhoto}
            />
          </div>
          {/* register */}
          <button
            className='bg-primery text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white'
          >
            Register
          </button>
        </form>
        {/* login */}
        <p className='my-3 text-center'>
          Already have an account ?
          <Link className='hover:text-primery font-semibold' to={'/email'}>  Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage