import 'firebase/auth';
import 'firebase/firestore';
import { categoriesCollection, projectsCollection, Category, User, Project, Task, tasksCollection } from '../utils/firebase';

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
    console.log(`[Category save] Error occurred: ${err.message}`);
  }
};


export const saveProject = async (project: Project, owner: User) => {
  try {
    await projectsCollection.doc(project.id).set({
      id: project.id,
      name: project.name,
      note: project.note,
      users: project.users,
      by: {
        uid: owner.uid,
        email: owner.email,
      },
    });
  } catch (err) {
    console.log(`[Project save] Error occurred: ${err.message}`);
  }
};


export const saveTask = async (task: Task, owner: User) => {
  try {
    await tasksCollection.doc(task.id).set({
      id: task.id,
      name: task.name,
      note: task.note,
      phase: task.phase,
      category: task.category,
      project: task.project,
      order: task.order,
      by: {
        uid: owner.uid,
        email: owner.email,
      },
    });
  } catch (err) {
    console.log(`[Task save] Error occurred: ${err.message}`);
  }
};


export const deleteTask = async (taskId: string) => {
  try {
    await tasksCollection.doc(taskId).delete();
  } catch (err) {
    console.log(`[Task delete] Error occurred ${err.message}`);
  }
};