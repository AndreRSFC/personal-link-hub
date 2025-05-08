import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import styles from './layout.module.css'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/signin')
  }

  return <>{children}</>
}
