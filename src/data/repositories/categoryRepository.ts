import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, setDoc
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase';
import { Category } from '../../domain/entities';

const COLLECTION = 'categories';

function categoriesRef() {
  return collection(db, COLLECTION);
}

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    const snap = await getDocs(categoriesRef());
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  },

  async add(category: Omit<Category, 'id'>): Promise<Category> {
    const docRef = await addDoc(categoriesRef(), category);
    return { id: docRef.id, ...category };
  },

  async update(id: string, updates: Partial<Category>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), updates);
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async setById(id: string, category: Omit<Category, 'id'>): Promise<void> {
    await setDoc(doc(db, COLLECTION, id), category);
  },

  async bulkSet(categories: Category[]): Promise<void> {
    const batchSize = 450;
    for (let i = 0; i < categories.length; i += batchSize) {
      const batch = writeBatch(db);
      categories.slice(i, i + batchSize).forEach(cat => {
        const { id, ...data } = cat;
        batch.set(doc(db, COLLECTION, id), data);
      });
      await batch.commit();
    }
  },

  async clearAll(): Promise<void> {
    const snap = await getDocs(categoriesRef());
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  },
};
