import type { RoleCode } from '@prisma/client';

export type Permission =
  | 'property:create'
  | 'property:edit'
  | 'property:archive'
  | 'property:submit'
  | 'property:approve'
  | 'property:reject'
  | 'property:view_all'
  | 'user:manage'
  | 'user:block'
  | 'user:activate'
  | 'contact:create'
  | 'contact:view'
  | 'visit:create'
  | 'visit:view'
  | 'visit:manage'
  | 'favorite:manage'
  | 'dashboard:view'
  | 'admin:view'
  | 'stats:view';

const ROLE_PERMISSIONS: Record<RoleCode, Permission[]> = {
  BUYER: [
    'property:view_all',
    'contact:create',
    'contact:view',
    'visit:create',
    'visit:view',
    'favorite:manage',
    'dashboard:view'
  ],
  TENANT: [
    'property:view_all',
    'contact:create',
    'contact:view',
    'visit:create',
    'visit:view',
    'favorite:manage',
    'dashboard:view'
  ],
  OWNER: [
    'property:create',
    'property:edit',
    'property:archive',
    'property:submit',
    'contact:view',
    'visit:view',
    'visit:manage',
    'dashboard:view'
  ],
  AGENT: [
    'property:create',
    'property:edit',
    'property:archive',
    'property:submit',
    'contact:view',
    'visit:view',
    'visit:manage',
    'dashboard:view'
  ],
  ADMIN: [
    'property:create',
    'property:edit',
    'property:archive',
    'property:submit',
    'property:approve',
    'property:reject',
    'property:view_all',
    'user:manage',
    'user:block',
    'user:activate',
    'contact:view',
    'visit:view',
    'visit:manage',
    'dashboard:view',
    'admin:view',
    'stats:view'
  ]
};

export function hasPermission(role: RoleCode, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canManageProperty(role: RoleCode): boolean {
  return hasPermission(role, 'property:create') && hasPermission(role, 'property:edit');
}

export function canApproveProperties(role: RoleCode): boolean {
  return hasPermission(role, 'property:approve');
}

export function canManageUsers(role: RoleCode): boolean {
  return hasPermission(role, 'user:manage');
}

export function isAdmin(role: RoleCode): boolean {
  return role === 'ADMIN';
}

export function isOwnerOrAgent(role: RoleCode): boolean {
  return role === 'OWNER' || role === 'AGENT';
}

export function isBuyerOrTenant(role: RoleCode): boolean {
  return role === 'BUYER' || role === 'TENANT';
}