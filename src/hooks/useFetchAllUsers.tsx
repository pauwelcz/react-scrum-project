import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { UserItem, usersColection } from '../utils/firebase';

export const useFetchAllUsers = (): UserItem[] => {
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    const unsubscribe = usersColection.onSnapshot(
      snapshot => setUsers(snapshot.docs.map(doc => doc.data())),
      err => console.log(err.message),
    );

    return unsubscribe;
  }, []);

  return users;
};

export default useFetchAllUsers;
