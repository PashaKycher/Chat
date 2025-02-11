import React, { useEffect, useState } from 'react'
import { RiCloseLargeLine } from "react-icons/ri";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMailOpen } from "react-icons/io";
import { FaCity } from "react-icons/fa";

const UserDitails = ({ onClose, user }) => {
    // data of user from message page
    const [data, setData] = useState({
        profile_pic: user?.profile_pic,
        name: user?.name,
        lastName: user?.lastName,
        city: user?.city,
        email: user?.email,
        phone: user?.phone
    })
    // triger when user change
    useEffect(() => {
        setData((preve) => {
            return {
                ...preve,
                ...user
            }
        })
    }, [user])
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
            {/* button to close the window */}
            <div className='mx-auto w-12'>
                {/* button close */}
                <button>
                    <RiCloseLargeLine size={50} className='text-primery hover:text-red-600' onClick={onClose} />
                </button>
            </div>
            {/* ditails of user */}
            <div className='w-full max-w-md mx-auto mt-6 bg-slate-50 rounded'>
                {/* Photo */}
                <div className='p-2 flex'>
                    <img src={data?.profile_pic} alt="" className='h-30 m-auto' />
                </div>
                {/* first name */}
                <div className='flex items-center gap-2 pl-2'>
                    <p className='font-semibold w-1/5'>First name: </p>
                    {
                        data?.name ? (
                            <p className='text-ellipsis line-clamp-1 text-sm text-slate-600'>{data?.name}</p>
                        ) : (
                        <p className='text-ellipsis line-clamp-1 text-sm text-slate-400'>
                            Ops, dont have information about Name
                        </p>)
                    }
                </div>
                {/* last name */}
                <div className='flex items-center gap-2 pl-2'>
                    <p className='font-semibold w-1/5'>Last name: </p>
                    {
                        data?.lastName ? (
                            <p className='text-ellipsis line-clamp-1 text-sm text-slate-600'>{data?.lastName}</p>
                        ) : (
                            <p className='text-ellipsis line-clamp-1 text-sm text-slate-400'>
                                Ops, dont have information about Last name
                            </p>)
                    }
                </div>
                {/* city */}
                <div className='flex items-center gap-2 pl-2'>
                    <div className='font-semibold w-1/5 text-primery'><FaCity className='w-4 h-4 m-auto' /></div>
                    {
                        data?.city ? (
                            <p className='text-ellipsis line-clamp-1 text-sm text-slate-600'>{data?.city}</p>
                        ) : (
                        <p className='text-ellipsis line-clamp-1 text-sm text-slate-400'>
                            Ops, dont have information about City
                        </p>)
                    }
                </div>
                {/* email */}
                <div className='flex items-center gap-2 pl-2'>
                    <div className='font-semibold w-1/5 text-primery'><IoMdMailOpen className='w-4 h-4 m-auto' /></div>
                    {
                        data?.email ? (
                            <p className='text-ellipsis line-clamp-1 text-sm text-slate-600'>{data?.email}</p>
                        ) : (
                        <p className='text-ellipsis line-clamp-1 text-sm text-slate-400'>
                            Ops, dont have information about Email
                        </p>)
                    }
                </div>
                {/* phone */}
                <div className='flex items-center gap-2 pl-2'>
                    <div className='font-semibold w-1/5 text-primery'><FaPhoneAlt className='w-4 h-4 m-auto' /></div>
                    {
                        data?.phone ? (
                            <p className='text-ellipsis line-clamp-1 text-sm text-slate-600'>{data?.phone}</p>
                        ) : (
                        <p className='text-ellipsis line-clamp-1 text-sm text-slate-400'>
                            Ops, dont have information about Phone number
                        </p>)
                    }
                </div>
            </div>
        </div>
    )
}

export default UserDitails