import { useState, useEffect } from 'react';
import { getCurrentUserPerson, updateCurrentUserPerson, UpdatePersonPayload } from '@/services/profileService';
import { PersonResponse } from '@/services/personService';

export interface UseProfileReturn {
  profile: PersonResponse | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: UpdatePersonPayload) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updating: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<PersonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentUserPerson();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdatePersonPayload) => {
    try {
      setUpdating(true);
      setError(null);
      const updatedProfile = await updateCurrentUserPerson(data);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
    updating,
  };
};