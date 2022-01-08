import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseClient } from '../../../lib/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.query

	if (req.method === 'GET') {
		const { data, error: fetchError } = await supabaseClient.storage
			.from('item-images')
			.createSignedUrl(id, 300)

		const imageData = await fetch(data?.signedURL)

		console.log({ imageData: imageData.body })

		if (imageData) {
			return res.send(imageData.body)
		}
	}

	return res.status(400).json({
		message: 'Unsupported Request',
	})
}
