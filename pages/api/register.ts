import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";
import Joi from "joi"
import passwordComplexity from "joi-password-complexity"
import bcrypt from "bcrypt"

interface RegisteringUser {
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    phone_number: String
}

const validate = (data : RegisteringUser) => {
    const schema = Joi.object({
        first_name: Joi.string().required().label("First Name"),
        last_name: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        phone_number: Joi.string().pattern(/^(\+[0-9]{1,3})?[0-9]{7,10}$/).label("Phone number")
    })
    return schema.validate(data)
}

/**
 * Register endpoint
 * Axios - POST /api/register
 * Body data: {email: string, first_name: string, last_name: string, password: string, phone_number: string}
 * Returns {message: string}
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    // Register new user
    if (req.method === 'POST') {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const email_duplicate = await prisma.user.count({where: {email: req.body.email as string}})
        if (email_duplicate > 0) {
            return res.status(409).json({ message: "User with given email already exists!" })
        }
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await prisma.user.create({data: {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: hashPassword,
            phone_number: req.body.phone_number,
            role_id: 1,
            account_created_on: new Date()
        }})
        return res.status(201).json({ message: "User created successfully" })
    }
    res.status(500).json({message: "This HTTP method is not supported on this endpoint"})
}
  