import { logoutUser } from '@/services/auth/auth.service';
import { success, handleError } from '@/lib/api/response';

export async function POST() {
  try {
    await logoutUser();
    return success({ message: 'Sessão terminada.' });
  } catch (err) {
    return handleError(err);
  }
}