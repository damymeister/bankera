import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import parseJwt from '@/lib/parse_jwt'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    if (req.method === 'GET') {
        let posts = await prisma.post.findMany()
        return res.status(200).json(posts)
    }
    if (req.method === 'POST') {
        let token = getCookie('token', {req, res})
        if (token !== undefined) {
            let token_json = parseJwt(token)
            let user_id = parseInt(token_json._id)

            let image_href = req.body.image || '/images/empty-photo.jpg';

            await prisma.post.create({data: {
                    title: req.body.title,
                    content: req.body.content, 
                    posted_on: new Date(), 
                    user_id: user_id, 
                    image_href: image_href,
                }
            })
            return res.status(200).json({message: "Post created"})
        }
        return res.status(500).json({message: "Failed to create post"})
    }
    if (req.method === 'PUT') {
        let token = getCookie('token', {req, res})
        let image_href = req.body.image || '/images/empty-photo.jpg';
        if (token !== undefined) {
            if (req.body.id !== undefined && !Array.isArray(req.body.id)) {
                await prisma.post.update({where: {id: parseInt(req.body.id)}, data: {title: req.body.title, content: req.body.content, image_href: image_href}})
                return res.status(200).json({message: "Post edited"})
            }
        }
        return res.status(500).json({message: "Failed to edit post"})
    }
    if (req.method === 'DELETE') {
        if (req.body.id !== undefined && !Array.isArray(req.body.id)) {
            await prisma.post.delete({where: {id: parseInt(req.body.id)}})
            return res.status(200).json({message: "Post deleted"})
        }
        return res.status(500).json({message: "Failed to delete post"})
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}