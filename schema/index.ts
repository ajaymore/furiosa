import { nexusPrismaPlugin } from 'nexus-prisma';
import { idArg, makeSchema, objectType, arg } from 'nexus';
import path from 'path';
import { hash } from 'bcryptjs';

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.password();
    t.model.createdAt();
    t.model.updatedAt();
  }
});

const Group = objectType({
  name: 'Group',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.users();
    t.model.createdAt();
    t.model.updatedAt();
  }
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.users({ ordering: true, pagination: true, filtering: true });
    t.crud.user();
    t.field('me', {
      type: 'User',
      resolve(_, _args, ctx) {
        if (!ctx.user) {
          throw Error('User not logged in');
        }
        return ctx.user;
      }
    });
  }
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.crud.createOneUser();
    t.field('createOneUser', {
      type: 'User',
      args: {
        data: arg({ type: 'UserCreateInput', required: true })
      },
      async resolve(_, { data }, ctx) {
        const password = await hash(data.password, 10);
        return ctx.prisma.user.create({
          data: {
            ...data,
            password
          }
        });
      }
    });
    t.crud.updateOneUser();
    t.field('updateOneUser', {
      type: 'User',
      args: {
        data: arg({ type: 'UserUpdateInput', required: true }),
        where: arg({ type: 'UserWhereUniqueInput', required: true })
      },
      async resolve(_, { data, where }, ctx) {
        const password = await hash(data.password, 10);
        return ctx.prisma.user.update({
          data: {
            ...data,
            password
          },
          where
        });
      }
    });
    t.crud.deleteOneUser();
  }
});

const getPath = (fileName: string) =>
  path.join(process.cwd(), 'generated', fileName);

export const schema = makeSchema({
  types: [User, Group, Query, Mutation],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    schema: getPath('schema.graphql'),
    typegen: getPath('nexus.ts')
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma'
      },
      {
        source: path.join(process.cwd(), 'schema', 'context.ts'),
        alias: 'Context'
      }
    ]
  }
});
