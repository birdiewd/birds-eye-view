import { NextPage } from 'next/types'
import { useEffect, useMemo, useState } from 'react'
import { Flex, SimpleGrid, Tooltip, Button, Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { supabaseClient } from '../lib/client'
import AppContext from '../AppContext'

const Home: NextPage = () => {
	const {
		logout,
		state: { user },
	} = useContext(AppContext)

	const [columns, setColumns] = useState([])
	const [swimlanes, setSwimlanes] = useState([])
	const [items, setItems] = useState([])
	const [kanban, setKanban] = useState([])

	const fetchSwimlanes = async () => {
		const { data, error } = await supabaseClient
			.from('swimlanes')
			.select('*')
			.is('is_active', true)
			.order('name')

		if (error) {
			console.log(error)
			return
		}

		if (data) {
			setSwimlanes(data)
		}
	}

	const fetchColumns = async () => {
		const { data, error } = await supabaseClient
			.from('columns')
			.select('*')
			.is('is_active', true)

		if (error) {
			console.log(error)
			return
		}

		if (data) {
			setColumns(data.map((datum) => ({ ...datum, items: [] })))
		}
	}

	const fetchItems = async () => {
		const { data, error } = await supabaseClient
			.from('items')
			.select('*')
			.is('is_active', true)

		if (error) {
			console.log(error)
			return
		}

		if (data) {
			setItems(data)
		}
	}

	const handleDragEnd = (result, swimlane, kanban, setKanban) => {
		if (!result.destination) return

		const swimlaneIndex = kanban.map((sl) => sl.id).indexOf(swimlane.id)

		const { source, destination } = result

		const sourceColumnIndex = swimlane.columns
			.map((column) => column.id)
			.indexOf(source.droppableId)
		const sourceColumn = swimlane.columns[sourceColumnIndex]
		const sourceItems = [...sourceColumn.items]

		const [removed] = sourceItems.splice(source.index, 1)

		const destColumnIndex = swimlane.columns
			.map((column) => column.id)
			.indexOf(destination.droppableId)
		const destColumn = swimlane.columns[destColumnIndex]
		const destItems =
			source.droppableId === destination.droppableId
				? sourceItems
				: [...destColumn.items]

		destItems.splice(destination.index, 0, removed)

		swimlane.columns[sourceColumnIndex] = {
			...sourceColumn,
			items: sourceItems,
		}

		swimlane.columns[destColumnIndex] = {
			...destColumn,
			items: destItems,
		}

		console.log({ swimlane })

		const newKanban = [...kanban]
		newKanban[swimlaneIndex] = swimlane

		console.log({ newKanban })

		// also make a call to the back end...

		setKanban(newKanban)
	}

	useEffect(() => {
		if (user) {
			fetchSwimlanes()
			fetchColumns()
			fetchItems()
		}
	}, [user])

	useEffect(() => {
		if (swimlanes.length && columns.length && items.length) {
			console.log('raw data is changing?')
			const newKanban = swimlanes.map((swimlane) => ({
				...swimlane,
				columns: columns.map((column) => ({
					...column,
					items: items.filter(
						(item) =>
							item.swimlane_id === swimlane.id &&
							item.column_id === column.id
					),
				})),
			}))

			setKanban(newKanban)
		}
	}, [swimlanes, columns, items])

	return (
		<main style={{ padding: '1rem' }}>
			<Button onClick={logout}>Logout</Button>

			{kanban?.map((swimlane) => (
				<div
					style={{
						marginTop: '1rem',
					}}
					key={swimlane.id}
				>
					<Heading
						as="h2"
						size={'md'}
						style={{
							borderBottom: 'solid #aaa 1px',
							paddingBottom: '.25rem',
							marginBottom: '.25rem',
							opacity: 0.5,
						}}
					>
						{swimlane.name}
					</Heading>
					<SimpleGrid gap={'1rem'} columns={swimlane.columns.length}>
						<DragDropContext
							onDragEnd={(result) =>
								handleDragEnd(
									result,
									swimlane,
									kanban,
									setKanban
								)
							}
						>
							{swimlane.columns.map((column) => (
								<div key={column.id}>
									<Heading
										as="h2"
										size={'sm'}
										style={{ marginBottom: '.125rem' }}
									>
										{column.name}
									</Heading>
									<Droppable
										droppableId={column.id}
										key={column.id}
									>
										{(provided, snapshot) => (
											<Flex
												direction={'column'}
												ref={provided.innerRef}
												{...provided.droppableProps}
												style={{
													background:
														snapshot.isDraggingOver
															? '#c3d0f1'
															: '#ddddee',
													padding: '1rem',
													transition: 'all 120ms',
												}}
											>
												{column.items.map(
													(item, index) => (
														<Draggable
															draggableId={
																item.id
															}
															key={item.id}
															index={index}
														>
															{(
																provided,
																snapshot
															) => (
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
																	<div>
																		{
																			item.name
																		}
																	</div>
																	<div>
																		{
																			item.description
																		}
																	</div>
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
				</div>
			))}
		</main>
	)
}

export default Home
