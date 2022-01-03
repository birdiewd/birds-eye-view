import { NextPage } from 'next/types'

import { Box, IconButton, Flex, Tooltip } from '@chakra-ui/react'

import {
	FaBold,
	FaCode,
	FaHeading,
	FaImage,
	FaItalic,
	FaListAlt,
	FaListOl,
	FaListUl,
	FaStrikethrough,
} from 'react-icons/fa'

import styled from 'styled-components'

import {
	BoldExtension,
	CalloutExtension,
	ItalicExtension,
	StrikeExtension,
	CodeBlockExtension,
	BulletListExtension,
	OrderedListExtension,
	TaskListExtension,
	ImageExtension,
	DropCursorExtension,
	HeadingExtension,
	LinkExtension,
} from 'remirror/extensions'
import {
	Remirror,
	EditorComponent,
	useRemirror,
	useCommands,
	useActive,
	useChainedCommands,
} from '@remirror/react'
import { ReactElement } from 'react'
import 'remirror/styles/all.css'

type RteEditorProps = {
	itemId?: string
	content?: Array<any>
	onChange?: any
}

const RteEditorWrapper = styled(Box)`
	position: relative;

	.remirror-editor {
		padding: 1rem;
		border: solid #0000001c 1px;
		border-radius: 0 0 0.25rem 0.25rem;
		transition: outline 150ms;

		&:focus-visible {
			outline: solid #4488dd 2px;
			outline-offset: -2px;
		}

		*::selection {
			color: yellow;
			background: black;
		}
	}

	.toolbar {
		gap: 0.5rem;
		border-radius: 0.25rem 0.25rem 0 0;
		top: 1px;
		left: 1px;
		right: 1px;
		background: #00002211;
		padding: 0.25rem;
		border: solid #00000033 1px;
		border-bottom-width: 2px;

		.toolbar-group {
			gap: 0.25rem;
		}

		.toolbar-icon {
			background-color: #00002222;

			&.active {
				color: white;
				background-color: #555588ff;
			}
		}
	}

	ul,
	ol {
		margin-left: 2rem;
	}

	h1,
	h2,
	h3 {
		font-weight: bold;
		display: block;
	}
	h1 {
		font-size: 3rem;
	}
	h2 {
		font-size: 2rem;
	}
	h3 {
		font-size: 1.5rem;
	}
`

/*
 ######   #######  ##     ## ########   #######  ##    ## ######## ##    ## ########
##    ## ##     ## ###   ### ##     ## ##     ## ###   ## ##       ###   ##    ##
##       ##     ## #### #### ##     ## ##     ## ####  ## ##       ####  ##    ##
##       ##     ## ## ### ## ########  ##     ## ## ## ## ######   ## ## ##    ##
##       ##     ## ##     ## ##        ##     ## ##  #### ##       ##  ####    ##
##    ## ##     ## ##     ## ##        ##     ## ##   ### ##       ##   ###    ##
 ######   #######  ##     ## ##         #######  ##    ## ######## ##    ##    ##
*/

const RteEditor: NextPage<RteEditorProps> = ({ content, itemId }) => {
	const { manager, state, onChange } = useRemirror({
		extensions: () => [
			new BoldExtension(),
			new ItalicExtension(),
			new StrikeExtension(),
			new BulletListExtension(),
			new OrderedListExtension(),
			new CodeBlockExtension(),
			new TaskListExtension(),
			new HeadingExtension(),
			new ImageExtension({ enableResizing: true }),
			new DropCursorExtension(),
			new LinkExtension({ autoLink: true }),
			// ===
			new CalloutExtension({ defaultType: 'warn' }),
		],
		content: '',
		selection: 'start',
		stringHandler: 'html',
		builtin: { persistentSelectionClass: 'selection' },
	})

	return (
		<RteEditorWrapper>
			<Remirror manager={manager} initialContent={state}>
				<Menu />
				<Box as={EditorComponent} padding={'.5rem'} />
			</Remirror>
		</RteEditorWrapper>
	)
}

/*
########  #######   #######  ##       ########     ###    ########
   ##    ##     ## ##     ## ##       ##     ##   ## ##   ##     ##
   ##    ##     ## ##     ## ##       ##     ##  ##   ##  ##     ##
   ##    ##     ## ##     ## ##       ########  ##     ## ########
   ##    ##     ## ##     ## ##       ##     ## ######### ##   ##
   ##    ##     ## ##     ## ##       ##     ## ##     ## ##    ##
   ##     #######   #######  ######## ########  ##     ## ##     ##
*/

const MenuSpacer = () => (
	<Box height={'2rem'} width={'1px'} background={'#00000022'} />
)

const MenuItem = ({
	label,
	onClick,
	isEnabled,
	isActive,
	icon,
}: {
	label: string
	onClick: any
	isEnabled: any
	isActive: any
	icon: ReactElement
}) => {
	return (
		<Tooltip label={label}>
			<IconButton
				className={`toolbar-icon ${isActive() ? 'active' : ''}`}
				aria-label={label}
				size={'sm'}
				onClick={onClick}
				disabled={isEnabled() === false}
				icon={icon}
			/>
		</Tooltip>
	)
}

