import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { categoriesCollection, Category } from '../utils/firebase';

export const useFetchCategoriesForProject = (taskId: string): Category[] => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const unsubscribe = categoriesCollection.where("project", "==", taskId).onSnapshot(
      snapshot => {
        const categories = snapshot.docs.map(doc => doc.data());
        console.log("Found categories:");
        console.log(categories);
        setCategories(categories);
      },
      err => console.log(err.message),
    );

    return unsubscribe;
  }, [taskId]);

  return categories;
}

export default useFetchCategoriesForProject;