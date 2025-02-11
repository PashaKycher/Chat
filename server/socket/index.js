const { Server } = require('socket.io')
const express = require('express')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/userModel')
const { ConversationModel, MessageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')
require('dotenv').config()

const app = express()

/* socket connection */
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    },
    transports: ['websocket', 'polling']
})
//online user
const onlineUser = new Set()

io.on('connection', async (socket) => {
    console.log("connect User ", socket.id)
    // get token
    const token = socket.handshake.auth.token
    console.log("User token:", socket.handshake.auth.token);
    // current user details
    const user = await getUserDetailsFromToken(token)
    console.log("user", user)
    //create room
    socket.join(user?._id?.toString())
    // add user status online
    onlineUser.add(user?._id?.toString())
    // show online user
    io.emit('onlineUser', Array.from(onlineUser))

    // FROM front id user TO whom message
    socket.on('message-page', async (userId) => {
        console.log("user id", userId)
        const userDetails = await UserModel.findById(userId)
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId),
            lastName: userDetails?.lastName,
            phone: userDetails?.phone,
            city: userDetails?.city
        }
        // TO front user info TO whom message
        socket.emit('message-user', payload)
        // get previous message
        const getConversationMassage = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages').sort({ createdAt: -1 })
        socket.emit('message', getConversationMassage?.messages || [])
    })

    //FROM fron new message
    socket.on('new-message', async (data) => {
        // cheak conversation is available both user
        let corversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        })
        // if conversation is not available
        if (!corversation) {
            const createConversation = await ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            })
            corversation = await createConversation.save()
        }
        // create message
        const message = new MessageModel({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            messageByUserId: data?.messageByUserId,
        })
        // save message
        const saveMessage = await message.save()
        // add message to conversation
        const updateConversation = await ConversationModel.updateOne({ _id: corversation?._id },
            { "$push": { messages: saveMessage?._id } })

        // get conversation with message
        const getConversationMassage = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        }).populate('messages').sort({ createdAt: -1 })
        //To front message FROM who message
        io.to(data?.sender).emit('message', getConversationMassage?.messages || [])
        //To front message TO who message
        io.to(data?.receiver).emit('message', getConversationMassage?.messages || [])
        // show on sidebar text of new message
        const conversationSender = await getConversation(data?.sender)
        const conversationReceiver = await getConversation(data?.receiver)
        io.to(data?.sender).emit('conversation', conversationSender || [])
        io.to(data?.receiver).emit('conversation', conversationReceiver || [])
    })

    // show on sidebar user
    socket.on('sidebar', async (currentUserId) => {
        console.log("currentUserId", currentUserId)
        const conversation = await getConversation(currentUserId)
        socket.emit('conversation', conversation || [])
    })

    // show on sidebar color circle (seen or not seen)
    socket.on('seen', async (msgByUserId) => {
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: msgByUserId },
                { sender: msgByUserId, receiver: user?._id }
            ]
        })
        const conversationMessageId = conversation?.messages || []
        // updete seen in message
        const updateMessages = await MessageModel.updateMany(
            { _id: { $in: conversationMessageId }, messageByUserId: msgByUserId },
            { "$set": { seen: true } }
        )
        // show on sidebar circle of new message
        const conversationSender = await getConversation(user?._id?.toString())
        const conversationReceiver = await getConversation(msgByUserId)
        io.to(user?._id?.toString()).emit('conversation', conversationSender || [])
        io.to(msgByUserId).emit('conversation', conversationReceiver || [])
    })

    //disconnect
    socket.on('disconnect', () => {
        if (user?._id) {
            onlineUser.delete(user._id.toString());
            console.log("disconnect User ", socket.id);
        }
    })
})

module.exports = { app, server }
