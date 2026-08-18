import { NextRequest } from 'next/server';
import { loginUser } from '@/services/auth/auth.service';
import { success, handleError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await loginUser(body);
    return success(user);
  } catch (err) {
    return handleError(err);
  }
}
