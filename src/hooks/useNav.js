"use client"; 

import { useRouter } from "next/navigation";

export function useNavigateToContact() {
  const router = useRouter();

  const goToContact = () => {
    router.push("/admin/contact");
  };

  return { goToContact };
}
