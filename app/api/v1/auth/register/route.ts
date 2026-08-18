import { NextRequest } from 'next/server';
import { registerUser } from '@/services/auth/auth.service';
import { success, handleError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await registerUser(body);
    return success(user, 201);
  } catch (err) {
    return handleError(err);
  }
}
