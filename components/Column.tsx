import { NextPage } from 'next/types'
import { Flex, Heading } from '@chakra-ui/react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Card, { CardDataProps } from './Card'

export type ColumnDataProps = {
	items: Array<CardDataProps>
	id: string
	name: string
}

type ColumnProps = {
	column: ColumnDataProps
	color: string
}

const Column: NextPage<ColumnProps> = ({ column, color }) => {
	return (
		<div key={column.id} style={{ userSelect: 'none' }}>
			<Droppable droppableId={column.id} key={column.id}>
				{(provided, snapshot) => (
					<Flex
						direction={'column'}
						ref={provided.innerRef}
						{...provided.droppableProps}
						style={{
							border: `solid 2px ${color.slice(0, 7)}`,
							background: `${color}44`,
							padding: '.25rem',
							transition: 'background-image 120ms',
							minHeight: '2rem',
							borderRadius: '.25rem',
						}}
					>
						{column.items.map((item, index) => (
							<Draggable
								draggableId={item.id}
								key={item.id}
								index={index}
							>
								{(provided, snapshot) => (
									<Card
										card={item}
										provided={provided}
										snapshot={snapshot}
									/>
								)}
							</Draggable>
						))}

						{provided.placeholder}
					</Flex>
				)}
			</Droppable>
		</div>
	)
}

export default Column
