import {
  AnalyticsIcon,
  AudienceIcon,
  ChevronIcon,
  EarnIcon,
  LinkIcon,
  MenuIcon,
  ShopIcon,
} from '@/icons'

export const SIDEBAR_ITEMS = [
  {
    label: 'Links',
    href: '/links',
    icon: <LinkIcon />,
  },
  {
    label: 'Shop',
    href: '/shop',
    icon: <ShopIcon />,
  },
  {
    label: 'Earn',
    href: '/earn',
    icon: <EarnIcon />,
    badge: 'New',
  },
  {
    label: 'Audience',
    href: '/audience',
    icon: <AudienceIcon />,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <AnalyticsIcon />,
  },
]
