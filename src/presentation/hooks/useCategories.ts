import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryType } from '../../domain/entities';
import { categoryRepository } from '../../data/repositories';
import { autoCategorizeInterests, autoCategorizeOccupations } from '../../domain/usecases';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryRepository.getAll();
      setCategories(data);
    } catch {
      // categories may not exist yet
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = useCallback(async (name: string, type: CategoryType, values: string[] = []) => {
    const added = await categoryRepository.add({ name, type, values });
    setCategories(prev => [...prev, added]);
    return added;
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    await categoryRepository.remove(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const syncCategories = useCallback(async (cats: Category[]) => {
    await categoryRepository.bulkSet(cats);
    setCategories(cats);
  }, []);

  /**
   * Run auto-categorization for a set of interests/occupations
   * and sync results to Firestore
   */
  const autoCategorize = useCallback(async (interests: string[], occupations: string[]) => {
    let updated = autoCategorizeInterests(interests, categories);
    updated = autoCategorizeOccupations(occupations, updated);
    await categoryRepository.bulkSet(updated);
    setCategories(updated);
  }, [categories]);

  return {
    categories,
    loading,
    addCategory,
    removeCategory,
    syncCategories,
    autoCategorize,
    refresh: fetchCategories,
  };
}
