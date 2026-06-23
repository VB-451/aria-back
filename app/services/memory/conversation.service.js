const generateId = () => {
  return Math.random().toString(36).slice(2)
}

const createConversation = () => {
  const rootId = generateId()

  const rootNode = {
    id: rootId,
    parentId: null,
    childrenIds: [],
    role: 'system',
    content: 'root'
  }

  return {
    nodes: {
      [rootId]: rootNode
    },
    rootId,
    currentNodeId: rootId
  }
}

let conversation = createConversation()

export const getConversation = () =>{
    return conversation;
}

export const nullifyConversation = () =>{
  conversation = createConversation();
}

const appendNode = (parentId, { role, content, function_type = null }) => {
  const id = generateId()

  const newNode = {
    id,
    parentId,
    childrenIds: [],
    role,
    content,
    function_type
  }

  conversation.nodes[id] = newNode

  if (parentId) {
    conversation.nodes[parentId].childrenIds.push(id)
  }

  conversation.currentNodeId = id

  console.log("--------------------");
  
  // console.log(getPath(conversation.currentNodeId));
  return newNode
}

export const appendUserMessage = (content) => {
  const current = conversation.nodes[conversation.currentNodeId]

  if (current.role !== 'assistant' && current.role !== 'system') {
    throw new Error('User message must follow assistant')
  }

  return appendNode(current.id, {
    role: 'user',
    content
  })
}

export const appendAssistantMessage = (content, function_type) => {
  const current = conversation.nodes[conversation.currentNodeId]

  if (current.role !== 'user') {
    throw new Error('Assistant must follow user')
  }

  return appendNode(current.id, {
    role: 'assistant',
    content,
    function_type
  })
}

export const addSibling = (assistantNodeId, newContent, function_type, ifAnswer) => {
  const assistantNode = conversation.nodes[assistantNodeId]

  if (!assistantNode) {
    throw new Error('Node not found')
  }

  const parentId = assistantNode.parentId

  if (!parentId) {
    throw new Error('Cannot regenerate root')
  }

  return appendNode(parentId, {
    role: ifAnswer ? 'assistant' : 'user',
    content: newContent,
    function_type
  })
}

export const deleteSubtree = (nodeId) => {
  const node = conversation.nodes[nodeId]
  if (!node) return

  node.childrenIds.forEach(childId => {
    deleteSubtree(childId)
  })

  if (node.parentId) {
    const parent = conversation.nodes[node.parentId]
    parent.childrenIds = parent.childrenIds.filter(id => id !== nodeId)
  }

  delete conversation.nodes[nodeId]

  if (conversation.currentNodeId === nodeId) {
    conversation.currentNodeId = node.parentId || conversation.rootId
  }
}

export const getPath = (nodeId) => {
  const path = []
  let current = conversation.nodes[nodeId]

  while (current) {
    path.push(current)
    current = current.parentId
      ? conversation.nodes[current.parentId]
      : null
  }

  return path.reverse()
}

export const switchBranch = (nodeId) => {
  if (!conversation.nodes[nodeId]) {
    throw new Error('Node not found')
  }

  let bufferNodeID = nodeId;

  while (true){
    const childrenIDS = conversation.nodes[bufferNodeID].childrenIds
    if (childrenIDS.length > 0){
      bufferNodeID = childrenIDS[0]
    } else {
      break;
    }
  }

  conversation.currentNodeId = bufferNodeID

}

export const getLastInteractions = (numberOfInteractions, nodeId) => {
  const { nodes, currentNodeId } = conversation

  const hasCustomNodeId = nodeId !== undefined

  const effectiveNodeId = nodeId ?? currentNodeId

  const startNode = nodes[effectiveNodeId]

  if (!startNode) return []

  let current = startNode

  if (hasCustomNodeId) {
    if (current.role === 'assistant') {
      current = current.parentId
        ? nodes[current.parentId]
        : null
    }

    current = current?.parentId
      ? nodes[current.parentId]
      : null
  }

  const result = []

  while (current && result.length < numberOfInteractions * 2) {
    if (current.role !== 'system') {
      result.push(`${current.role === "user" ? "\nUser:" : "Assistant:"} ${current.content}`)
    }

    current = current.parentId
      ? nodes[current.parentId]
      : null
  }

  return result.reverse().join("\n")
}

const getSiblings = (nodeId) => {
  const node = conversation.nodes[nodeId]
  if (!node || !node.parentId) return []

  const parent = conversation.nodes[node.parentId]
  return parent.childrenIds.map(id => conversation.nodes[id])
}