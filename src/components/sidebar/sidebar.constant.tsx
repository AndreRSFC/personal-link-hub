import {
  AnalyticsIcon,
  AudienceIcon,
  EarnIcon,
  LinkIcon,
  ShopIcon,
} from '@/icons'

export const SIDEBAR_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LinkIcon />,
  },
  {
    label: 'Shop',
    href: '/shop',
    icon: <ShopIcon />,
    disabled: true,
  },
  {
    label: 'Earn',
    href: '/earn',
    icon: <EarnIcon />,
    badge: 'New',
    disabled: true,
  },
  {
    label: 'Audience',
    href: '/audience',
    icon: <AudienceIcon />,
    disabled: true,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <AnalyticsIcon />,
    disabled: true,
  },
]
