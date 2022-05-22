import { Test, TestingModule } from '@nestjs/testing';
import { forwardRef, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/apis/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserdto } from '../src/apis/users/users.dto';
import { AuthModule } from '../src/apis/auth/auth.module';
import { AlbumsModule } from '../src/apis/albums/albums.module';
import { CommentsModule } from '../src/apis/comments/comments.module';
import { FollowsModule } from '../src/apis/follows/follows.module';
import { LikesModule } from '../src/apis/likes/likes.module';
import { PhotosModule } from '../src/apis/photos/photos.module';
import { configs } from '../src/configs/config';

describe('Users - /users (e2e)', () => {
  const user = {
    username: 'nsa2me',
    email: 'naes2m@gmail.com',
    env: 'test',
    password: '123456',
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configs.dbtest),
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
        UsersModule,
        AlbumsModule,
        PhotosModule,
        LikesModule,
        CommentsModule,
        FollowsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create [POST /api/users/signup]', () => {
    return request(app.getHttpServer())
      .post('/api/users/signup')
      .send(user as CreateUserdto)
      .expect(201);
  });
});
