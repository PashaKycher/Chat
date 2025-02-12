import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'

const EditUserDetails = ({ onClose, user }) => {
    // data of user from sidebar
    const [data, setData] = useState({
        name: user?.name,
        profile_pic: user?.profile_pic,
        lastName: user?.lastName,
        city: user?.city,
        phone: user?.phone,
    })
    const uploadPhotoRef = useRef()
    const dispatch = useDispatch()
    // triger when user change
    useEffect(() => {
        setData((preve) => {
            // const { socketConnection, ...userData } = user || {};
            return {
                ...preve,
                ...user
            }
        })
    }, [user])

    const handleOpenUploadPhoto = (e) => {
        e.stopPropagation()
        e.preventDefault()
        uploadPhotoRef.current.click()
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((preve) => {
            return {
                ...preve,
                [name]: value,
            }
        })
    }

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0]
        const uploadPhoto = await uploadFile(file)
        setData((preve) => {
            return {
                ...preve,
                profile_pic: uploadPhoto?.url
            }
        })
    }

    const handleSubmit = async (e) => {
        const { socketConnection, ...restData } = data;
        e.stopPropagation()
        e.preventDefault()
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`
            const res = await axios({
                method: 'post',
                url: URL,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                data: restData,
                withCredentials: true
            })
            toast.success(res?.data?.message)
            if(res.data.success){
                dispatch(setUser(res.data.data))
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
        onClose()
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40
                        flex justify-center items-center z-10'>
            <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>Profile Details</h2>
                <p className='text-sm'>Edit user details</p>
                {/* form */}
                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    {/* information about user */}
                    <div className='flex flex-col gap-1'>
                        {/* name */}
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primery border-0.5'
                        />
                        {/* last name */}
                        <label htmlFor='lastName'>Last Name:</label>
                        <input
                            type='text'
                            name='lastName'
                            id='lastName'
                            value={data.lastName}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primery border-0.5'
                        />
                        {/* city */}
                        <label htmlFor='city'>City:</label>
                        <input
                            type='text'
                            name='city'
                            id='city'
                            value={data.city}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primery border-0.5'
                        />
                        {/* phone */}
                        <label htmlFor='phone'>Phone:</label>
                        <input
                            type='text'
                            name='phone'
                            id='phone'
                            value={data.phone}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primery border-0.5'
                        />
                    </div>
                    {/* photo */}
                    <div>
                        <div>Photo</div>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar
                                width={40}
                                height={40}
                                imageUrl={data.profile_pic}
                                name={data?.name}
                            />
                            <label htmlFor='profile_pic'>
                                <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                                <input
                                    type='file'
                                    id='profile_pic'
                                    className='hidden'
                                    onChange={handleUploadPhoto}
                                    ref={uploadPhotoRef}
                                />
                            </label>
                        </div>
                    </div>
                    {/* line */}
                    <Divider />
                    {/* buttons */}
                    <div className='flex justify-between'>
                        <button
                            onClick={onClose}
                            className='border-primery border px-4 py-1 text-primery rounded
                                       hover:bg-primery hover:text-white'>Cancel</button>
                        <button
                            onClick={handleSubmit}
                            className='border-primery bg-primery text-white border 
                                       hover:bg-secondary px-6 py-1 rounded'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(EditUserDetails)