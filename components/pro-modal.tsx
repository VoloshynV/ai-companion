'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProModal } from '@/hooks/use-pro-modal'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const ProModal = () => {
  const { isOpen, onClose } = useProModal()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onSubscribe = async () => {
    try {
      setIsLoading(true)

      const res = await axios.get('/api/stripe')

      window.location.href = res.data.url
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Something went wrong!',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className='space-y-4'>
          <DialogTitle className='text-center'>Upgrade to PRO</DialogTitle>
          <DialogDescription className='text-center space-y-2'>
            Create <span className='text-sky-500 font-medium'>Custom AI</span> Companion!
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='flex justify-between'>
          <p className='text-2xl font-medium'>
            49<span className='text-sm font-normal'>.99 / mo</span>
          </p>
          <Button disabled={isLoading} onClick={onSubscribe} variant='premium'>
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
