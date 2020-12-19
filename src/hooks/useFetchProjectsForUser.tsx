import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { projectsCollection, Project } from '../utils/firebase';

export const useFetchCategoriesForProject = (userId: string): Project[] => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const unsubscribe = projectsCollection.where("users", "array-contains", userId).onSnapshot(
      snapshot => {
        const projectsFromFS = snapshot.docs.map(doc => doc.data());
        console.log("Found projects:");
        console.log(projectsFromFS);
        setProjects(projectsFromFS);
      },
      err => console.log(err.message),
    );

    return () => unsubscribe();
  }, [userId]);

  return projects;
}

export default useFetchCategoriesForProject;