const Menu = () => {
	const active = useActive(true)
	const chain = useChainedCommands()
	const {
		toggleBold,
		toggleItalic,
		toggleStrike,
		toggleBulletList,
		toggleOrderedList,
		toggleCodeBlock,
		toggleTaskList,
		toggleHeading,
		insertImage,
	} = useCommands()

	return (
		<Flex className="toolbar">
			{/* font style */}
			<Flex className="toolbar-group">
				<MenuItem
					label="Bold"
					onClick={() => {
						chain.toggleBold().focus().run()
					}}
					isActive={active.bold}
					isEnabled={toggleBold.enabled}
					icon={<FaBold />}
				/>
				<MenuItem
					label="Italic"
					onClick={() => {
						chain.toggleItalic().focus().run()
					}}
					isActive={active.italic}
					isEnabled={toggleItalic.enabled}
					icon={<FaItalic />}
				/>
				<MenuItem
					label="Strike-through"
					onClick={() => {
						chain.toggleStrike().focus().run()
					}}
					isActive={active.strike}
					isEnabled={toggleStrike.enabled}
					icon={<FaStrikethrough />}
				/>
			</Flex>
			<MenuSpacer />
			<Flex className="toolbar-group">
				<MenuItem
					label="H1"
					onClick={() => {
						chain.toggleHeading({ level: 1 }).focus().run()
					}}
					isActive={() => active.heading({ level: 1 })}
					isEnabled={() => toggleHeading.enabled({ level: 1 })}
					icon={<FaHeading />}
				/>
				<MenuItem
					label="H2"
					onClick={() => {
						chain.toggleHeading({ level: 2 }).focus().run()
					}}
					isActive={() => active.heading({ level: 2 })}
					isEnabled={() => toggleHeading.enabled({ level: 2 })}
					icon={<FaHeading />}
				/>
				<MenuItem
					label="H3"
					onClick={() => {
						chain.toggleHeading({ level: 3 }).focus().run()
					}}
					isActive={() => active.heading({ level: 3 })}
					isEnabled={() => toggleHeading.enabled({ level: 3 })}
					icon={<FaHeading />}
				/>
			</Flex>

			<MenuSpacer />
			{/* list styles */}
			<Flex className="toolbar-group">
				<MenuItem
					label="Unordered List"
					onClick={() => {
						chain.toggleBulletList().focus().run()
					}}
					isActive={active.bulletList}
					isEnabled={toggleBulletList.enabled}
					icon={<FaListUl />}
				/>
				<MenuItem
					label="Ordered List"
					onClick={() => {
						chain.toggleOrderedList().focus().run()
					}}
					isActive={active.orderedList}
					isEnabled={toggleOrderedList.enabled}
					icon={<FaListOl />}
				/>
				<MenuItem
					label="Task List"
					onClick={() => {
						chain.toggleTaskList().focus().run()
					}}
					isActive={active.taskList}
					isEnabled={toggleTaskList.enabled}
					icon={<FaListAlt />}
				/>
			</Flex>
			<MenuSpacer />
			{/* block styles */}
			<Flex className="toolbar-group">
				<MenuItem
					label="Code Block"
					onClick={() => {
						chain.toggleCodeBlock().focus().run()
					}}
					isActive={active.codeBlock}
					isEnabled={toggleCodeBlock.enabled}
					icon={<FaCode />}
				/>
				<MenuItem
					label="Image"
					onClick={async () => {
						const width = Math.floor(120 + Math.random() * 30)
						const height = Math.floor(30 + Math.random() * 30)
						// push image to supabase
						chain
							.insertImage({
								src: `https://via.placeholder.com/${width}x${height}`,
							})
							.focus()
							.run()
					}}
					isActive={active.image}
					isEnabled={insertImage.enabled}
					icon={<FaImage />}
				/>
			</Flex>
		</Flex>
	)
}

/*
##       ########    ###    ##     ## ########  ######
##       ##         ## ##   ##     ## ##       ##    ##
##       ##        ##   ##  ##     ## ##       ##
##       ######   ##     ## ##     ## ######    ######
##       ##       #########  ##   ##  ##             ##
##       ##       ##     ##   ## ##   ##       ##    ##
######## ######## ##     ##    ###    ########  ######
*/

/*
########  ##        #######   ######  ##    ##  ######
##     ## ##       ##     ## ##    ## ##   ##  ##    ##
##     ## ##       ##     ## ##       ##  ##   ##
########  ##       ##     ## ##       #####     ######
##     ## ##       ##     ## ##       ##  ##         ##
##     ## ##       ##     ## ##    ## ##   ##  ##    ##
########  ########  #######   ######  ##    ##  ######
*/

/*
######## ##     ## ########   #######  ########  ########
##        ##   ##  ##     ## ##     ## ##     ##    ##
##         ## ##   ##     ## ##     ## ##     ##    ##
######      ###    ########  ##     ## ########     ##
##         ## ##   ##        ##     ## ##   ##      ##
##        ##   ##  ##        ##     ## ##    ##     ##
######## ##     ## ##         #######  ##     ##    ##
*/

export default RteEditor
