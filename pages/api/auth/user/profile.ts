import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import parseJwt from '@/lib/parse_jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
          let token = getCookie('token', { req, res });
          if (token !== undefined) {
                let token_json = parseJwt(token);
                let user_id = parseInt(token_json._id);
    
                const userProfile = await prisma.user.findUnique({
                    where: {
                        id: user_id,
                      },
                      select: {
                        first_name: true,
                        last_name: true,
                        email: true,
                        password: true,
                        phone_number: true,
                      },
                });
                if (!userProfile) {
                return res.status(404).json({ error: 'User not found.' });
                }
                const { first_name, last_name, email, password, phone_number } = userProfile;
                return res.status(200).json({ first_name, last_name, email, password, phone_number  });
            }
        }
        catch (error) {
            console.error('Error while managing request', error);
            return res.status(500).json({ error: 'Server error occured.' });
        }
    }
    
    if (req.method === 'PUT') {
        try {
          let token = getCookie('token', { req, res });
          if (token !== undefined) {
            let token_json = parseJwt(token);
            let user_id = parseInt(token_json._id);
    
            const updatedUserProfile = await prisma.user.update({
              where: {
                id: user_id,
              },
              data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password,
                phone_number: req.body.phone_number,
              },
            });
    
            return res.status(200).json({ message: 'User profile updated successfully.' });
          }
        } catch (error) {
          console.error('Error while managing request', error);
          return res.status(500).json({ error: 'Server error occurred.' });
        }
      }    
    
      if (req.method === 'DELETE') {
      try {
        let token = getCookie('token', { req, res });
        if (token !== undefined) {
          let token_json = parseJwt(token);
          let user_id = parseInt(token_json._id);
          
          const deletedUserProfile = await prisma.user.delete({
            where: {
              id: user_id,
            },
          });
          
          return res.status(200).json({ message: 'Your user profile deleted successfully.' });
        }
      } catch (error) {
        console.error('Error while managing request', error);
        return res.status(500).json({ error: 'Server error occurred.' });
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed.' });
  }