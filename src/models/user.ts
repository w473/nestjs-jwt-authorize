import { KeycloakJwtToken } from './keycloak.jwt.token';

export class User {
  id: string;
  roles: string[];
  sid: string;
  emailVerified: boolean;
  name: string;
  preferredUsername: string;
  givenName: string;
  familyName: string;
  email: string;
  token: KeycloakJwtToken;
}

export const getUserFromKeycloakJwtToken = (token: KeycloakJwtToken): User => {
  return {
    id: token.sub,
    email: token.email,
    roles: token?.realm_access?.roles ?? [],
    name: token.name,
    givenName: token.given_name,
    familyName: token.family_name,
    preferredUsername: token.preferred_username,
    emailVerified: token.email_verified,
    sid: token.sid,
    token: token,
  };
};
