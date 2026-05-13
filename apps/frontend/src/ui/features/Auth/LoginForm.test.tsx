import { vi, it, expect, describe } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { renderWithProviders } from '../../../shared/test-utils';
import * as loginUseCase from '../../../application/use-cases/auth/loginUser.usecase';

vi.mock('../../../application/use-cases/auth/loginUser.usecase');

describe('LoginForm', () => {
  it('renders email, password fields and submit button', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
  });

  it('calls loginUser with form values on submit', async () => {
    vi.mocked(loginUseCase.loginUser).mockResolvedValue({
      accessToken: 'tok',
      user: { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', role: 'customer' },
    });
    renderWithProviders(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'pass123');
    await userEvent.click(screen.getByRole('button', { name: /connexion/i }));

    expect(loginUseCase.loginUser).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass123' });
  });

  it('shows error message on login failure', async () => {
    vi.mocked(loginUseCase.loginUser).mockRejectedValue(new Error('Unauthorized'));
    renderWithProviders(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'x@x.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /connexion/i }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
