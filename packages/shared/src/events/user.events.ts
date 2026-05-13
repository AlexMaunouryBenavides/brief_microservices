export const USER_EVENTS = {
  REGISTERED: 'user.registered',
} as const;

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  firstName: string;
}
