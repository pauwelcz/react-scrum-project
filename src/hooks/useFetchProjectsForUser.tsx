import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { compareStrings, Project, projectsCollection } from '../utils/firebase';

export const useFetchProjectsForUser = (userId: string): Project[] => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const unsubscribe = projectsCollection
      .where("users", "array-contains", userId ?? '')
      .onSnapshot(
        snapshot => setProjects(snapshot.docs
          .map(doc => doc.data())
          .sort((a: Project, b: Project) => compareStrings(a.name ?? '', b.name ?? ''))),
        err => console.log(err.message),
      );

    return () => unsubscribe();
  }, [userId]);

  return projects;
}

export default useFetchProjectsForUser;