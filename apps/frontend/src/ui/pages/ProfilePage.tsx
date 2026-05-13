import { ProfileForm } from '../features/Profile/ProfileForm';

export default function ProfilePage(): JSX.Element {
  return (
    <main className="pt-14">
      <div className="px-8 py-16 border-b border-zinc-100">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-3">Mon espace</p>
        <h1 className="text-4xl font-light text-zinc-900 tracking-tight">Profil</h1>
      </div>
      <div className="px-8 py-12">
        <ProfileForm />
      </div>
    </main>
  );
}
