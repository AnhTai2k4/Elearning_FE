'use client'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateUser } from '@/store/userSlice'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/user/refreshToken', {
          method: 'POST',
          credentials: 'include',
        })
        const json = await res.json()
        console.log('Restore session response:', json.data)
        if (res.ok && json.data) {
          dispatch(updateUser({
            name: json.data.user.name || '', // nếu backend trả user info thì gán vào đây
            username: json.data.user.name || '',
            email: json.data.user.email || '',
            access_token: json.data.access_token,
            isAdmin: json.data.user.isAdmin || false,
            password: '',
            phone: ''
          }))
        } else {
          dispatch(updateUser({
            name: '',
            username: '',
            email: '',
            access_token: '',
            isAdmin: false,
            password: '',
            phone: ''
          }))
        }
      } catch (error) {
        dispatch(updateUser({
          name: '',
          username: '',
          email: '',
          access_token: '',
          isAdmin: false,
          password: '',
          phone: ''
        }))
      } finally {
        setReady(true)
      }
    }
    restoreSession()
  }, [dispatch])

  if (!ready) return null
  return <>{children}</>
}