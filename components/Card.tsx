import { NextPage } from 'next/types'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'

import { useContext } from 'react'
import AppContext from '../AppContext'
import { Box, Flex, Tooltip } from '@chakra-ui/react'

import RteEditor from './Editor'

export type CardDataProps = {
	id: string
	name: string
	description: string
}

type CardProps = {
	card: CardDataProps
	provided: DraggableProvided
	snapshot: DraggableStateSnapshot
}

const Card: NextPage<CardProps> = ({ card, provided, snapshot }) => {
	const { setCardModalData } = useContext(AppContext)

	return (
		<Flex
			flexDirection={'column'}
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			style={{
				margin: '.25rem',
				overflow: 'hidden',
				border: 'solid 1px transparent',
				borderWidth: '1px 1px 1px 5px',
				background: snapshot.isDragging ? '#ffffff' : '#ffffffdd',
				borderColor: snapshot.isDragging ? '#000000bb' : '#333333aa',
				color: snapshot.isDragging ? '#333333' : '#000000',
				borderRadius: '.25rem',
				...provided.draggableProps.style,
			}}
			onClick={() => {
				setCardModalData({
					item: card.id,
					swimlane: card.swimlane_id,
				})
			}}
		>
			<Tooltip label={card.name}>
				<Box
					background={'#eeeeee55'}
					padding={'.25rem'}
					pl={'.5rem'}
					overflow={'hidden'}
					whiteSpace={'nowrap'}
					textOverflow={'ellipsis'}
					fontWeight={500}
				>
					{card.name}
				</Box>
			</Tooltip>
			<Box
				fontSize={'sm'}
				padding={'.5rem'}
				_empty={{
					display: 'none',
				}}
				background={'#ccccdd55'}
				borderTop={'solid #00000033 2px'}
				maxHeight={'4.75rem'}
				as={RteEditor}
				content={card.description}
			/>
		</Flex>
	)
}

export default Card
