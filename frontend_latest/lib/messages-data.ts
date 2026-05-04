export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  type: "user" | "followed" | "doctor"
  participant: {
    id: string
    name: string
    avatar: string
    title?: string // For doctors
    specialty?: string // For doctors
    verified?: boolean // For doctors
  }
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  messages: Message[]
}

export const conversations: Conversation[] = [
  {
    id: "1",
    type: "doctor",
    participant: {
      id: "doc1",
      name: "Dr. Sarah Chen",
      avatar: "/female-doctor.png",
      title: "Dermatologist",
      specialty: "Anti-Aging & Aesthetics",
      verified: true,
    },
    lastMessage: "I recommend using gentle cleansing products and avoiding over-cleansing",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        senderId: "me",
        content: "Hello Doctor, my skin has been a bit sensitive lately. How should I take care of it?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: true,
      },
      {
        id: "m2",
        senderId: "doc1",
        content: "Hello! What specific symptoms are you experiencing? For example, redness, stinging, or peeling?",
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        read: true,
      },
      {
        id: "m3",
        senderId: "me",
        content: "Mainly redness on both cheeks, and slight stinging after washing my face",
        timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
        read: true,
      },
      {
        id: "m4",
        senderId: "doc1",
        content: "I recommend using gentle cleansing products and avoiding over-cleansing",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
      },
      {
        id: "m5",
        senderId: "doc1",
        content:
          "Try products with ceramides and centella asiatica. Temporarily stop using acids and whitening products",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
      },
    ],
  },
  {
    id: "2",
    type: "followed",
    participant: {
      id: "user1",
      name: "Emma Liu",
      avatar: "/asian-woman-skincare.jpg",
    },
    lastMessage: "I'm also using this serum, it works really well!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    messages: [
      {
        id: "m6",
        senderId: "me",
        content: "Hi! I saw your skincare tips. How's that niacinamide serum you mentioned?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: true,
      },
      {
        id: "m7",
        senderId: "user1",
        content: "I'm also using this serum, it works really well!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
      },
    ],
  },
  {
    id: "3",
    type: "doctor",
    participant: {
      id: "doc2",
      name: "Dr. Michael Wang",
      avatar: "/male-doctor.png",
      title: "Aesthetic Medicine Specialist",
      specialty: "Laser & Injectable Treatments",
      verified: true,
    },
    lastMessage: "Sure, I'll schedule a consultation for you next Wednesday",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unreadCount: 0,
    messages: [
      {
        id: "m8",
        senderId: "me",
        content: "Dr. Wang, I'd like to inquire about IPL photofacial treatments",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        read: true,
      },
      {
        id: "m9",
        senderId: "doc2",
        content: "Sure, I'll schedule a consultation for you next Wednesday",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
      },
    ],
  },
  {
    id: "4",
    type: "user",
    participant: {
      id: "user2",
      name: "Sophie Zhang",
      avatar: "/young-woman-smiling.png",
    },
    lastMessage: "Thanks for the recommendation! I'll check it out",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    messages: [
      {
        id: "m10",
        senderId: "user2",
        content: "Hi, which brand of sunscreen do you use?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
        read: true,
      },
      {
        id: "m11",
        senderId: "me",
        content: "I use Anessa Gold Bottle, the sun protection is excellent",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), // 24.5 hours ago
        read: true,
      },
      {
        id: "m12",
        senderId: "user2",
        content: "Thanks for the recommendation! I'll check it out",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
    ],
  },
  {
    id: "5",
    type: "followed",
    participant: {
      id: "user3",
      name: "Lily Chen",
      avatar: "/beauty-blogger.jpg",
    },
    lastMessage: "Sure, feel free to ask me anytime!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unreadCount: 0,
    messages: [
      {
        id: "m13",
        senderId: "me",
        content: "Your skincare tutorials are very helpful, thanks for sharing!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49), // 49 hours ago
        read: true,
      },
      {
        id: "m14",
        senderId: "user3",
        content: "Sure, feel free to ask me anytime!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
      },
    ],
  },
  {
    id: "6",
    type: "doctor",
    participant: {
      id: "doc3",
      name: "Dr. Jessica Lin",
      avatar: "/female-dermatologist.png",
      title: "Chief Dermatologist",
      specialty: "Acne & Sensitive Skin Care",
      verified: true,
    },
    lastMessage: "Remember to apply the ointment on time, follow-up in two weeks",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    unreadCount: 0,
    messages: [
      {
        id: "m15",
        senderId: "me",
        content: "Dr. Lin, my acne condition has improved",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 73), // 73 hours ago
        read: true,
      },
      {
        id: "m16",
        senderId: "doc3",
        content: "Remember to apply the ointment on time, follow-up in two weeks",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        read: true,
      },
    ],
  },
]
