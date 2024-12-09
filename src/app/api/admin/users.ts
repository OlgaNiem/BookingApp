// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/MongodbClient';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../../../lib/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, AuthOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access Denied' });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection('users').find().toArray();
  
  res.status(200).json(users);
}
