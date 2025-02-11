import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { RiCloseLargeLine } from "react-icons/ri";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';

const SearchUser = ({ onClose }) => {
    // search result
    const [searchUser, setSearchUser] = useState([])
    // loading
    const [loading, setLoading] = useState(false)
    // search value
    const [search, setSearch] = useState("")
    // send to back search value and get result
    const handleSearchUser = async () => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try {
            setLoading(true)
            const res = await axios.post(URL, {
                search: search
            })
            setLoading(false)
            setSearchUser(res.data.data)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    useEffect(() => {
        handleSearchUser()
    }, [search])
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
            {/* button to close the window */}
            <div className='mx-auto w-12'>
                {/* button close */}
                <button>
                    <RiCloseLargeLine size={50} className='text-primery hover:text-red-600' onClick={onClose} />
                </button>
            </div>
            {/* search and result */}
            <div className='w-full max-w-md mx-auto mt-6'>
                {/* input search user */}
                <div className='bg-white rounded h-12 overflow-hidden shadow flex'>
                    {/* search input */}
                    <input type='text'
                        placeholder='Search user by name, email....'
                        className='w-full outline-none py-1 px-4 h-full'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search} />
                    {/* search icon */}
                    <div className='h-12 w-12 flex justify-center items-center'>
                        <IoSearchOutline size={25} />
                    </div>
                </div>
                {/* display search user */}
                <div className='bg-white mt-2 w-full p-4 rounded'>
                    {/* no user found */}
                    {
                        searchUser.length === 0 && !loading && (
                            <p className='text-center text-slate-500'>no user found</p>)
                    }
                    {/* loading */}
                    {
                        loading && (<p><Loading /></p>)
                    }
                    {/* user found */}
                    {
                        searchUser.length !== 0 && !loading && (
                            searchUser.map((user, index) => {
                                return (
                                    <UserSearchCard key={user.id} user={user} onClose={onClose} />)
                            }))
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchUser