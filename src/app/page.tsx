'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

const Home = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/signin')
    }

    setLoading(false)
  }, [session, status, router])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.page__container}>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return null
}

export default Home
