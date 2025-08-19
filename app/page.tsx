// app/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { LogoutButton } from "@/app/components/custom/logout-button";
import Tabs from "@/app/components/Tabs";
import Header from "@/app/components/header/header";
import CartDrawer from "@/app/components/cart/cart-drawer";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get("jwt");

  return (
    <div>
      <main className="container mx-auto p-4">
        <Header />
        <ul className="flex items-center gap-4 py-8">
          <li>
          {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <Link href="/signin" className="text-blue-600 underline">Login</Link>
        )}
          </li>
          <li>
            <CartDrawer />
          </li>
        </ul>

        <h1 className="text-3xl font-bold mb-6">School Management System</h1>
        <Tabs />
      </main>
    </div>
  );
}