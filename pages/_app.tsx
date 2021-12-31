import type { AppProps } from 'next/app'
import { ChakraProvider, filter } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import AppContext from '../AppContext'
import { supabaseClient } from '../lib/client'
import Head from 'next/head'

import '../styles/globals.css'

const unAuthedPathes = ['/signin', '/recover', '/reset', '/signup']

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const user = supabaseClient.auth.user()
	const [columns, setColumns] = useState([])
	const [swimlanes, setSwimlanes] = useState([])
	const [items, setItems] = useState([])
	const [kanban, setKanban] = useState([])
	const [filterString, setFilterString] = useState('')

	const [cardIds, setCardIds] = useState({
		swimlane: 0,
		item: 0,
	})

	/*
	######## ######## ########  ######  ##     ## #### ##    ##  ######
	##       ##          ##    ##    ## ##     ##  ##  ###   ## ##    ##
	##       ##          ##    ##       ##     ##  ##  ####  ## ##
	######   ######      ##    ##       #########  ##  ## ## ## ##   ####
	##       ##          ##    ##       ##     ##  ##  ##  #### ##    ##
	##       ##          ##    ##    ## ##     ##  ##  ##   ### ##    ##
	##       ########    ##     ######  ##     ## #### ##    ##  ######
	*/

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
			.is('is_archived', false)

		if (error) {
			console.log(error)
			return
		}

		if (data) {
			setItems(data)
		}
	}

	/*
	 ######  ########  ##     ## ########
	##    ## ##     ## ##     ## ##     ##
	##       ##     ## ##     ## ##     ##
	##       ########  ##     ## ##     ##
	##       ##   ##   ##     ## ##     ##
	##    ## ##    ##  ##     ## ##     ##
	 ######  ##     ##  #######  ########
	*/

	const handleDeleteCard = async (itemId) => {
		const deleteId = itemId || cardIds.item

		console.log(itemId, cardIds.item, deleteId)
		const { data, error } = await supabaseClient.from('items').upsert({
			...items.filter(({ id }) => id === deleteId)[0],
			is_active: false,
		})

		if (error) {
			console.error(error)
		} else {
			handleUpsertItemData(data)

			setCardIds({
				item: 0,
				swimlane: 0,
			})
		}
	}

	const handleArchiveCompleted = async () => {
		const archiveItems = items
			.filter(
				({ column_id }) => column_id === columns[columns.length - 1].id
			)
			.map((item) => ({ ...item, is_archived: true }))

		const { data, error } = await supabaseClient
			.from('items')
			.upsert(archiveItems)

		if (error) {
			console.error(error)
		} else {
			handleUpsertItemData(data)
		}
	}

	const handleAddCard = async (swimlaneId, name, description) => {
		const { data, error } = await supabaseClient.from('items').insert({
			swimlane_id: swimlaneId,
			column_id: columns[0].id,
			name: name?.trim(),
			description: description?.trim(),
			sort_order: items.length,
		})

		if (error) {
			console.error(error)
		} else {
			handleUpsertItemData(data)

			setCardIds({
				item: 0,
				swimlane: 0,
			})
		}
	}

	const handleUpdateCard = async (itemId, name, description) => {
		const { data, error } = await supabaseClient.from('items').upsert({
			...items.filter(({ id }) => id === itemId)[0],
			name: name?.trim(),
			description: description?.trim(),
		})

		if (error) {
			console.error(error)
		} else {
			handleUpsertItemData(data)

			setCardIds({
				item: 0,
				swimlane: 0,
			})
		}
	}

	const handleMoveCards = async (destinationColumn) => {
		const cards = destinationColumn.items.map((item, index) => ({
			...item,
			sort_order: index,
		}))

		const { data, error } = await supabaseClient.from('items').upsert(cards)

		if (error) {
			console.error(error)
		} else {
			handleUpsertItemData(data)
		}
	}

	const handleDragEnd = (result, swimlane, kanban, setKanban) => {
		if (!result.destination) return

		const swimlaneIndex = kanban.map(({ id }) => id).indexOf(swimlane.id)

		const { source, destination } = result

		const sourceColumnIndex = swimlane.columns
			.map((column) => column.id)
			.indexOf(source.droppableId)
		const sourceColumn = swimlane.columns[sourceColumnIndex]
		const sourceItems = [...sourceColumn.items]

		const [removed] = sourceItems
			.splice(source.index, 1)
			.map((item) => ({ ...item, column_id: destination.droppableId }))

		const destColumnIndex = swimlane.columns
			.map((column) => column.id)
			.indexOf(destination.droppableId)
		const destColumn = swimlane.columns[destColumnIndex]
		const destItems =
			source.droppableId === destination.droppableId
				? [...sourceItems].map((item, index) => ({
						...item,
						sort_order: index,
				  }))
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

		const newKanban = [...kanban]
		newKanban[swimlaneIndex] = swimlane

		handleMoveCards(swimlane.columns[destColumnIndex])

		setKanban(newKanban)
	}

	const handleUpsertItemData = (data) => {
		const updatedItems = items.map((item) => {
			const datumIndex = data.findIndex((datum) => datum.id === item.id)

			if (datumIndex >= 0) {
				return {
					...item,
					...data[datumIndex],
				}
			} else {
				return item
			}
		})

		const existingItemIds = items.map(({ id }) => id)
		const newItems = data.filter(
			(datum) => !existingItemIds.includes(datum.id)
		)

		setItems([...updatedItems, ...newItems])
	}

	const handleUpdateSwimlane = async (swimlaneId, newProps) => {
		const { data, error } = await supabaseClient.from('swimlanes').upsert({
			...swimlanes.filter(({ id }) => id === swimlaneId)[0],
			...newProps,
		})

		if (error) {
			console.error(error)
		} else {
			console.log(data)

			setSwimlanes(
				swimlanes.map((swimlane) =>
					swimlane.id === data[0].id ? data[0] : swimlane
				)
			)
		}
	}

	const handleAddSwimlane = async (swimlane) => {
		const { data, error } = await supabaseClient.from('swimlanes').insert({
			name: `New Swimlane - ${Date()}`,
		})

		if (error) {
			console.error(error)
		} else {
			console.log(data)
			setSwimlanes([...swimlanes, ...data])
		}
	}

	/*
	   ###    ##     ## ######## ##     ##
	  ## ##   ##     ##    ##    ##     ##
	 ##   ##  ##     ##    ##    ##     ##
	##     ## ##     ##    ##    #########
	######### ##     ##    ##    ##     ##
	##     ## ##     ##    ##    ##     ##
	##     ##  #######     ##    ##     ##
	*/

	const handleLogout = async () => {
		try {
			await supabaseClient.auth.signOut()
			router.push('/signin')
		} catch (error) {
			router.push('/signin')
		}
	}

	useEffect(() => {
		if (!user && !unAuthedPathes.includes(router.pathname)) {
			router.push('/signin')
		}

		const { data: authListener } = supabaseClient.auth.onAuthStateChange(
			(event) => {
				if (user) {
					if (unAuthedPathes.includes(router.pathname)) {
						router.push('/')
					}
				} else {
					switch (event) {
						case 'PASSWORD_RECOVERY':
							router.push('/reset')

							break

						case 'SIGNED_OUT':
							router.push('/reset')

							break

						case 'SIGNED_IN': {
							if (router.pathname !== '/reset') {
								const signedInUser = supabaseClient.auth.user()
								const userId = signedInUser?.id
								supabaseClient
									.from('profiles')
									.upsert({ id: userId })
									.then((_data, error) => {
										if (!error) {
											router.push('/')
										}
									})
							}
							break
						}

						default:
							break
					}
				}
			}
		)

		return () => {
			authListener?.unsubscribe()
		}
	}, [user, router])

	/*
	########     ###    ########    ###       #### ##    ## #### ########
	##     ##   ## ##      ##      ## ##       ##  ###   ##  ##     ##
	##     ##  ##   ##     ##     ##   ##      ##  ####  ##  ##     ##
	##     ## ##     ##    ##    ##     ##     ##  ## ## ##  ##     ##
	##     ## #########    ##    #########     ##  ##  ####  ##     ##
	##     ## ##     ##    ##    ##     ##     ##  ##   ###  ##     ##
	########  ##     ##    ##    ##     ##    #### ##    ## ####    ##
	*/
	useEffect(() => {
		if (user) {
			fetchSwimlanes()
			fetchColumns()
			fetchItems()
		}
	}, [user])

	/*
	 ######   #######  ##          ###    ######## ########
	##    ## ##     ## ##         ## ##      ##    ##
	##       ##     ## ##        ##   ##     ##    ##
	##       ##     ## ##       ##     ##    ##    ######
	##       ##     ## ##       #########    ##    ##
	##    ## ##     ## ##       ##     ##    ##    ##
	 ######   #######  ######## ##     ##    ##    ########
	*/
	useEffect(() => {
		if (swimlanes.length && columns.length) {
			const newKanban = swimlanes
				.sort((a, b) =>
					a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
				)
				.filter(({ is_active }) => is_active)
				.map((swimlane) => ({
					...swimlane,
					columns: columns.map((column) => {
						const filteredItems = items.filter(
							(item) =>
								item.name
									.toLowerCase()
									.match(filterString.toLowerCase()) ||
								(item?.description || '')
									.toLowerCase()
									.match(filterString.toLowerCase())
						)
						return {
							...column,
							items: filteredItems
								.filter(
									(item) =>
										item.swimlane_id === swimlane.id &&
										item.column_id === column.id &&
										item.is_active &&
										!item.is_archived
								)
								.sort((a, b) => a.sort_order - b.sort_order),
						}
					}),
				}))

			setKanban(newKanban)
		}
	}, [swimlanes, columns, items, filterString])

	return (
		<AppContext.Provider
			value={{
				state: {
					user,
					swimlanes,
					columns,
					items,
					kanban,
					cardIds,
				},

				handleLogout,
				handleDragEnd,

				handleAddCard,
				handleMoveCards,
				handleUpdateCard,
				handleDeleteCard,
				handleArchiveCompleted,

				handleAddSwimlane,
				handleUpdateSwimlane,

				fetchSwimlanes,
				fetchColumns,
				fetchItems,

				setCardIds,
				setKanban,
				setFilterString,
			}}
		>
			<ChakraProvider>
				<Head>
					<title>Bird\'s Eye View</title>
					<meta
						name="description"
						content="Bird's Eye View :: Kanban"
					/>
					<link
						rel="icon"
						href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>"
					/>
				</Head>
				<Component {...pageProps} />
			</ChakraProvider>
		</AppContext.Provider>
	)
}

export default MyApp
