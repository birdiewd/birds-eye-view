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
} from '@chakra-ui/react'

import { useContext, useEffect, useMemo, useState } from 'react'
import AppContext from '../AppContext'

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

	const handleCardSave = (event) => {
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

	const handleControlEnter = (event) => {
		if (event.code === 'Enter' && event.ctrlKey) {
			handleCardSave()
		}
	}

	return (
		<Modal
			isOpen={Boolean(cardData)}
			onClose={() => setCardIds({ ...cardIds, swimlane: 0 })}
			// isCentered={true}
		>
			<ModalOverlay />
			<ModalContent
				// height={'70vh'}
				width={'70vw'}
				maxWidth={'1000'}
				overflow={'auto'}
			>
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
							<Textarea
								placeholder="Add your description here"
								onChange={(event) =>
									setDescription(event.target.value)
								}
								onKeyPress={handleControlEnter}
								value={
									description?.length
										? description
										: undefined
								}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} type="submit">
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
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	)
}

export default CardModal
