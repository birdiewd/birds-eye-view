import {
	Alert,
	AlertIcon,
	Box,
	Button,
	chakra,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useState } from 'react'
import { supabaseClient } from '../lib/client'

const Reset = () => {
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const router = useRouter()

	const submitHandler = async (event: FormEvent) => {
		event.preventDefault()

		if (password !== passwordConfirm && password.trim().length < 6) {
			setError('Passwords must match')
		}

		setIsLoading(true)
		setError(null)
		try {
			const { error } = await supabaseClient.auth.update({
				password,
			})
			if (error) {
				setError(error.message)
			} else {
				setIsSubmitted(true)
			}
		} catch (error) {
			setError(error.message)
		} finally {
			setIsLoading(false)
			router.push('/')
		}
	}

	const changeHandler = (event: ChangeEvent) => {
		switch (event.target.id) {
			case 'password':
				setPassword(event.target.value)

				break

			case 'passwordConfirm':
				setPasswordConfirm(event.target.value)
				break
		}
	}

	return (
		<Box minH="100vh" py="12" px={{ base: '4', lg: '8' }} bg="gray.50">
			<Box maxW="md" mx="auto">
				<Heading textAlign="center" m="6">
					Welcome to Todo App
				</Heading>
				{error && (
					<Alert status="error" mb="6">
						<AlertIcon />
						<Text textAlign="center">{error}</Text>
					</Alert>
				)}
				<Box
					py="8"
					px={{ base: '4', md: '10' }}
					shadow="base"
					rounded={{ sm: 'lg' }}
					bg="white"
				>
					{isSubmitted ? (
						<Heading size="md" textAlign="center" color="gray.600">
							You are being logged in.
						</Heading>
					) : (
						<chakra.form onSubmit={submitHandler}>
							<Stack spacing="6">
								<FormControl id="password">
									<FormLabel>New Password</FormLabel>
									<Input
										name="password"
										type="password"
										autoComplete="password"
										required
										value={password}
										onChange={changeHandler}
									/>
								</FormControl>
								<FormControl id="passwordConfirm">
									<FormLabel>Confirm Password</FormLabel>
									<Input
										name="passwordConfirm"
										type="password"
										autoComplete="passwordConfirm"
										required
										isInvalid={password !== passwordConfirm}
										value={passwordConfirm}
										onChange={changeHandler}
									/>
								</FormControl>
								<Button
									type="submit"
									colorScheme="blue"
									size="lg"
									fontSize="md"
									isLoading={isLoading}
								>
									Reset Password
								</Button>
							</Stack>
						</chakra.form>
					)}
				</Box>
			</Box>
		</Box>
	)
}

export default Reset
