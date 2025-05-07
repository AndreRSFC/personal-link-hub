'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

const InternalSessionProvider = ({ children }: ProvidersProps) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default InternalSessionProvider
