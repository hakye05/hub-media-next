type Props = { title: string; message: string };

export default function ProfileError({ title, message }: Props) {
  return (
    <main className="flex min-h-[calc(100vh-90px)] flex-col items-center justify-center gap-2 px-6 pb-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-neutral-500">{message}</p>
    </main>
  );
}