import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../application/use-cases/auth/registerUser.usecase';
import type { RegisterDto } from '../../../infrastructure/api/auth.api';

export function useRegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (data: RegisterDto) => {
      setIsLoading(true);
      setError(null);
      try {
        await registerUser(data);
        navigate('/login');
      } catch {
        setError('Inscription échouée. Cet email est peut-être déjà utilisé.');
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  return { submit, isLoading, error };
}
