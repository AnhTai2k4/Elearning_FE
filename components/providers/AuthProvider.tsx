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
        const apiBase = process.env.BE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://eleaning-be.vercel.app/api';
        const res = await fetch(`${apiBase}/user/refreshToken`, {
          method: 'POST',
          credentials: 'include',
        })
        const json = await res.json()
        console.log('Restore session response:', json.data)
        if (res.ok && json.data) {
          const userInfo = {
            id: json.data.user._id || json.data.user.id || '',
            name: json.data.user.name || '',
            username: json.data.user.username || json.data.user.name || '',
            email: json.data.user.email || '',
            access_token: json.data.access_token,
            isAdmin: json.data.user.isAdmin || false,
            isTeacher: json.data.user.isTeacher || false,
            password: '',
            phone: json.data.user.phone || '',
            courseBuyed: json.data.user.courseBuyed || []
          }
          dispatch(updateUser(userInfo));
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        } else {
          dispatch(updateUser({
            name: '',
            username: '',
            email: '',
            access_token: '',
            isAdmin: false,
            isTeacher: false,
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
          isTeacher: false,
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