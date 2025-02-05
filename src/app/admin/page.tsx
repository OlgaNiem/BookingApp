'use client'
import { useEffect, useState } from 'react';
import { WithId, Document } from 'mongodb';
import clientPromise from '../../../lib/MongodbClient';
import { User } from '../../../types';

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const client = await clientPromise;
        const db = client.db();

        const users: WithId<Document>[] = await db.collection('users').find().toArray();

        const typedUsers: User[] = users.map((user) => ({
          _id: user._id.toString(),
          email: user.email,
          role: user.role,
        }));

        setUsers(typedUsers);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
