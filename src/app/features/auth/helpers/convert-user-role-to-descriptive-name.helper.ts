export function convertUserRoleToDescriptiveName(role: string): string {
  const roleMap = {
    'admin': 'Administrator',
    'pm': 'Project Manager',
    'developer': 'Developer',
    'viewer': 'Viewer',
  }
  return roleMap[role as keyof typeof roleMap] || role;
}