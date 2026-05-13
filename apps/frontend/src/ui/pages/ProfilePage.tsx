import { ProfileForm } from '../features/Profile/ProfileForm';

export default function ProfilePage(): JSX.Element {
  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon profil</h1>
      <ProfileForm />
    </main>
  );
}
