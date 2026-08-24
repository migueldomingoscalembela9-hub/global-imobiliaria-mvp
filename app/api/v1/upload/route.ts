import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuth } from '@/lib/auth/session';
import { isOwnerOrAgent } from '@/lib/permissions';
import { success, error, handleError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!isOwnerOrAgent(user.role)) {
      return error('Sem permissão para enviar imagens.', 403, 'FORBIDDEN');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return error('Nenhum ficheiro enviado.', 400, 'VALIDATION_ERROR');
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return error('Este formato de imagem não é suportado. Utilize JPG, JPEG, PNG ou WEBP.', 400, 'INVALID_FORMAT');
    }

    if (file.size > MAX_SIZE) {
      return error('A imagem é demasiado grande. Escolha uma imagem de menor tamanho.', 400, 'FILE_TOO_LARGE');
    }

    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = 'properties/' + user.id + '/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + extension;

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type
    });

    return success({ url: blob.url, pathname: blob.pathname }, 201);
  } catch (err) {
    return handleError(err);
  }
}
