import { mock } from 'jest-mock-extended';
import { getUserFromKeycloakJwtToken } from 'src/models/user';
import { KeycloakJwtToken } from 'src/models/keycloak.jwt.token';

describe('User test', () => {
  it('will getUserFromKeycloakJwtToken', async () => {
    const token = mock<KeycloakJwtToken>();
    const roles = ['ADMIN'];
    token.realm_access.roles = roles;
    const user = getUserFromKeycloakJwtToken(token);
    expect(user.roles).toEqual(roles);
  });
  it('will getUserFromKeycloakJwtToken without roles', async () => {
    const token = mock<KeycloakJwtToken>();
    const user = getUserFromKeycloakJwtToken(token);
    expect(user.roles).toEqual([]);
  });
});
