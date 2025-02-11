import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { LuArrowUpLeft } from "react-icons/lu";
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { logout } from '../redux/userSlice';

const Sidebar = () => {
    // get user from state
    const user = useSelector(state => state?.user)
    // socket
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    // FROM whom message
    const [allUser, setAllUser] = useState([])
    // loaders and button
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [openSerchUser, setOpenSerchUser] = useState(false)
    // logout
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(logout()) 
        navigate('/email')
        localStorage.clear()
    }


    useEffect(() => {
        if (socketConnection) {
            // send to back corect user id
            socketConnection.emit('sidebar', user._id)
            // get from back all user which who exist message
            socketConnection.on('conversation', (data) => {
                // get arrey whis whom hew message
                const conversationUserData = data.map((conversationUser, index) => {
                    if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                        return { ...conversationUser, userDetails: conversationUser?.sender }
                    }
                    else if (conversationUser?.receiver?._id !== user?._id) {
                        return { ...conversationUser, userDetails: conversationUser.receiver }
                    } else {
                        return { ...conversationUser, userDetails: conversationUser.sender }
                    }
                })
                setAllUser(conversationUserData)
            })
        }
    }, [socketConnection, user])

    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
            {/* side bar */}
            <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 
                          text-slate-600 flex flex-col justify-between'>
                {/* icons message and add friend */}
                <div>
                    {/* icon message */}
                    <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center 
                                          items-center cursor-pointer hover:bg-slate-200 
                                          rounded ${isActive && "bg-slate-200"}`} title='chat'>
                        <IoChatbubbleEllipses size={25} />
                    </NavLink>
                    {/* icon add friend */}
                    <div className='w-12 h-12 flex justify-center items-center cursor-pointer 
                                hover:bg-slate-200 rounded'
                        title='add friend'
                        onClick={() => setOpenSerchUser(true)}
                    >
                        <FaUserPlus size={25} />
                    </div>
                </div>
                {/* icon user profile and logout */}
                <div className='flex flex-col items-center'>
                    {/* user profile */}
                    <button className='mx-auto' title={user?.name} onClick={() => setEditUserOpen(true)}>
                        <Avatar width={40} height={40} name={user?.name} imageUrl={user?.profile_pic} userId={user?._id} />
                    </button>
                    {/* logout */}
                    <button onClick={handleLogout}
                        className='w-12 h-12 flex justify-center items-center cursor-pointer 
                                hover:bg-slate-200 rounded' title='logout'>
                        <span className='-ml-2'><BiLogOut size={25} /></span>
                    </button>
                </div>
            </div>
            {/* pat where show all message whith whom you have message */}
            <div className='w-full'>
                {/* header "Message" */}
                <div className='h-16 flex items-center'>
                    <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
                </div>
                {/* line */}
                <Divider />
                {/* all user whith whom you have message */}
                <div className='h-[calc(100vh-73px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {/* If dodn't have any message */}
                    {
                        allUser.length === 0 && (
                            <div className='mt-20'>
                                <div className='flex justify-center items-center my-4 text-slate-500'>
                                    <LuArrowUpLeft size={50} />
                                </div>
                                <p className='text-lg text-center text-slate-400'>
                                    Explore users to start a conversation with.
                                </p>
                            </div>
                        )
                    }
                    {/* If have any message */}
                    {
                        allUser.length > 0 && (
                            allUser.map((conv, index) => {
                                return (
                                    <NavLink to={'/' + conv?.userDetails?._id}
                                        key={conv?._id}
                                        className='flex items-center gap-2 px-2 py-3 border rounded cursor-pointer
                                        border-transparent hover:border-primery hover:bg-slate-100'>
                                        {/* image of user */}
                                        <div>
                                            <Avatar width={40} height={40}
                                                imageUrl={conv?.userDetails?.profile_pic}
                                                name={conv?.userDetails?.profile_pic}
                                            />
                                        </div>
                                        {/* info of message */}
                                        <div>
                                            <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                            <div className='text-slate-500 text-xs flex items-center gap-2'>
                                                <div>
                                                    {/* icon image */}
                                                    {
                                                        conv?.lastMessage?.imageUrl && (
                                                            <div className='flex items-center gap-2'>
                                                                <span><FaImage /></span>
                                                                {!conv?.lastMessage?.text && <span>Image</span>}
                                                            </div>
                                                        )
                                                    }
                                                    {/* icon video */}
                                                    {
                                                        conv?.lastMessage?.videoUrl && (
                                                            <div className='flex items-center gap-2'>
                                                                <span><FaVideo /></span>
                                                                {!conv?.lastMessage?.text && <span>Video</span>}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                {/* text message */}
                                                <p className='text-ellipsis line-clamp-1'>{conv?.lastMessage?.text}</p>
                                            </div>
                                        </div>
                                        {/* circle unseen message */}
                                        {
                                            conv?.unseenMsg > 0 && (
                                                <p className='ml-auto text-xs p-1 bg-primery text-white rounded-full
                                                    flex items-center w-6 h-6 justify-center'>
                                                    {conv?.unseenMsg}
                                                </p>
                                            )
                                        }
                                    </NavLink>
                                )
                            })
                        )
                    }
                </div>
            </div>
            {/* edit user details */}
            {
                editUserOpen && (
                    <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
                )
            }
            {/* search user */}
            {
                openSerchUser && (
                    <SearchUser onClose={() => setOpenSerchUser(false)} />
                )
            }
        </div>
    )
}

export default Sidebar