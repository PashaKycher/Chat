import React from 'react'
import { PiUserCircle } from "react-icons/pi"
import { useSelector } from 'react-redux'

const Avatar = ({ userId, name, imageUrl, width, height }) => {
    // get online users from state
    const onlineUsers = useSelector(state => state?.user?.onlineUser)
    const isOnline = onlineUsers?.includes(userId)
    // get first letter of name
    let avatarName = ""
    if (name) {
        const splitName = name.split(" ")
        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0]
        } else {
            avatarName = name[0][0]
        }
    }
    // random color bg for avatar
    const bgColor = [
        'bg-red-200',
        'bg-orange-200',
        'bg-yellow-200',
        'bg-green-200',
        'bg-blue-200',
        'bg-indigo-200',
        'bg-purple-200',
        'bg-pink-200'
    ]
    return (
        <div className='text-slate-800 rounded-full font-bold relative'
            style={{ width: width + "px", height: height + "px" }}
        >
            {/* Avatar show photo or name */}
            {
                // if photo exist
                imageUrl ?
                    (<img src={imageUrl} alt={name} width={width} height={height} className='overflow-hidden rounded-full h-10' />)
                    :
                    // if photo not exist
                    (name ?
                        (<div style={{ width: width + "px", height: height + "px" }}
                            className={`overflow-hidden rounded-full flex justify-center items-center text-lg shadow border
                                              ${bgColor[Math.floor(Math.random() * bgColor.length)]}`}
                        >{avatarName}</div>)
                        :
                        // if name not exist
                        (<PiUserCircle className='text-primery' size={width} />)
                    )
            }
            {/* Online or not */}
            {
                isOnline && (<div className='bg-green-600 p-1 rounded-full absolute bottom-2 -right-1 z-10'></div>)
            }

        </div>
    )
}

export default Avatar