import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { compareStrings, UserItem, usersColection } from '../utils/firebase';

export const useFetchAllUsers = (): UserItem[] => {
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    const unsubscribe = usersColection
      .onSnapshot(
        snapshot => setUsers(snapshot.docs
          .map(doc => doc.data())
          .sort((a: UserItem, b: UserItem) => compareStrings(a.email ?? '', b.email ?? ''))),
        err => console.log(err.message),
      );

    return () => unsubscribe();
  }, []);

  return users;
};

export default useFetchAllUsers;
