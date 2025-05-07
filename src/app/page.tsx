'use client'
import { Button } from '@/components/button'
import { InputField } from '@/components/input'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

const pageTexts = {
  login: {
    title: 'Welcome back to Link Hub',
    subtitle: 'Sign in to your account',
    buttonText: 'Continue',
    nextButtonText: 'Login',
    alternateActionText: "Don't have an account?",
    alternateActionLink: 'Sign up',
    forgotPasswordVisible: true,
  },
  signup: {
    title: 'Join in Link Hub',
    subtitle: 'Sign up for free!',
    buttonText: 'Create account',
    alternateActionText: 'Already have an account?',
    alternateActionLink: 'Sign in',
    forgotPasswordVisible: false,
  },
}

export default function Home() {
  const searchParams = useSearchParams()
  const isSignUp = searchParams.has('signUp')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  const texts = isSignUp ? pageTexts.signup : pageTexts.login

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setEmail('')
    setPassword('')
    setError(false)
    setEmailVerified(false)
  }, [isSignUp])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailVerified && !isSignUp) {
      setEmailVerified(false)
    }
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const handleContinue = () => {
    if (isSignUp) {
      console.log('Cadastrando com email:', email, 'e senha:', password)
    } else {
      if (!emailVerified) {
        setEmailVerified(true)
      } else {
        console.log('Fazendo login com email:', email, 'e senha:', password)
      }
    }
  }

  const buttonText = isSignUp
    ? texts.buttonText
    : !emailVerified
      ? texts.buttonText
      : texts.nextButtonText

  const isButtonDisabled =
    error || !email || (emailVerified && !password && !isSignUp)

  return (
    <div className={styles.page}>
      <main className={styles.page__container}>
        <div className={styles.page__text}>
          <h1 className={styles.page__title}>{texts.title}</h1>
          <span className={styles.page__subtitle}>{texts.subtitle}</span>
        </div>
        <div className={styles.page__form}>
          <InputField
            type="email"
            value={email}
            placeholder="Email here"
            label="Email"
            onChange={handleEmailChange}
            onError={hasError => setError(hasError)}
            required
          />

          {(isSignUp || emailVerified) && (
            <InputField
              type="password"
              value={password}
              placeholder="Password here"
              label="Password"
              onChange={handlePasswordChange}
              onError={hasError => setError(hasError)}
              required
            />
          )}

          <Button disabled={isButtonDisabled} onClick={handleContinue}>
            {buttonText}
          </Button>
        </div>
        <div className={styles.page__links}>
          {texts.forgotPasswordVisible && (
            <Link href="/forgot-password">Forgot Password?</Link>
          )}
          <span>
            {texts.alternateActionText}{' '}
            <Link href={isSignUp ? '/' : '?signUp=true'}>
              {texts.alternateActionLink}
            </Link>
          </span>
        </div>
      </main>
    </div>
  )
}
