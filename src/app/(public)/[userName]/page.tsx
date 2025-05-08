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
  const params = useParams()
  const username = params.userName as string

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profileData', username],
    queryFn: async () => {
      const response = await fetch(`/api/p/${username}`)

      if (!response.ok) {
        throw new Error('Error fetching profile data')
      }

      return response.json() as Promise<ProfileData>
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  if (!username) {
    return <div className={styles.links_page__loading}>Loading...</div>
  }

  if (isLoading) {
    return <div className={styles.links_page__loading}>Loading profile...</div>
  }

  if (isError || !data) {
    return (
      <div className={styles.links_page__error}>
        Error loading profile. Please try again.
      </div>
    )
  }

  return (
    <div className={styles.links_page__container}>
      <div className={styles.links_page}>
        <div className={styles.links_page__profile}>
          <UserImage
            src={data.profile.profile_image_url}
            alt={data.profile.name}
            size={80}
            className={styles.links_page__profile_image}
          />
          <h1 className={styles.links_page__profile_name}>
            {data.profile.name}
          </h1>
          <p className={styles.links_page__profile_description}>
            {data.profile.description}
          </p>
        </div>

        <div className={styles.links_page__links}>
          {data.links.length === 0 ? (
            <p className={styles.links_page__no_links}>No links found.</p>
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
    </div>
  )
}
