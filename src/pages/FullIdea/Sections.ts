import { IconType } from 'react-icons'
import {
  FiUsers,
  FiStar,
} from 'react-icons/fi'
import { RiBoxingLine } from "react-icons/ri"
import { FcIdea } from "react-icons/fc";
import { GiSmartphone, GiCycle } from "react-icons/gi"
import { FaMoneyBillWave } from "react-icons/fa"
import { MdBrandingWatermark } from "react-icons/md"
import { HiOutlineLightningBolt } from "react-icons/hi"

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
      { id: "idea", name: 'Idea', icon: HiOutlineLightningBolt, href: '#idea' },
      { id: "competitiveLandscape", name: 'Competitive Landscape', icon: RiBoxingLine, href: '#competitiveLandscape' },
      { id: "productCapabilities", name: 'Product Capabiltiies', icon: GiSmartphone, href: "#productCapabilities" },
    ],
  },
  {
    title: 'Go To Market',
    href: '#go-to-market',
    sublinks: [
      { id: "moat", name: 'Moat', icon: FiStar, href: "#moat" },
      { id: "productLifecycle", name: 'Product Lifecycle', icon: GiCycle, href: "#productLifecycle" },
      { id: "businessModel", name: 'Business Model', icon: FaMoneyBillWave, href: "#businessModel" },
    ],
  },
  {
    title: 'Features',
    href: '#features',
    sublinks: [
      { id: "branding", name: 'Branding', icon: MdBrandingWatermark, href: "#branding" },
      { id: "uiux", name: 'User Interface & Experience', icon: FiUsers, href: "#uiux" },
    ],
  },
]

export default LinkItems