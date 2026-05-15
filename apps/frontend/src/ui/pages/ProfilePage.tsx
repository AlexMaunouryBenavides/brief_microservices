import { ProfileForm } from '../features/Profile/ProfileForm';

export default function ProfilePage(): JSX.Element {
  return (
    <main className="pt-14">
      <div className="border-b border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-3">Mon espace</p>
          <h1 className="font-body text-4xl font-light text-zinc-900 tracking-tight">Profil</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <ProfileForm />
      </div>
    </main>
  );
}
