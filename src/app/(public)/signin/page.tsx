'use client'
import { Button } from '@/components/button'
import { InputField } from '@/components/input'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import styles from './signin.module.css'

const SignIn = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
  }

  const handleSignIn = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    setLoading(true)
    setError(false)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(true)
      } else {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const isButtonDisabled = error || !email || !password

  return (
    <div className={styles.page}>
      <main className={styles.page__container}>
        <div className={styles.page__text}>
          <h1 className={styles.page__title}>Welcome back to Link Hub</h1>
          <span className={styles.page__subtitle}>Sign in to your account</span>
        </div>
        <form className={styles.page__form} onSubmit={handleSignIn}>
          <InputField
            type="email"
            value={email}
            placeholder="Email here"
            label="Email"
            onChange={handleEmailChange}
            onError={(hasError: boolean) => setError(hasError)}
            required
          />

          <InputField
            type="password"
            value={password}
            placeholder="Password here"
            label="Password"
            onChange={handlePasswordChange}
            onError={(hasError: boolean) => setError(hasError)}
            required
          />

          <Button type="submit" disabled={isButtonDisabled} loading={loading}>
            Login
          </Button>
        </form>
        <div className={styles.page__links}>
          <Link href="/forgot-password">Forgot Password?</Link>
          <span>
            Don't have an account? <Link href="/signup">Sign up</Link>
          </span>
        </div>
      </main>
    </div>
  )
}

export default SignIn
