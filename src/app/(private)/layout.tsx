import { auth } from "@/auth";
import { CaslProvider } from "@/context/casl/casl-provider";
import Header from "@/components/header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SidebarProvider>
      <CaslProvider role={session?.user?.role}>
        <AppSidebar session={session} />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </CaslProvider>
    </SidebarProvider>
  );
}
