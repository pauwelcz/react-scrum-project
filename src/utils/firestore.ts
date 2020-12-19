import 'firebase/auth';
import 'firebase/firestore';
import { categoriesCollection, Category, User } from '../utils/firebase';

export const saveCategory = async (category: Category, owner: User) => {
  try {
    await categoriesCollection.doc(category.id).set({
      id: category.id,
      name: category.name,
      color: category.color,
      project: category.project,
      by: {
        uid: owner.uid,
        email: owner.email,
      },
    });
  } catch (err) {
    console.log(`[Category submit] Error occurred ${err.message}`);
  }
};
