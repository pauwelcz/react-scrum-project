import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Project, projectsCollection } from '../utils/firebase';

export const useFetchProject = (projectId: string): Project | undefined => {
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const unsubscribe = projectsCollection
      .doc(projectId ?? '')
      .onSnapshot(
        doc => setProject(doc.data()),
        error => console.log(error.message)
      );

    return () => unsubscribe();
  }, [projectId]);


  return project;
};

export default useFetchProject;