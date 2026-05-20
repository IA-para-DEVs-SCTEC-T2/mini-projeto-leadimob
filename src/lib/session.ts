import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function get_session() {
  const session = await auth()
  if (!session?.user?.corretor_id) redirect('/auth/login')
  return session
}