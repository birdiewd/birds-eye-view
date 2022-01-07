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
	BulletListExtension,
	CalloutExtension,
	CodeBlockExtension,
	createMarkPositioner,
	DropCursorExtension,
	HeadingExtension,
	ImageExtension,
	ItalicExtension,
	LinkExtension,
	OrderedListExtension,
	ShortcutHandlerProps,
	StrikeExtension,
	TaskListExtension,
} from 'remirror/extensions'

import {
	Remirror,
	ComponentItem,
	EditorComponent,
	FloatingToolbar,
	FloatingWrapper,
	useRemirror,
	useCommands,
	useActive,
	useCurrentSelection,
	useChainedCommands,
	useAttrs,
	ToolbarItemUnion,
	useUpdateReason,
	useExtension,
} from '@remirror/react'

import {
	LiteralUnion,
	prosemirrorNodeToHtml,
	htmlToProsemirrorNode,
	EditorStateProps,
} from 'remirror'

import {
	ReactElement,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react'

import 'remirror/styles/all.css'
import { Schema } from '@remirror/pm/model'
import { EditorState } from '@remirror/pm/state'

type RteEditorProps = {
	content: string
	handleControlEnter?: CallableFunction
	isEditable?: boolean
	setContent?: CallableFunction
}

const RteEditorWrapper = styled(Box)`
	position: relative;

	&:empty {
		display: none;
	}

	display: ${(props) =>
		props.isEditable
			? 'auto'
			: props.content?.trim()?.length
			? 'auto'
			: 'none'};

	.remirror-editor {
		&:empty {
			display: none;
		}
		padding: ${(props) => (props.isEditable ? '1rem' : '.5rem')};
		border: solid #0000001c 1px;
		border-radius: 0 0 0.5rem 0.5rem;
		transition: outline 150ms;
		overflow: ${(props) => (props.isEditable ? 'auto' : 'hidden')};

		min-height: ${(props) => (props.isEditable ? '10rem' : 'unset')};
		max-height: ${(props) => (props.isEditable ? 'unset' : '5rem')};

		&:focus-visible {
			outline: solid #4488dd 2px;
			outline-offset: -2px;
		}

		*::selection {
			color: yellow;
			background: black;
		}
	}

	.remirror-floating-popover {
		border: solid #00000055 1px;
		border-radius: 0.125rem;
		box-shadow: 2px 2px 10px #00000033;

		[role='group'] {
			display: flex;

			button {
				background: white;
				padding: 0.25rem;

				&:not(:last-child) {
					border-right: solid #00000055 1px;
				}
			}
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

	a {
		text-decoration: underline;
		color: #4488dd;
		pointer-events: ${(props) => (props.isEditable ? 'initial' : 'none')};
	}

	.ProseMirror-trailingBreak {
		display: ${(props) => (props.isEditable ? 'initial' : 'none')};
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

const RteEditor: NextPage<RteEditorProps> = ({
	content = ``,
	handleControlEnter,
	setContent,
	isEditable = false,
}) => {
	const { manager, state, setState } = useRemirror({
		extensions: () => [
			new BoldExtension(),
			new ItalicExtension(),
			new StrikeExtension(),
			new BulletListExtension(),
			new OrderedListExtension(),
			new TaskListExtension(),
			new HeadingExtension(),
			new CodeBlockExtension(),
			new ImageExtension({ enableResizing: isEditable }),
			new LinkExtension({ autoLink: true }),
			new DropCursorExtension(),
			new CalloutExtension({ defaultType: 'warn' }),
		],
		content: content,
		selection: 'start',
		stringHandler: 'html',
		builtin: { persistentSelectionClass: 'selection' },
	})

	const handleOnChange = (parameter: EditorStateProps): void => {
		const htmlString = prosemirrorNodeToHtml(parameter.state.doc)
		if (setContent) {
			setContent(htmlString)
		}
		setState(parameter.state)
	}

	useEffect(() => {
		if (!isEditable && content && state && htmlToProsemirrorNode) {
			const doc = htmlToProsemirrorNode({
				content,
				schema: state.schema,
			})

			if (doc) {
				manager.view.updateState(manager.createState({ content: doc }))
			}
		}
	}, [content, state, isEditable, htmlToProsemirrorNode])

	const handleOnKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (handleControlEnter) {
			const htmlString = prosemirrorNodeToHtml(state.doc)

			if (setContent) {
				setContent(htmlString)
			}

			handleControlEnter(event)
		}
	}

	return (
		<RteEditorWrapper
			onKeyDown={handleOnKeyDown}
			isEditable={isEditable}
			content={content}
		>
			<Remirror
				manager={manager}
				initialContent={state}
				onBlur={handleOnChange}
				editable={isEditable}
			>
				{isEditable && <Menu />}
				<Box
					as={EditorComponent}
					padding={isEditable ? '.5rem' : '0'}
				/>
				{isEditable && <FloatingLinkToolbar />}
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
	onClick: CallableFunction
	isEnabled: CallableFunction
	isActive: CallableFunction
	icon: ReactElement
}) => {
	const handleOnClick = () => {
		if (onClick) onClick()
	}

	return (
		<Tooltip label={label}>
			<IconButton
				className={`toolbar-icon ${isActive() ? 'active' : ''}`}
				aria-label={label}
				size={'sm'}
				onClick={handleOnClick}
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
		insertImage,
		toggleBold,
		toggleBulletList,
		toggleCodeBlock,
		toggleHeading,
		toggleItalic,
		toggleOrderedList,
		toggleStrike,
		toggleTaskList,
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
						chain
							.toggleCodeBlock({
								language: 'jsx',
							})
							.focus()
							.run()
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
##       #### ##    ## ##    ##
##        ##  ###   ## ##   ##
##        ##  ####  ## ##  ##
##        ##  ## ## ## #####
##        ##  ##  #### ##  ##
##        ##  ##   ### ##   ##
######## #### ##    ## ##    ##
*/

function useLinkShortcut() {
	const [linkShortcut, setLinkShortcut] = useState<
		ShortcutHandlerProps | undefined
	>()
	const [isEditing, setIsEditing] = useState(false)

	useExtension(
		LinkExtension,
		({ addHandler }) =>
			addHandler('onShortcut', (props) => {
				if (!isEditing) {
					setIsEditing(true)
				}

				return setLinkShortcut(props)
			}),
		[isEditing]
	)

	return { linkShortcut, isEditing, setIsEditing }
}

function useFloatingLinkState() {
	const chain = useChainedCommands()
	const { isEditing, linkShortcut, setIsEditing } = useLinkShortcut()
	const { to, empty } = useCurrentSelection()

	const url = (useAttrs().link()?.href as string) ?? ''
	const [href, setHref] = useState<string>(url)

	// A positioner which only shows for links.
	const linkPositioner = useMemo(
		() => createMarkPositioner({ type: 'link' }),
		[]
	)

	const onRemove = useCallback(() => {
		return chain.removeLink().focus().run()
	}, [chain])

	const updateReason = useUpdateReason()

	useLayoutEffect(() => {
		if (!isEditing) {
			return
		}

		if (updateReason.doc || updateReason.selection) {
			setIsEditing(false)
		}
	}, [isEditing, setIsEditing, updateReason.doc, updateReason.selection])

	useEffect(() => {
		setHref(url)
	}, [url])

	const submitHref = useCallback(() => {
		setIsEditing(false)
		const range = linkShortcut ?? undefined

		if (href === '') {
			chain.removeLink()
		} else {
			chain.updateLink({ href, auto: false, targe: '_blank' }, range)
		}

		chain.focus(range?.to ?? to).run()
	}, [setIsEditing, linkShortcut, chain, href, to])

	const cancelHref = useCallback(() => {
		setIsEditing(false)
	}, [setIsEditing])

	const clickEdit = useCallback(() => {
		if (empty) {
			chain.selectLink()
		}

		setIsEditing(true)
	}, [chain, empty, setIsEditing])

	const openPopout = useCallback(() => {
		window.open(url, '_blank')
	}, [url])

	return useMemo(
		() => ({
			href,
			setHref,
			linkShortcut,
			linkPositioner,
			isEditing,
			clickEdit,
			onRemove,
			openPopout,
			submitHref,
			cancelHref,
		}),
		[
			href,
			linkShortcut,
			linkPositioner,
			isEditing,
			clickEdit,
			onRemove,
			openPopout,
			submitHref,
			cancelHref,
		]
	)
}

const FloatingLinkToolbar = () => {
	const {
		isEditing,
		linkPositioner,
		clickEdit,
		onRemove,
		openPopout,
		submitHref,
		href,
		setHref,
		cancelHref,
	} = useFloatingLinkState()
	const active = useActive()
	const activeLink = active.link()
	const { empty } = useCurrentSelection()
	const linkEditItems: ToolbarItemUnion[] = useMemo(
		() => [
			{
				type: ComponentItem.ToolbarGroup,
				label: 'Link',
				items: activeLink
					? [
							{
								type: ComponentItem.ToolbarButton,
								onClick: () => clickEdit(),
								icon: 'pencilLine',
							},
							{
								type: ComponentItem.ToolbarButton,
								onClick: () => openPopout(),
								icon: 'externalLinkFill',
							},
							{
								type: ComponentItem.ToolbarButton,
								onClick: onRemove,
								icon: 'linkUnlink',
							},
					  ]
					: [
							{
								type: ComponentItem.ToolbarButton,
								onClick: () => clickEdit(),
								icon: 'link',
							},
					  ],
			},
		],
		[clickEdit, onRemove, activeLink]
	)

	const items: ToolbarItemUnion[] = useMemo(
		() => linkEditItems,
		[linkEditItems]
	)

	return (
		<>
			<FloatingToolbar
				items={items}
				positioner="selection"
				placement="top"
				enabled={!isEditing}
			/>
			<FloatingToolbar
				items={linkEditItems}
				positioner={linkPositioner}
				placement="bottom"
				enabled={!isEditing && empty}
			/>

			<FloatingWrapper
				positioner="always"
				placement="bottom"
				enabled={isEditing}
				renderOutsideEditor
			>
				<input
					style={{ zIndex: 20 }}
					autoFocus
					placeholder="Enter link..."
					onChange={(event) => setHref(event.target.value)}
					value={href}
					onKeyPress={(event) => {
						const { code } = event

						if (code === 'Enter') {
							submitHref()
						}

						if (code === 'Escape') {
							cancelHref()
						}
					}}
				/>
			</FloatingWrapper>
		</>
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
