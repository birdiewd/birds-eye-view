import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
// import { AuthSession, AuthChangeEvent } from '@supabase/supabase-js'
// import moment from 'moment'

import AppContext from '../AppContext'
import { supabaseClient } from '../lib/client'
import customTheme from '../lib/theme'
import Head from 'next/head'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const user = supabaseClient.auth.user()

	const logoutHandler = async () => {
		try {
			await supabaseClient.auth.signOut()
			router.push('/signin')
		} catch (error) {
			router.push('/signin')
		}
	}

	const unAuthedPathes = ['/signin', '/recover', '/reset', '/signup']

	useEffect(() => {
		if (!user && !unAuthedPathes.includes(router.pathname)) {
			router.push('/signin')
		}
	}, [user, router])

	useEffect(() => {
		if (user) {
			console.log({ user })

			if (unAuthedPathes.includes(router.pathname)) {
				router.push('/')
			}
		}
	}, [router.pathname, user, router])

	return (
		<AppContext.Provider
			value={{
				state: {
					user,
				},
				logout: logoutHandler,
			}}
		>
			<ChakraProvider theme={customTheme}>
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
