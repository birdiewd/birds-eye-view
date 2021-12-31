import { NextPage } from 'next/types'
import {
	Flex,
	SimpleGrid,
	Heading,
	Button,
	Input,
	Box,
	Badge,
} from '@chakra-ui/react'

import { useContext } from 'react'
import AppContext from '../AppContext'

import Swimlane from '../components/Swimlane'
import CardModal from '../components/CardModal'

const backgroundGradientOne = '#665779'.replace('#', '')
const backgroundGradientTwo = '#ff8484'.replace('#', '')
const backgroundCircleColor = '#76c273'.replace('#', '')

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='1440' preserveAspectRatio='none' viewBox='0 0 1440 1440'%3e%3cg clip-path='url(%26quot%3b%23SvgjsClipPath1453%26quot%3b)' fill='none'%3e%3crect width='1440' height='1440' x='0' y='0' fill='url(%23SvgjsRadialGradient1454)'%3e%3c/rect%3e%3ccircle r='240' cx='117.51' cy='214.8' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='144.265' cx='1410.04' cy='740.16' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='121.215' cx='1426.04' cy='367.99' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='204.2' cx='88.89' cy='1.36' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='127.585' cx='659.47' cy='799.75' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='210.2' cx='9.93' cy='237.1' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='174.17' cx='96.38' cy='886.62' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='415.42' cx='1097.91' cy='395.91' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='168.365' cx='506.07' cy='1090.16' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='421.445' cx='744.72' cy='1187.61' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='317.45' cx='960.17' cy='1167.94' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='433.305' cx='687.82' cy='283.72' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='188.415' cx='1320.73' cy='1243.83' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='334.13' cx='1028.24' cy='4.3' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='460.745' cx='57.77' cy='783.25' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='269.985' cx='672.82' cy='466.53' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='270.745' cx='590.49' cy='1082.68' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='167.18' cx='929.69' cy='334.33' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='283.765' cx='639.57' cy='641.89' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='287.38' cx='1062.82' cy='714.28' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='398.625' cx='1283.21' cy='93.88' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='241.72' cx='138.57' cy='180.27' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='465.84' cx='1262.14' cy='725.23' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='187.26' cx='724.94' cy='1063.2' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='390.505' cx='569' cy='1235.26' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='320.22' cx='677.72' cy='231.27' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='287.935' cx='1207.52' cy='309.77' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='359.66' cx='1336.28' cy='852.88' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='241.23' cx='267.51' cy='1112.17' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='183.325' cx='22.91' cy='929.27' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='436.055' cx='1201.31' cy='159.73' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='312.675' cx='383.63' cy='545.37' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='408.585' cx='1214.42' cy='1405.94' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='316.07' cx='349.2' cy='1201.78' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='328.675' cx='237.07' cy='514.72' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='162.94' cx='767.55' cy='251.24' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='325.605' cx='321.19' cy='4.01' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='254.815' cx='587.35' cy='410.94' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='330.065' cx='451.51' cy='1093.11' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='192.315' cx='287.63' cy='241.15' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='125.445' cx='280.57' cy='333.07' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='128.39' cx='1145.24' cy='315.41' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='128.92' cx='434.7' cy='118.8' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='462.85' cx='893.6' cy='1033.94' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='457.395' cx='830.72' cy='145.47' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='268.18' cx='374.65' cy='1316.72' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='440.42' cx='900.38' cy='664.87' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='457.42' cx='754.3' cy='1196.99' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='362.84' cx='832.45' cy='1086.22' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='447.625' cx='546.74' cy='386.92' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='160.03' cx='246.86' cy='672.97' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='199.995' cx='459.12' cy='611.02' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='402.07' cx='955.59' cy='1269.82' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='320.865' cx='222.2' cy='780.82' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='263.755' cx='416.56' cy='1037.95' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='322.635' cx='204.33' cy='999.87' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='374.67' cx='476.32' cy='62.15' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='219.61' cx='771.55' cy='652.19' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='344.92' cx='628.01' cy='630.68' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='212.195' cx='606.07' cy='620.47' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='150.64' cx='1068.49' cy='1384.11' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='204.515' cx='1115.61' cy='214.91' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='161.835' cx='986.3' cy='630.82' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='262.875' cx='439.12' cy='1249.91' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='324.49' cx='489.65' cy='327.98' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='165.75' cx='1177.82' cy='1115.3' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='160.84' cx='499.64' cy='257.1' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='363.77' cx='315.31' cy='1242.54' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='256.99' cx='428.53' cy='178.42' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='214.12' cx='545.61' cy='895.99' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3ccircle r='232.895' cx='1390.19' cy='145.53' stroke='%23${backgroundCircleColor}' stroke-opacity='0.2' stroke-width='2'%3e%3c/circle%3e%3c/g%3e%3cdefs%3e%3cclipPath id='SvgjsClipPath1453'%3e%3crect width='1440' height='1440' x='0' y='0'%3e%3c/rect%3e%3c/clipPath%3e%3cradialGradient cx='50%25' cy='0%25' r='1609.97' gradientUnits='userSpaceOnUse' id='SvgjsRadialGradient1454'%3e%3cstop stop-color='%23${backgroundGradientOne}' offset='0.34'%3e%3c/stop%3e%3cstop stop-color='%23${backgroundGradientTwo}' offset='0.9'%3e%3c/stop%3e%3c/radialGradient%3e%3c/defs%3e%3c/svg%3e")`

const Home: NextPage = () => {
	const {
		handleLogout,
		handleArchiveCompleted,
		handleDragEnd,
		setKanban,
		setFilterString,
		state: { kanban, columns, items },
	} = useContext(AppContext)

	const handleFilterChange = (event) => {
		console.log({ event })
		setFilterString(event.target.value)
	}

	return (
		<main
			style={{
				padding: '1rem',
				backgroundColor: '#b8dac9',
				backgroundImage: backgroundImage,
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
				<Button colorScheme={'green'} onClick={handleArchiveCompleted}>
					Archive Completed
				</Button>
				<Button colorScheme={'orange'} onClick={handleLogout}>
					Logout
				</Button>
			</Flex>

			<SimpleGrid gap={'1rem'} columns={columns.length} mt={'1rem'}>
				{columns.map((column) => (
					<Flex
						gap={'.5rem'}
						justifyContent={'center'}
						padding={'.5rem 0'}
						style={{ marginBottom: '.125rem' }}
						textColor={'white'}
						bgColor={'#000000aa'}
						borderRadius={'.25rem'}
					>
						<Heading
							key={`heading-${column.id}`}
							as="h2"
							size={'sm'}
						>
							{column.name}
						</Heading>
						<Badge>
							{
								items.filter(
									({ column_id }) => column_id === column.id
								).length
							}
						</Badge>
					</Flex>
				))}
			</SimpleGrid>

			{kanban?.map((swimlane) => (
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
