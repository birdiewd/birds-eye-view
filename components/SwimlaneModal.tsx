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
	Flex,
} from '@chakra-ui/react'

import { FormEvent, useContext, useEffect, useMemo, useState } from 'react'
import AppContext from '../AppContext'

const CardModal: NextPage = () => {
	const {
		setCardModalData,
		handleAddCard,
		handleUpdateCard,
		handleDeleteCard,
		state: { items, cardModalData, columns },
	} = useContext(AppContext)

	const [name, setName] = useState('')

	const cardData = useMemo(() => {
		if (cardModalData.swimlane) {
			return (
				items.filter(({ id }) => id === cardModalData.item)[0] || {
					swimlaneId: cardModalData.swimlane,
					columnId: columns[0].id,
				}
			)
		}
	}, [cardModalData])

	useEffect(() => {
		setName(cardData?.name)
	}, [cardData])

	const handleCardSave = (event?: FormEvent) => {
		if (event) {
			event.preventDefault()
		}

		if (cardData?.id) {
			// upsert
			handleUpdateSwimlane(swimlaneData.id, name)
		} else {
			// insert
			handleAddSwimlane(name)
		}
	}

	return (
		<Modal
			isOpen={Boolean(cardData)}
			onClose={() => setCardModalData({ ...cardModalData, swimlane: 0 })}
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
									setCardModalData({
										...cardModalData,
										swimlane: 0,
									})
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
