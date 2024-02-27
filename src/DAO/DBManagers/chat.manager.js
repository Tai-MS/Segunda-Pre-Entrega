import Model from '../models/chat.model.js'

class ChatManager {
    static #instance

    static getInstance(){
        if(!ChatManager.#instance){
            ChatManager.#instance = new ChatManager
        }
        return ChatManager.#instance
    }

    async updateDb(user, message){
        const newElement = new Model({
            user: user,
            message: message
        })
        return await newElement.save()
    }

    async returnChat(){
        try {
            const messages = await Model.find({})

            const formattedMessages = messages.map(message => ({
                user: message.user,
                message: message.message
            }))
            return formattedMessages
        } catch (error) {
            return `Error: ${error}`
        }
    }
}

const chatManager = new ChatManager

export default chatManager