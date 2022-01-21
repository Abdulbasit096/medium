import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'
import {config} from '../../sanity-config';


const client = sanityClient(config);


export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {_id , name, email , comment} = JSON.parse(req.body);

    try {
        await client.create({
            _type: 'comment',
            post: {
                _type: 'reference',
                _ref: _id
            },
            name,   
            email,
            comment
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error, message: 'Something went wrong' })
    }

    return res.status(200).json({ message: 'Comment created' })

}
