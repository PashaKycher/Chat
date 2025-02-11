import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
  // get user from state
  const user = useSelector(state => state.user)
  // chenge state
  const dispatch = useDispatch()
  // can go to ather page
  const navigate = useNavigate()
  const location = useLocation()

  // from back get user details and write in state
  const fetchUserDetails = async () => {
    // From back get user details
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
      const res = await axios({
        url: URL,
        withCredentials: true
      })
      // to state user details
      dispatch(setUser(res.data.data))
      // check logout
      if (res.data.data.logout) {
        dispatch(logout())
        navigate('/register')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  /* socket connection */
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });
    // From Back whot user is online and write in state
    socketConnection.on('onlineUser', (data) => {
      // to state online user
      dispatch(setOlineUser(data))
    })
    // to state socket connection
    dispatch(setSocketConnection(socketConnection))
    return () => { socketConnection.disconnect() };
  }, []);

  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[285px,1fr] h-screen max-h-screen'>
      {/* Sidebar component */}
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      {/*Message component*/}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      {/* show logo on empty page and "Select user to send message" */}
      <div className={`justify-center items-center flex-col gap-2 hidden 
                      ${!basePath ? "hidden" : "lg:flex"}`}>
        <div><img src={logo} width={250} alt='logo' /></div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home