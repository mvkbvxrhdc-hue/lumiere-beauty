"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Search, CheckCheck, Check, Stethoscope, UserCheck, User } from "lucide-react"
import { conversations as initialConversations, type Conversation, type Message } from "@/lib/messages-data"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<string>(initialConversations[0].id)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)!

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation.messages])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      content: messageInput.trim(),
      timestamp: new Date(),
      read: false,
    }

    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage.content,
            lastMessageTime: newMessage.timestamp,
          }
        }
        return conv
      }),
    )

    setMessageInput("")

    setTimeout(
      () => {
        const responses = [
          "Thanks for your message! I'll get back to you soon.",
          "That's a great question! Let me think about it.",
          "I understand. Let me provide some information on that.",
          "I'd be happy to help with that.",
          "That sounds good. I'll look into it for you.",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const responseMessage: Message = {
          id: `m${Date.now()}`,
          senderId: selectedConversation.participant.id,
          content: randomResponse,
          timestamp: new Date(),
          read: false,
        }

        setConversations((prevConversations) =>
          prevConversations.map((conv) => {
            if (conv.id === selectedConversationId) {
              return {
                ...conv,
                messages: [...conv.messages, responseMessage],
                lastMessage: responseMessage.content,
                lastMessageTime: responseMessage.timestamp,
                unreadCount: conv.unreadCount + 1,
              }
            }
            return conv
          }),
        )
      },
      1000 + Math.random() * 1000,
    )
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hr ago`
    if (days < 7) return `${days} d ago`
    return date.toLocaleDateString("en-US")
  }

  const getTypeIcon = (type: Conversation["type"]) => {
    switch (type) {
      case "doctor":
        return <Stethoscope className="h-3 w-3" />
      case "followed":
        return <UserCheck className="h-3 w-3" />
      case "user":
        return <User className="h-3 w-3" />
    }
  }

  const getTypeBadge = (type: Conversation["type"]) => {
    switch (type) {
      case "doctor":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Stethoscope className="h-3 w-3 mr-1" />
            Doctor
          </Badge>
        )
      case "followed":
        return (
          <Badge variant="secondary" className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
            <UserCheck className="h-3 w-3 mr-1" />
            Followed
          </Badge>
        )
      case "user":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <User className="h-3 w-3 mr-1" />
            User
          </Badge>
        )
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Messages
        </h1>
        <p className="text-muted-foreground mt-2">Chat with users, followed people, and professional doctors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversationId(conversation.id)
                    setConversations((prev) =>
                      prev.map((c) => (c.id === conversation.id ? { ...c, unreadCount: 0 } : c)),
                    )
                  }}
                  className={cn(
                    "w-full p-3 rounded-lg mb-2 text-left transition-colors hover:bg-accent",
                    selectedConversationId === conversation.id && "bg-accent",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conversation.participant.name[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.participant.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5">
                          <CheckCheck className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{conversation.participant.name}</span>
                          {conversation.type === "doctor" && (
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs px-1 py-0"
                            >
                              Doctor
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      {conversation.participant.specialty && (
                        <p className="text-xs text-muted-foreground mb-1">{conversation.participant.specialty}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-purple-500 text-white ml-2">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Thread */}
        <Card className="lg:col-span-2 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedConversation.participant.avatar || "/placeholder.svg"} />
                <AvatarFallback>{selectedConversation.participant.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{selectedConversation.participant.name}</h3>
                  {getTypeBadge(selectedConversation.type)}
                </div>
                {selectedConversation.participant.title && (
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.participant.title}
                    {selectedConversation.participant.specialty && ` · ${selectedConversation.participant.specialty}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {selectedConversation.messages.map((message) => {
                const isMe = message.senderId === "me"
                return (
                  <div key={message.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[70%]", isMe ? "order-2" : "order-1")}>
                      <div
                        className={cn(
                          "rounded-lg px-4 py-2",
                          isMe ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white" : "bg-muted text-foreground",
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={cn("flex items-center gap-1 mt-1", isMe ? "justify-end" : "justify-start")}>
                        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                        {isMe && (
                          <span className="text-xs">
                            {message.read ? (
                              <CheckCheck className="h-3 w-3 text-purple-400" />
                            ) : (
                              <Check className="h-3 w-3 text-muted-foreground" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
