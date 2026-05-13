import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../application/use-cases/auth/loginUser.usecase';
import { loginSuccess } from '../../../application/store/auth.slice';
import { useAppDispatch } from '../../../application/store/store';

export function useLoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (data: { email: string; password: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await loginUser(data);
        dispatch(loginSuccess(result));
        navigate('/');
      } catch {
        setError('Email ou mot de passe incorrect.');
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, navigate],
  );

  return { submit, isLoading, error };
}
