'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingRedirect({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const mustChange = session.user.mustChangePassword;
      
      // If user must change password and is NOT already on the change-password page
      if (mustChange && pathname !== '/change-password') {
        router.push('/change-password');
      }
    }
  }, [session, status, pathname, router]);

  return <>{children}</>;
}
