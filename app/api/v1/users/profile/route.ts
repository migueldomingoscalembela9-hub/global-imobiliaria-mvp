import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { success, error, handleError } from '@/lib/api/response';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { updateProfileSchema, changePasswordSchema } from '@/lib/validation/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
    try {
        const user = await requireAuth();
        const body = await request.json();

        const { name, phone, avatarUrl, currentPassword, newPassword } = body;

        // Validar dados do perfil
        const profileData: Record<string, unknown> = {};
        if (name !== undefined) {
            const parsed = updateProfileSchema.pick({ name: true }).safeParse({ name });
            if (!parsed.success) {
                return error(parsed.error.issues[0]?.message ?? 'Nome inválido.', 400, 'VALIDATION_ERROR');
            }
            profileData.name = parsed.data.name;
        }

        if (phone !== undefined) {
            const parsed = updateProfileSchema.pick({ phone: true }).safeParse({ phone });
            if (!parsed.success) {
                return error(parsed.error.issues[0]?.message ?? 'Telefone inválido.', 400, 'VALIDATION_ERROR');
            }
            profileData.phone = parsed.data.phone;
        }

        if (avatarUrl !== undefined) {
            profileData.avatarUrl = avatarUrl ? String(avatarUrl) : null;
        }

        // Alterar palavra-passe se fornecida
        if (currentPassword || newPassword) {
            if (!currentPassword || !newPassword) {
                return error('Para alterar a palavra-passe, preencha ambos os campos.', 400, 'VALIDATION_ERROR');
            }

            const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
            if (!parsed.success) {
                return error(parsed.error.issues[0]?.message ?? 'Palavra-passe inválida.', 400, 'VALIDATION_ERROR');
            }

            const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
            if (!dbUser) {
                return error('Utilizador não encontrado.', 404, 'NOT_FOUND');
            }

            const valid = await verifyPassword(parsed.data.currentPassword, dbUser.passwordHash);
            if (!valid) {
                return error('A palavra-passe atual está incorreta.', 400, 'INVALID_PASSWORD');
            }

            profileData.passwordHash = await hashPassword(parsed.data.newPassword);
        }

        if (Object.keys(profileData).length === 0) {
            return error('Nenhum dado para atualizar.', 400, 'VALIDATION_ERROR');
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: profileData,
            include: { role: true }
        });

        return success({
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            avatarUrl: updated.avatarUrl,
            role: updated.role.code
        });
    } catch (err) {
        return handleError(err);
    }
}