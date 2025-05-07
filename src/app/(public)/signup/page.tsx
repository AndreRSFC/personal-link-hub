'use client'
import { Button } from '@/components/button'
import { InputField } from '@/components/input'
import Link from 'next/link'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import styles from './signup.module.css'

const SignUp = () => {
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

  const handleSignUp = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username: email.split('@')[0],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up')
      }

      window.location.href = '/signin?registered=true'
    } catch (err) {
      console.error(err)
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
          <h1 className={styles.page__title}>Join Link Hub</h1>
          <span className={styles.page__subtitle}>Sign up for free!</span>
        </div>
        <form className={styles.page__form} onSubmit={handleSignUp}>
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
            Create account
          </Button>
        </form>
        <div className={styles.page__links}>
          <span>
            Already have an account? <Link href="/signin">Sign in</Link>
          </span>
        </div>
      </main>
    </div>
  )
}

export default SignUp
