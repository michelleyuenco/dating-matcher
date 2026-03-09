import { useState, useEffect, useCallback } from 'react';
import { Member } from '../../domain/entities';
import { memberRepository } from '../../data/repositories';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberRepository.getAll();
      setMembers(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = useCallback(async (member: Omit<Member, 'id'>) => {
    try {
      const added = await memberRepository.add(member);
      setMembers(prev => [added, ...prev]);
      return added;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add member');
      return null;
    }
  }, []);

  const removeMember = useCallback(async (id: string) => {
    try {
      await memberRepository.remove(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to remove member');
    }
  }, []);

  const bulkImport = useCallback(async (newMembers: Omit<Member, 'id'>[]) => {
    try {
      const added = await memberRepository.bulkAdd(newMembers);
      setMembers(prev => [...added, ...prev]);
      return added;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to import members');
      return [];
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await memberRepository.clearAll();
      setMembers([]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to clear members');
    }
  }, []);

  const stats = {
    total: members.length,
    males: members.filter(m => m.gender === 'male').length,
    females: members.filter(m => m.gender === 'female').length,
  };

  return { members, loading, error, stats, addMember, removeMember, bulkImport, clearAll, refresh: fetchMembers };
}
