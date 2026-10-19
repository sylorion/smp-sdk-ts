import { profileQueries } from '../../src/api/graphql/user/queries';

describe('profileQueries', () => {
  // La webapp vérifie le titulaire d'un profil (C28) en comparant `profile.userID` à la session :
  // sans ce champ, chaque titulaire recevait « Ce profil ne vous appartient pas ».
  it('GET_PROFILE lit le titulaire du profil (userID)', () => {
    expect(profileQueries.GET_PROFILE).toMatch(/profile\(profileID: \$profileId\) \{\s+profileID\s+userID\b/);
  });
});
