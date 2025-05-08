'use client'

import { LinkCard } from '@/components/link-card'
import { UserImage } from '@/components/user-image'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import styles from './username.module.css'

interface ProfileData {
  profile: {
    id: string
    username: string
    name: string
    description: string
    profile_image_url: string
  }
  links: {
    id: string
    title: string
    url: string
    image_url: string | null
  }[]
}

export default function ProfilePage() {
  // No App Router, usamos useParams em vez de useRouter.query
  const params = useParams()
  const username = params.userName as string

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profileData', username],
    queryFn: async () => {
      const response = await fetch(`/api/p/${username}`)

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do perfil')
      }

      return response.json() as Promise<ProfileData>
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  if (!username) {
    return <div className={styles.links_page__loading}>Carregando...</div>
  }

  if (isLoading) {
    return (
      <div className={styles.links_page__loading}>Carregando perfil...</div>
    )
  }

  if (isError || !data) {
    console.error('Erro ao carregar o perfil:', error)
    return (
      <div className={styles.links_page__error}>
        Erro ao carregar o perfil. Tente novamente.
      </div>
    )
  }

  return (
    <div className={styles.links_page}>
      <div className={styles.links_page__profile}>
        <UserImage
          src={data.profile.profile_image_url}
          alt={data.profile.name}
          size={80}
          className={styles.links_page__profile_image}
        />
        <h1 className={styles.links_page__profile_name}>{data.profile.name}</h1>
        <p className={styles.links_page__profile_description}>
          {data.profile.description}
        </p>
      </div>

      <div className={styles.links_page__links}>
        <h2 className={styles.links_page__links_title}>Meus Links</h2>

        {data.links.length === 0 ? (
          <p className={styles.links_page__no_links}>Nenhum link encontrado.</p>
        ) : (
          data.links.map(link => (
            <LinkCard
              key={link.id}
              id={link.id}
              title={link.title}
              url={link.url}
              image_url={link.image_url}
            />
          ))
        )}
      </div>
    </div>
  )
}
