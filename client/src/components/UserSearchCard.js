import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({ user, onClose }) => {
    return (
        <Link to={"/"+user?._id} onClick={onClose} className='flex items-center gap-4 p-2 lg:p-4
                        border border-transparent border-b-slate-200
                        hover:border hover:border-primery
                        rounded cursor-pointer'>
            <div className='rounded-full shadow'>
                <Avatar
                    width={40}
                    height={40}
                    name={user?.name}
                    imageUrl={user?.profile_pic}
                    userId={user?._id}
                />
            </div>
            <div>
                <div className='font-semibold text-ellipsis line-clamp-1'>
                    {user?.name}
                </div>
                <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
            </div>
        </Link>
    )
}

export default UserSearchCard