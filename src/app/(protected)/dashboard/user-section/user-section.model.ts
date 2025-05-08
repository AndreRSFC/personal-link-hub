export interface ProfileDataModel {
  profile: {
    name: string
    description: string
    profile_image_url: string
    username: string
  }
  links: Array<{
    id: string
    title: string
    url: string
    is_visible: boolean
    order_position: number
  }>
}
