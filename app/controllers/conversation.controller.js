import * as conversationService from "../services/memory/conversation.service.js"

export const retrieveConversation = (req, res) =>{
    res.json(conversationService.getConversation())
}

export const deleteConversation = (req, res) =>{
    conversationService.nullifyConversation();
    res.send(`Conversation deleted`)
}

export const deleteInteraction = (req, res) =>{
    const { userNodeID } = req.body;
    try {
        conversationService.deleteSubtree(userNodeID)
        res.send(`Interaction ${userNodeID} deleted.`)
    } catch(e){
        res.status(500).json({ error: "Delete interaction error" });
    }
}

export const changeBranch = (req, res) =>{
    const { nodeID } = req.body;
    try {
        conversationService.switchBranch(nodeID);
        res.send(`Branched switched to ${nodeID}`)
    } catch (e){
        res.status(500).json({ error: "Branch switch error" });
    }
}