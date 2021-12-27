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
import Link from 'next/link'
import { ChangeEvent, FormEvent, useState } from 'react'
import { supabaseClient } from '../lib/client'

const SignIn = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [error, setError] = useState(null)

	const submitHandler = async (event: FormEvent) => {
		event.preventDefault()
		setIsLoading(true)
		setError(null)
		try {
			const { error } = await supabaseClient.auth.signIn({
				email,
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
		}
	}

	const changeHandler = (event: ChangeEvent) => {
		switch (event.target.id) {
			case 'password':
				setPassword(event.target.value)

				break

			case 'email':
				setEmail(event.target.value)
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
								<FormControl id="email">
									<FormLabel>Email address</FormLabel>
									<Input
										name="email"
										type="email"
										autoComplete="email"
										required
										value={email}
										onChange={changeHandler}
									/>
								</FormControl>
								<FormControl id="password">
									<FormLabel>Password</FormLabel>
									<Input
										name="password"
										type="password"
										autoComplete="password"
										required
										value={password}
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
									Sign in
								</Button>
								<Link href="/signup">
									<a>Sign up</a>
								</Link>
								<Link href="/recover">
									<a>Forgot your password?</a>
								</Link>
							</Stack>
						</chakra.form>
					)}
				</Box>
			</Box>
		</Box>
	)
}

export default SignIn
