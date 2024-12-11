import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function RedirectPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user.role === 'admin') {
      router.push('/user');
    } else {
      router.push('/dashboard');
    }
  }, [session, router]);

  return <p>Redirecting...</p>;
}
