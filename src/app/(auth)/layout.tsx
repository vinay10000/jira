"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
interface AuthLaayoutProps {
  children: React.ReactNode;
}
function AuthLaayout({ children }: AuthLaayoutProps) {
  const pathname = usePathname();
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto p-4 max-w-screen-2xl">
        <nav className="flex items-center justify-between">
          <Image src={"/logo.svg"} alt="logo" width={140} height={50} />
          <Button asChild variant={"secondary"}>
            <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
              {pathname === "/sign-in" ? "Sign Up" : "Login"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-1">
          {children}
        </div>
      </div>
    </main>
  );
}

export default AuthLaayout;
