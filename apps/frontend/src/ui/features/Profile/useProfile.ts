import { useCallback, useEffect, useState } from 'react';
import { getProfile } from '../../../application/use-cases/profile/getProfile.usecase';
import { updateProfile } from '../../../application/use-cases/profile/updateProfile.usecase';
import { setUser } from '../../../application/store/auth.slice';
import { selectUser } from '../../../application/store/auth.selectors';
import { useAppDispatch, useAppSelector } from '../../../application/store/store';
import type { UpdateProfileDto } from '../../../infrastructure/api/user.api';
import type { User } from '../../../domain/models/User.model';

export function useProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [isLoading, setIsLoading] = useState(!user);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) return;
    setIsLoading(true);
    getProfile()
      .then((profile) => dispatch(setUser(profile)))
      .finally(() => setIsLoading(false));
  }, [dispatch, user]);

  const update = useCallback(
    async (dto: UpdateProfileDto): Promise<User> => {
      setIsSaving(true);
      try {
        const updated = await updateProfile(dto);
        dispatch(setUser(updated));
        return updated;
      } finally {
        setIsSaving(false);
      }
    },
    [dispatch],
  );

  return { user, isLoading, isSaving, update };
}
