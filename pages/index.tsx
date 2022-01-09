import { NextPage } from 'next/types'
import {
	Flex,
	SimpleGrid,
	Heading,
	Button,
	Input,
	Badge,
} from '@chakra-ui/react'

import { useContext, ChangeEvent } from 'react'
import AppContext from '../AppContext'

import Swimlane from '../components/Swimlane'
import SwimlaneModal from '../components/SwimlaneModal'
import CardModal from '../components/CardModal'

import { SwimlaneDataProps } from '../components/Swimlane'

import background from './indexBackground'

const Home: NextPage = () => {
	const {
		handleLogout,
		handleArchiveCompleted,
		handleAddSwimlane,
		handleDragEnd,
		setKanban,
		setFilterString,
		state: { kanban, columns, items },
	} = useContext(AppContext)

	const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFilterString(event.currentTarget.value)
	}

	return (
		<main
			style={{
				padding: '1rem',
				backgroundColor: '#b8dac9',
				backgroundImage: background.backgroundImage,
				backgroundSize: 'cover',
				backgroundBlendMode: 'hard-light',
				minHeight: '100vh',
			}}
		>
			<Flex
				justifyContent={'flex-end'}
				alignItems={'center'}
				gap={'1rem'}
			>
				<Input
					placeholder="Filter"
					background={'#ffffff88'}
					borderColor={'#ffffff88'}
					borderWidth={2}
					fontWeight={500}
					_placeholder={{
						color: '#00000088',
					}}
					maxWidth={'15rem'}
					onChange={handleFilterChange}
				/>
				<Button colorScheme={'gray'} onClick={handleArchiveCompleted}>
					Archive Completed
				</Button>
				<Button colorScheme={'green'} onClick={handleAddSwimlane}>
					Add Swimlane
				</Button>
				<Button colorScheme={'orange'} onClick={handleLogout}>
					Logout
				</Button>
			</Flex>

			<SimpleGrid gap={'1rem'} columns={columns.length} mt={'1rem'}>
				{columns.map((column: { name: string; id: string }) => (
					<Flex
						key={`heading-${column.id}`}
						gap={'.5rem'}
						justifyContent={'center'}
						padding={'.5rem 0'}
						style={{ marginBottom: '.125rem' }}
						textColor={'white'}
						bgColor={'#000000aa'}
						borderRadius={'.25rem'}
					>
						<Heading as="h2" size={'sm'}>
							{column.name}
						</Heading>
						<Badge>
							{
								items.filter(
									({
										is_active,
										is_archived,
										column_id,
									}: {
										is_active: boolean
										is_archived: boolean
										column_id: string
									}) =>
										is_active &&
										!is_archived &&
										column_id === column.id
								).length
							}
						</Badge>
					</Flex>
				))}
			</SimpleGrid>

			{kanban?.map((swimlane: SwimlaneDataProps) => (
				<Swimlane
					swimlane={swimlane}
					handleDragEnd={handleDragEnd}
					kanban={kanban}
					setKanban={setKanban}
					key={swimlane.id}
				/>
			))}

			<CardModal />
		</main>
	)
}

export default Home
