import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { categoriesCollection, Category } from '../utils/firebase';

export const useFetchCategoriesForProject = (projectId: string): Category[] => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const unsubscribe = categoriesCollection.where("project", "==", projectId).onSnapshot(
      snapshot => setCategories(snapshot.docs.map(doc => doc.data())),
      err => console.log(err.message),
    );

    return () => unsubscribe();
  }, [projectId]);

  return categories;
}

export default useFetchCategoriesForProject;