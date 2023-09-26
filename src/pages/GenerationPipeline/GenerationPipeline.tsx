import { CircularProgress, Container, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
import Flowchart from 'flowchart-react'
import { useEffect, useState } from 'react'
import { NAVBAR_HEIGHT } from '../../constants'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import ContentSidebar from './ContentSidebar'
import Content, { ContentSection, Contents } from './Content'
import LinkItems from './Sections'

const GenerationPipeline = () => {
  const COMPLETED_COLOR = '#41B741'
  const IN_PROGRESS_COLOR = '#F2C94C'
  const NOT_STARTED_COLOR = '#E5E5E5'

  const PRODUCT_STRATEGY_NODES = [
    {
      id: 1,
      type: 'start',
      title: 'Idea',
      x: 25,
      y: 50,

      width: 75,
      height: 75,
    },
    {
      id: 2,
      type: 'operation',
      title: 'Comp. Landscape',

      x: 150,
      y: 50,
      width: 100,
      height: 75,
    },
    {
      id: 3,
      type: 'operation',
      title: 'Product Capabilities',

      x: 300,
      y: 50,
      width: 100,
      height: 75,
    },
    {
      id: 4,
      type: 'operation',
      title: 'Moat',

      x: 450,
      y: 50,
      width: 50,
      height: 75,
    },
    {
      id: 5,
      type: 'end',
      title: 'Go To Market',

      x: 550,
      y: 50,
      width: 75,
      height: 75,
    },
    {
      id: 6,
      type: 'end',
      title: 'Features',
      x: 675,
      y: 50,
      width: 75,
      height: 75,
    },
  ]

  const GO_TO_MARKET_NODES = [
    {
      id: 10,
      type: 'start',
      title: 'Idea',
      x: 25,
      y: 50,

      width: 75,
      height: 75,
    },
    {
      id: 11,
      type: 'start',
      title: 'Product Strategy',
      x: 150,
      y: 50,

      width: 75,
      height: 75,
    },
    {
      id: 12,
      type: 'operation',
      title: 'Product Lifecycle & Market Fit',

      x: 275,
      y: 50,
      width: 125,
      height: 75,
    },
    {
      id: 13,
      type: 'operation',
      title: 'Scoping',

      x: 450,
      y: 50,
      width: 75,
      height: 75,
    },
    {
      id: 14,
      type: 'operation',
      title: 'Business Model',

      x: 575,
      y: 50,
      width: 75,
      height: 75,
    },
    {
      id: 15,
      type: 'end',
      title: 'Features',
      x: 700,
      y: 50,
      width: 75,
      height: 75,
    },
  ]

  const [currentNodeId, setCurrentNodeId] = useState<number>(14)

  const getCurrentNodeList = () => {
    if (currentNodeId < 5) {
      return PRODUCT_STRATEGY_NODES
    } else {
      return GO_TO_MARKET_NODES
    }
  }

  const processNodeData = (currentNodeList: any[]) => {
    const nodes = currentNodeList.map(node => {
      if (node.id === currentNodeId) {
        return {
          id: node.id,
          type: node.type,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          title: 
          (<div>
            <p>{node.title}</p>
            <CircularProgress size={"20px"} isIndeterminate color='gray.500'/>
        </div>),
          containerProps: {
            fill: IN_PROGRESS_COLOR,
          },
        }
      } else if (node.id < currentNodeId) {
        return {
          ...node,
          containerProps: {
            fill: COMPLETED_COLOR,
          },
        }
      } else {
        return {
          ...node,
          containerProps: {
            fill: NOT_STARTED_COLOR,
          },
        }
      }
    })
    return nodes
  }

  const processConnsData = (nodes: any[]) => {
    const nodesCopy = nodes.map(n => n)

    // last node has no connection
    nodesCopy.splice(-1)
    const newConns = nodesCopy.map(node => {
      return {
        source: {
          id: node.id,
          position: 'right',
        },
        destination: {
          id: node.id + 1,
          position: 'left',
        },
        color: 'gray',
      }
    })

    return newConns
  }

  const [nodes, setNodes] = useState<any[]>([])
  const [conns, setConns] = useState<any[]>([])

  useEffect(() => {
    const currentNodeList = getCurrentNodeList()
    const newNodes = processNodeData(currentNodeList)
    setNodes(newNodes)

    const newConns = processConnsData(newNodes)
    setConns(newConns)
  }, [currentNodeId])

  const sections: Contents[] = LinkItems.map(li => {
    return {
        title: li.title,
        id: li.href.slice(1),
        sections: li.sublinks.map(sublink => {
            return {
                title: sublink.name,
                id: sublink.href.slice(1),
                content: "test content",
            }
        })
    }
  })

  return (
    <>
      <Container maxW={'5xl'} h={`calc(100vh - ${NAVBAR_HEIGHT}px)`}>
        <div
          style={{
            width: '100%',
            height: '30%',
            color: "black",
          }}
        >
          <Flowchart
            readonly={true}
            nodes={nodes}
            connections={conns}
          />
        </div>
        <Heading mb={3}>Generated Content</Heading>
        <div style={{ padding: "10px", height: "60%", backgroundColor: useColorModeValue('#ffffff', '#111111') }}>
            <Stack direction={"row"} height={"100%"}>
                <ContentSidebar/>
                <Content sections={sections}/>
            </Stack>
        </div>
      </Container>
    </>
  )
}

export default GenerationPipeline
