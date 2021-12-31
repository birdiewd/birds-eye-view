import { NextPage } from 'next/types'
import { SimpleGrid, Heading, Button, Flex, Box, Badge } from '@chakra-ui/react'
import { DragDropContext } from 'react-beautiful-dnd'

import { useContext, useState } from 'react'
import AppContext from '../AppContext'

import Column, { ColumnDataProps } from './Column'

export type SwimlaneDataProps = {
	columns: Array<ColumnDataProps>
	name: string
	id: string
}

type SwimlaneProps = {
	swimlane: SwimlaneDataProps
	handleDragEnd: Function
	kanban: Array<SwimlaneDataProps>
	setKanban: React.Dispatch<React.SetStateAction<string>>
}

const Swimlane: NextPage<SwimlaneProps> = ({
	swimlane,
	handleDragEnd,
	kanban,
	setKanban,
}) => {
	const {
		setCardIds,
		handleUpdateSwimlane,

		state: { items },
	} = useContext(AppContext)

	const columnColors = ['#afafaf', '#2cad44', '#ffa844', '#5181c9']

	const [isOpen, setIsOpen] = useState(swimlane.is_open)

	const toggleIsOpen = () => {
		setIsOpen(!isOpen)
		handleUpdateSwimlane(swimlane.id, { is_open: !isOpen })
	}

	const deleteSwimlane = () => {
		handleUpdateSwimlane(swimlane.id, { is_active: false })
	}

	return (
		<Box
			mt={'.5rem'}
			padding={'.5rem'}
			borderRadius={'.25rem'}
			background={'#ddddeecc'}
			transition={'all 80ms'}
			_hover={{
				backgroundColor: '#ddddeeff',
			}}
		>
			<Flex
				gap={'1rem'}
				alignContent={'center'}
				justify={'space-between'}
				cursor={'pointer'}
				onClick={toggleIsOpen}
			>
				<Flex gap={'.5rem'}>
					<Heading
						as="h2"
						size={'sm'}
						contentEditable={true}
						onClick={(event) => {
							event.stopPropagation()
						}}
						onKeyPress={(event) => {
							if (event.code === 'Enter') {
								event.target.blur()
							}
						}}
						onBlur={(event) =>
							handleUpdateSwimlane(swimlane.id, {
								name: event.target.innerText,
							})
						}
						padding={'0 .25rem'}
					>
						{swimlane.name}
					</Heading>
					{swimlane.columns.map(({ items }, index) => (
						<Badge
							key={`${swimlane.id}-${index}`}
							background={
								columnColors[index % columnColors.length]
							}
							opacity={isOpen ? 0 : items.length > 0 ? 1 : 0.25}
							transition={'all 150ms'}
						>
							{items.length}
						</Badge>
					))}
				</Flex>

				<Flex gap={'.5rem'}>
					{items.filter(
						({ swimlane_id }) => swimlane_id === swimlane.id
					).length === 0 && (
						<Button
							size={'xs'}
							colorScheme={'red'}
							onClick={(event) => {
								event.stopPropagation()
								deleteSwimlane()
							}}
						>
							Delete Lane
						</Button>
					)}

					<Button
						size={'xs'}
						onClick={(event) => {
							event.stopPropagation()
							setCardIds({ item: 0, swimlane: swimlane.id })
						}}
					>
						Add Card
					</Button>
				</Flex>
			</Flex>
			<SimpleGrid
				gap={'1rem'}
				mt={isOpen ? '.5rem' : 0}
				columns={swimlane.columns.length}
				style={{
					maxHeight: isOpen
						? (swimlane.columns
								.map((column) => column.items.length)
								.sort()
								.reverse()[0] +
								1) *
						  100
						: 0,
					opacity: isOpen ? 1 : 0,
					overflow: 'hidden',
					transition: 'all 350ms',
				}}
			>
				<DragDropContext
					onDragEnd={(result) =>
						handleDragEnd(result, swimlane, kanban, setKanban)
					}
				>
					{swimlane.columns.map((column, index) => (
						<Column
							column={column}
							color={columnColors[index % columnColors.length]}
							key={`${swimlane.id}-${column.id}`}
						/>
					))}
				</DragDropContext>
			</SimpleGrid>
		</Box>
	)
}

export default Swimlane
