import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma"
import Joi from "joi"
import jwt, { Secret } from "jsonwebtoken"
import bcrypt from "bcrypt"
import { setCookie } from 'cookies-next'
import { LoginUser } from './interfaces/user'

const SECRET_KEY: Secret = "3abFA7c2Quf52601SGMS5w780"

const generateAuthToken = (id: number) => {
    const token = jwt.sign({ _id: id.toString() }, SECRET_KEY, {
        expiresIn: "7d",
    })
    return token
}

const validate = (data : LoginUser) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.required().label("Password"),
    })
    return schema.validate(data)
}

/**
 * Login endpoint
 * Axios - POST /api/login
 * Body data: {email: string, password: string}
 * Returns {message: string}
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    // Authorize login
    if (req.method === 'POST') {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const user_found = await prisma.user.findFirst({where: {email: req.body.email as string}})
        if (user_found === null) {
            return res.status(401).json({ message: "Invalid E-mail or Password" })
        }
        const validPassword = await bcrypt.compare(req.body.password, user_found.password)
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid E-mail or Password" })
        }
        const token = generateAuthToken(user_found.id)
        setCookie('token', token, {req, res, maxAge: 60 * 60 * 24 * 7})
        return res.status(200).json({ message: "Logged in successfully" })
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}