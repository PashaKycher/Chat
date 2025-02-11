const { ConversationModel } = require("../models/ConversationModel")

const getConversation = async(currentUserId) => {
    if (currentUserId) {
        const currentUserconversation = await ConversationModel.find({
            "$or": [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        }).populate('messages').sort({ updatedAt: -1 }).populate('sender').populate('receiver')
        const conversation = currentUserconversation.map((conv) => {
            const countUnseenMsg = conv?.messages?.reduce((preve, curr) => {
                const messageByUserId = curr.messageByUserId.toString()
                if (messageByUserId !== currentUserId) {
                    return  preve + (curr.seen ? 0 : 1)
                } else {return preve}}, 0)
            return {
                _id: conv?._id,
                sender: conv?.sender,
                receiver: conv?.receiver,
                unseenMsg: countUnseenMsg,
                lastMessage: conv?.messages[conv?.messages?.length - 1]
            }
        })
        return conversation
    } else {
        return []
    }
}
module.exports =  getConversation 