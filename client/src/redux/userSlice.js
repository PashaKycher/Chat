import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    token: "",
    onlineUser: [],
    socketConnection: null,
    lastName: "",
    city: "",
    phone: ""
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser : (state, actions) => {
            state._id = actions.payload._id
            state.name = actions.payload.name
            state.email = actions.payload.email
            state.profile_pic = actions.payload.profile_pic
            state.lastName = actions.payload.lastName
            state.city = actions.payload.city
            state.phone = actions.payload.phone

        },
        setToken : (state, actions) => {
            state.token = actions.payload
        },
        logout : (state, actions) => {
            state._id = ""
            state.name = ""
            state.email = ""
            state.profile_pic = ""
            state.token = ""
            state.socketConnection = null
        },
        setOlineUser : (state, actions) => {
            state.onlineUser = actions.payload
        },
        setSocketConnection : (state, actions) => {
            state.socketConnection = actions.payload
        }
    },
})

export const { setUser, setToken, logout, setOlineUser, setSocketConnection } = userSlice.actions

export default userSlice.reducer