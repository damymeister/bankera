const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteUser(req, res) {
  if (req.method === 'DELETE') {
    const { userId } = req.query;

    try {
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(userId) },
      });

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
