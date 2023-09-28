import { IconType } from 'react-icons'
import {
  FiCompass,
  FiHome,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi'
import { FcIdea } from "react-icons/fc";

interface LinkItemProps {
    name: string
    href: string
    icon: IconType
    id: string // used for sync with firebase doc field
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
        { id: "idea", name: 'Idea', icon: FcIdea, href: '#idea' },
        { id: "competitiveLandscape", name: 'Competitive Landscape', icon: FiTrendingUp, href: '#competitiveLandscape' },
        { id: "productCapabilities", name: 'Product Capabiltiies', icon: FiCompass, href: "#productCapabilities" },
      ],
    },
    {
      title: 'Go To Market',
      href: '#go-to-market',
      sublinks: [
        { id: "moat", name: 'Moat', icon: FiStar, href: "#moat" },
        { id: "productLifecycle", name: 'Product Lifecycle', icon: FiHome, href: "#productLifecycle" },
        { id: "businessModel", name: 'Business Model', icon: FiCompass, href: "#businessModel" },
      ],
    },
    {
      title: 'Features',
      href: '#features',
      sublinks: [
        { id: "branding", name: 'Branding', icon: FiHome, href: "#branding" },
        { id: "uiux", name: 'User Interface & Experience', icon: FiTrendingUp, href: "#uiux" },
      ],
    },
  ]

export default LinkItems