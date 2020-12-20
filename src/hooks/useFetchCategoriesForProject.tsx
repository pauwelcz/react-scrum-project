import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { categoriesCollection, Category, compareStrings } from '../utils/firebase';

export const useFetchCategoriesForProject = (projectId: string): Category[] => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const unsubscribe = categoriesCollection
      .where("project", "==", projectId ?? '')
      .onSnapshot(
        snapshot => setCategories(snapshot.docs
          .map(doc => doc.data())
          .sort((a: Category, b: Category) => compareStrings(a.name ?? '', b.name ?? ''))),
        err => console.log(err.message),
      );

    return () => unsubscribe();
  }, [projectId]);

  return categories;
}

export default useFetchCategoriesForProject;