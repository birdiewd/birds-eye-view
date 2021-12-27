import { NextPage } from 'next/types'
import { useMemo, useState } from 'react'
import { Flex, SimpleGrid, Tooltip, Button } from '@chakra-ui/react'
import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import AppContext from '../AppContext'

const swimlaneColumnsItems = [
	{
		id: uuid(),
		title: 'Task One',
	},
	{
		id: uuid(),
		title: 'Task Two',
	},
	{
		id: uuid(),
		title: 'Task Three',
	},
	{
		id: uuid(),
		title: 'Task Four',
	},
]

const swimlaneColumns = {
	[uuid()]: {
		title: 'Col One',
		items: swimlaneColumnsItems,
	},
	[uuid()]: {
		title: 'Col Two',
		items: [],
	},
	[uuid()]: {
		title: 'Col Three',
		items: [],
	},
}

const swimlanes = [
	{
		id: uuid(),
		title: 'Lane One',
		columns: swimlaneColumns,
	},
]

const Home: NextPage = () => {
	const { logout } = useContext(AppContext)

	const [columns, setColumns] = useState(swimlaneColumns)

	const handleDragEnd = (result, columns, setColumns) => {
		if (!result.destination) return

		const { source, destination } = result

		const sourceColumn = columns[source.droppableId]
		const sourceItems = [...sourceColumn.items]
		const [removed] = sourceItems.splice(source.index, 1)

		const destColumn = columns[destination.droppableId]
		const destItems =
			source.droppableId === destination.droppableId
				? sourceItems
				: [...destColumn.items]

		destItems.splice(destination.index, 0, removed)

		setColumns({
			...columns,
			[source.droppableId]: {
				...sourceColumn,
				items: sourceItems,
			},
			[destination.droppableId]: {
				...destColumn,
				items: destItems,
			},
		})
	}

	return (
		<main style={{ padding: '1rem' }}>
			<Button onClick={logout}>Logout</Button>
			<SimpleGrid
				gap={'1rem'}
				columns={Object.keys(columns).length}
				style={{ marginTop: '2rem', height: '100%' }}
			>
				<DragDropContext
					onDragEnd={(result) =>
						handleDragEnd(result, columns, setColumns)
					}
				>
					{Object.keys(columns).map((column) => (
						<div>
							<h2>{columns[column].title}</h2>
							<Droppable droppableId={column} key={column}>
								{(provided, snapshot) => (
									<Flex
										direction={'column'}
										ref={provided.innerRef}
										{...provided.droppableProps}
										style={{
											background: snapshot.isDraggingOver
												? '#c3d0f1'
												: '#ddddee',
											padding: '1rem',
											transition: 'all 120ms',
											minHeight: 500,
										}}
									>
										{columns[column].items.map(
											(item, index) => (
												<Draggable
													draggableId={item.id}
													key={item.id}
													index={index}
												>
													{(provided, snapshot) => (
														<div
															ref={
																provided.innerRef
															}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={{
																margin: '.25rem 0',
																padding:
																	'.5rem',
																maxHeight:
																	'5rem',
																overflow:
																	'hidden',
																background:
																	snapshot.isDragging
																		? '#444499'
																		: '#333344',
																color: 'white',
																...provided
																	.draggableProps
																	.style,
															}}
														>
															{item.title}
														</div>
													)}
												</Draggable>
											)
										)}
										{provided.placeholder}
									</Flex>
								)}
							</Droppable>
						</div>
					))}
				</DragDropContext>
			</SimpleGrid>
		</main>
	)
}

export default Home
