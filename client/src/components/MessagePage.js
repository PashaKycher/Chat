import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { RiCloseLargeLine } from "react-icons/ri";
import Loading from './Loading';
import background from '../assets/wallapaper.jpeg'
import { IoMdSend } from "react-icons/io";
import moment from 'moment'
import SearchUser from './SearchUser';
import UserDitails from './UserDitails';

const MessagePage = () => {
  // FROM whom message
  const user = useSelector(state => state?.user)
  //  TO whom message
  const params = useParams()
  // socket
  const socketConnection = useSelector(state => state.user.socketConnection)
  // loader and upload
  const [loading, setLoading] = useState(false)
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const [openDitailsUser, setOpenDitailsUser] = useState(false)
  // show last message
  const currentMessage = useRef(null)
  // info for who message
  const [dataUser, setDataUser] = useState({
    name: '',
    email: '',
    profile_pic: '',
    online: false,
    _id: '',
    city: '',
    phone: '',
    lastName: ''
  })
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: ''
  })
  // button image and video
  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(preve => !preve)
  }
  // Image
  const handelUploadImage = async (e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadImage = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage((preve) => ({
      ...preve,
      imageUrl: uploadImage?.url
    }))
  }
  const handelClearUploadImage = () => {
    setMessage((preve) => ({
      ...preve,
      imageUrl: ''
    }))
  }
  // Video
  const handelUploadVideo = async (e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadVideo = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage((preve) => ({
      ...preve,
      videoUrl: uploadVideo?.url
    }))
  }
  const handelClearUploadVideo = () => {
    setMessage((preve) => ({
      ...preve,
      videoUrl: ''
    }))
  }
  // socket message
  useEffect(() => {
    if (socketConnection) {
      // To back id user (TO whom message)
      socketConnection.emit('message-page', params.userId)
      // To back seen
      socketConnection.emit('seen', params.userId)
      // FROM back user info (TO whom message)
      socketConnection.on('message-user', (data) => {
        setDataUser(data)
      })
      // FROM back message
      socketConnection.on('message', (data) => {
        setAllMessage(data)
      })
    }
  }, [socketConnection, params?.userId, user])
  // show last message
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessage])
  // input message value
  const handleOnChange = (e) => {
    const { value } = e.target
    setMessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }
  // button send
  const handelSubmitMessage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (message?.text || message?.imageUrl || message?.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new-message', {
          sender: user?._id,
          receiver: params.userId,
          text: message?.text,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          messageByUserId: user?._id,
        })
        setMessage((preve) => ({
          ...preve,
          text: '',
          imageUrl: '',
          videoUrl: ''
        }))
      }
    }
  }
  return (
    <div style={{ backgroundImage: `url(${background})` }} className='bg-no-repeat bg-cover'>
      {/* header */}
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          {/* button back on mobile */}
          <div><Link to={'/'} className='lg:hidden'><FaAngleLeft /></Link></div>
          {/* avatar user to who message */}
          <div>
            <Avatar width={40} height={40}
              name={dataUser?.name} imageUrl={dataUser?.profile_pic}
              userId={dataUser?._id} />
          </div>
          {/* info about user to who message */}
          <div>
            <h3 className='font-semibold text-lg -my-2 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='text-sm'>{dataUser?.online ?
              <span className='text-primery'>online</span> : <span className='text-slate-500'>offline</span>
            }</p>
          </div>
        </div>
        {/* button more about user to who message */}
        <div>
          <button className='cursor-pointer hover:text-primery' onClick={() => setOpenDitailsUser(true)}><HiDotsVertical /></button>
        </div>
      </header>
      {/* show all messages */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll 
                          scrollbar relative bg-slate-200 bg-opacity-50'>
        {/* all message show here */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {
            allMessage.map((message, index) => {
              return (
                <div key={index}
                  className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md 
                              ${user._id === message.messageByUserId ? 'ml-auto bg-blue-300' : 'mr-auto bg-white'}`}>
                  <div className='w-full'>
                    {
                      message?.imageUrl && (
                        <img src={message?.imageUrl}
                          alt="Ops, can't load"
                          className='w-full h-full object-scale-down'
                        />
                      )
                    }
                    {
                      message?.videoUrl && (
                        <video src={message?.videoUrl}
                          alt="Ops, can't load"
                          className='w-full h-full object-scale-down'
                          controls
                          autoPlay
                          muted
                        />
                      )
                    }
                  </div>
                  <p className='px-2 text-xl'>{message.text}</p>
                  <p className='text-sm ml-auto w-fit'>{moment(message.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
        </div>
        {/* upload image display */}
        {
          message?.imageUrl && (
            <div className='h-full w-full bg-slate-700 bg-opacity-30 flex justify-center items-center
                        rounded overflow-hidden sticky bottom-0'>
              <div className='absolute top-0 right-0 w-fit p-2 cursor-pointer' onClick={handelClearUploadImage}>
                <RiCloseLargeLine size={30} className='text-primery hover:text-red-600' />
              </div>
              <div className='bg-white'>
                <img src={message?.imageUrl}
                  alt="Ops, can't load"
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
              </div>
            </div>
          )
        }
        {/* upload video display */}
        {
          message?.videoUrl && (
            <div className='h-full w-full bg-slate-700 bg-opacity-30 flex justify-center items-center
                        rounded overflow-hidden sticky bottom-0'>
              <div className='absolute top-0 right-0 w-fit p-2 cursor-pointer' onClick={handelClearUploadVideo}>
                <RiCloseLargeLine size={30} className='text-primery hover:text-red-600' />
              </div>
              <div className='bg-white'>
                <video src={message?.videoUrl}
                  alt='Video'
                  className='aspect-video w-full h-full max-w-sm m-2 object-scale-down'
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )
        }
        {/* loading */}
        {
          loading && (
            <div className='w-full h-full flex justify-center items-center sticky bottom-0'>
              <Loading />
            </div>
          )
        }
      </section>
      {/* send message */}
      <section className='h-16 bg-white flex items-center px-4'>
        {/* video and image */}
        <div className='relative'>
          {/* button + */}
          <button onClick={handleUploadImageVideoOpen}
            className='flex items-center justify-center w-10 h-10 rounded-full 
                          hover:bg-primery mt-2 
                          text-primery hover:text-white'>
            <FaPlus size={20} />
          </button>
          {/* add vide and image */}
          {
            openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                <form>
                  <label htmlFor='uploadImage'
                    className='flex items-center p-2 px-3 gap-3 hover:bg-slate-300 rounded cursor-pointer'>
                    <div className='text-primery'><FaImage size={18} /></div>
                    <p>Image</p>
                  </label>
                  <label htmlFor='uploadVideo'
                    className='flex items-center p-2 px-3 gap-3 hover:bg-slate-300 rounded cursor-pointer'>
                    <div className='text-purple-600'><FaVideo size={18} /></div>
                    <p>Video</p>
                  </label>

                  <input
                    type="file"
                    id='uploadImage'
                    onChange={handelUploadImage}
                    className='hidden'
                  />
                  <input
                    type="file"
                    id='uploadVideo'
                    onChange={handelUploadVideo}
                    className='hidden'
                  />
                </form>
              </div>
            )
          }
        </div>
        {/* input box */}
        <form className='h-full w-full flex gap-2' onSubmit={handelSubmitMessage}>
          <input
            type='text'
            placeholder='Enter your message...'
            className='py-1 px-4 outline-none w-full h-full'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='text-primery hover:text-secondary'>
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
      {/* ditails user */}
      {
        openDitailsUser && (
          <UserDitails onClose={() => setOpenDitailsUser(false)} user={dataUser}/>
        )
      }
    </div>
  )
}

export default MessagePage