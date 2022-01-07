import { NextPage } from 'next/types'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Input,
	FormControl,
	FormLabel,
	Textarea,
	Flex,
} from '@chakra-ui/react'

import {
	FormEvent,
	ReactEventHandler,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import AppContext from '../AppContext'

import Editor from './Editor'
import { KeyboardEventHandler } from 'remirror/extensions'

const CardModal: NextPage = () => {
	const {
		setCardIds,
		handleAddCard,
		handleUpdateCard,
		handleDeleteCard,
		state: { items, cardIds, columns },
	} = useContext(AppContext)

	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [tempDescription, setTempDescription] = useState('')

	const cardData = useMemo(() => {
		if (cardIds.swimlane) {
			return (
				items.filter(({ id }) => id === cardIds.item)[0] || {
					swimlaneId: cardIds.swimlane,
					columnId: columns[0].id,
				}
			)
		}
	}, [cardIds])

	useEffect(() => {
		setName(cardData?.name)
		setDescription(cardData?.description)
	}, [cardData])

	const handleCardSave = (event?: FormEvent) => {
		if (event) {
			event.preventDefault()
		}

		if (cardData?.id) {
			// upsert
			handleUpdateCard(cardData.id, name, description)
		} else {
			// insert
			handleAddCard(cardData.swimlaneId, name, description)
		}
	}

	const handleControlEnter = (event: KeyboardEvent) => {
		if (event.code === 'Enter' && (event.ctrlKey || event.metaKey)) {
			handleCardSave()
		}
	}

	return (
		<Modal
			isOpen={Boolean(cardData)}
			onClose={() => setCardIds({ ...cardIds, swimlane: 0 })}
		>
			<ModalOverlay />
			<ModalContent width={'70vw'} maxWidth={'1000'} overflow={'auto'}>
				<form onSubmit={handleCardSave}>
					<ModalHeader>Modal Title</ModalHeader>
					<ModalBody>
						<FormControl mt={4} isRequired={true}>
							<FormLabel>Name</FormLabel>
							<Input
								placeholder="Name"
								onChange={(event) =>
									setName(event.target.value)
								}
								value={name}
							/>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Description</FormLabel>

							<Editor
								content={description}
								setContent={setDescription}
								handleControlEnter={handleControlEnter}
								isEditable={true}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Flex gap={'.5rem'} justifyContent={'flex-end'}>
							<Button colorScheme="blue" type="submit">
								Save
							</Button>
							<Button
								colorScheme="red"
								onClick={() => handleDeleteCard()}
							>
								Delete
							</Button>
							<Button
								variant="ghost"
								onClick={() =>
									setCardIds({ ...cardIds, swimlane: 0 })
								}
							>
								Cancel
							</Button>
						</Flex>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	)
}

export default CardModal
