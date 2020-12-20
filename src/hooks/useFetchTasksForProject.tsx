import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Task, tasksCollection } from '../utils/firebase';

export const useFetchTasksForProject = (taskId: string): Task[] => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = tasksCollection
      .where("project", "==", taskId ?? '')
      .onSnapshot(
        snapshot => setTasks(snapshot.docs
          .map(doc => doc.data())
          .sort((a: Task, b: Task) => a.order - b.order)),
        err => console.log(err.message),
      );

    return () => unsubscribe();
  }, [taskId]);

  return tasks;
}

export default useFetchTasksForProject;