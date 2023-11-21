import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import parseJwt from '@/lib/parse_jwt'
import bcrypt from "bcrypt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        let token = getCookie('token', { req, res });
        if (token === undefined) return res.status(401).json({ error: 'No token provided.' })
        let token_json = parseJwt(token);
        let user_id = parseInt(token_json._id);
        const user = await prisma.user.findUnique({where: {id: user_id}})
        if (user === null) return res.status(401).json({ error: 'No user found.' })
        // Check old password
        const validPassword = await bcrypt.compare(req.body.old_password, user.password)
        if (!validPassword) return res.status(401).json({ error: 'Incorrect Password' })
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(req.body.new_password, salt)
        await prisma.user.update({where: {id: user_id}, data: {password: hashPassword}})
        return res.status(200).json({ message: 'Password has been updated' })
    }
    return res.status(405).json({ error: 'Method not allowed.' })
}