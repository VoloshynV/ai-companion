'use client'

import { Companion } from '@prisma/client'
import { ChatMessage, ChatMessageProps } from '@/components/chat-message'
import { ElementRef, useEffect, useRef, useState } from 'react'

interface ChatMessagesProps {
  messages: ChatMessageProps[]
  isLoading: boolean
  companion: Companion
}

export const ChatMessages = ({ messages = [], isLoading, companion }: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<'div'>>(null)
  const [fakeLoading, setFakeLoading] = useState(messages.length === 0)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFakeLoading(false)
    }, 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className='flex-1 overflow-y-auto pr-4'>
      <ChatMessage
        src={companion.src}
        role='system'
        isLoading={fakeLoading}
        content={`Hello, I am ${companion.name}, ${companion.description}`}
      />
      {messages.map((message) => (
        <ChatMessage
          key={message.content}
          src={message.src}
          role={message.role}
          content={message.content}
        />
      ))}
      {isLoading && <ChatMessage src={companion.src} role='system' isLoading />}
      <div ref={scrollRef} />
    </div>
  )
}
