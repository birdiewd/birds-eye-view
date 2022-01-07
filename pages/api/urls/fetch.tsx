import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	return res.status(200).json({
		success: 1,
		meta: {
			title: 'CodeX Team',
			description:
				'Club of web-development, design and marketing. We build team learning how to build full-valued projects on the world market.',
			image: {
				url: 'https://codex.so/public/app/img/meta_img.png',
			},
		},
	})
}
