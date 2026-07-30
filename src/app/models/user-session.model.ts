export interface UserSession {
  id: string;
  email: string;
  role: string;
  jwtId: string;
  expiration: string;
}