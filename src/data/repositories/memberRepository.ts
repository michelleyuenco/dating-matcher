import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, writeBatch
} from 'firebase/firestore';
import { db } from '../../infrastructure/firebase';
import { Member, Gender } from '../../domain/entities';

const COLLECTION = 'members';

function membersRef() {
  return collection(db, COLLECTION);
}

export const memberRepository = {
  async getAll(): Promise<Member[]> {
    const snap = await getDocs(query(membersRef(), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Member));
  },

  async getById(id: string): Promise<Member | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } as Member : null;
  },

  async getByGender(gender: Gender): Promise<Member[]> {
    const snap = await getDocs(query(membersRef(), where('gender', '==', gender)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Member));
  },

  async add(member: Omit<Member, 'id'>): Promise<Member> {
    const docRef = await addDoc(membersRef(), member);
    return { id: docRef.id, ...member };
  },

  async update(id: string, updates: Partial<Member>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), updates);
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async bulkAdd(members: Omit<Member, 'id'>[]): Promise<Member[]> {
    const results: Member[] = [];
    // Firestore batch limit is 500
    const batchSize = 450;
    for (let i = 0; i < members.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = members.slice(i, i + batchSize);
      for (const member of chunk) {
        const ref = doc(membersRef());
        batch.set(ref, member);
        results.push({ id: ref.id, ...member });
      }
      await batch.commit();
    }
    return results;
  },

  async clearAll(): Promise<void> {
    const snap = await getDocs(membersRef());
    const batchSize = 450;
    for (let i = 0; i < snap.docs.length; i += batchSize) {
      const batch = writeBatch(db);
      snap.docs.slice(i, i + batchSize).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
  },
};
