import { auth } from "@/auth";
import Header from "@/components/header";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="p-4">
      <Header session={session} />
      {children}
    </div>
  );
}
