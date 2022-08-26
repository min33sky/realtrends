import { Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
});

UserSchema.example = {
  id: 1,
  username: 'typemean',
};

export type UserSchemaType = Static<typeof UserSchema>;
