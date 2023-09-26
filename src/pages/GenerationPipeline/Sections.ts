import { IconType } from 'react-icons'
import {
  FiCompass,
  FiHome,
  FiMenu,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi'
import { FcIdea } from "react-icons/fc";

interface LinkItemProps {
    name: string
    href: string
    icon: IconType
  }
  
  interface LinkSection {
    title: string
    href: string
    sublinks: Array<LinkItemProps>
  }

const LinkItems: Array<LinkSection> = [
    {
      title: 'Product Strategy',
      href: '#product-strategy',
      sublinks: [
        { name: 'Idea Generation', icon: FcIdea, href: '#idea-generation' },
        { name: 'Competitive Landscape', icon: FiTrendingUp, href: '#competitive-landscape' },
        { name: 'Product Capabiltiies', icon: FiCompass, href: "#product-capabilities" },
        { name: 'Moat', icon: FiStar, href: "#moat" },
      ],
    },
    {
      title: 'Go To Market',
      href: '#go-to-market',
      sublinks: [
        { name: 'Product Lifecycle', icon: FiHome, href: "#product-lifecycle" },
        { name: 'Scoping', icon: FiTrendingUp, href: "#scoping" },
        { name: 'Business Model', icon: FiCompass, href: "#business-model" },
      ],
    },
    {
      title: 'Features',
      href: '#features',
      sublinks: [
        { name: 'Branding your Product', icon: FiHome, href: "#branding-your-product" },
        { name: 'User Experience', icon: FiTrendingUp, href: "#user-experience" },
        { name: 'User Interface', icon: FiCompass, href: "#user-interface" },
      ],
    },
  ]

export default LinkItems