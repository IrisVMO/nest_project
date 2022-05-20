import { Test, TestingModule } from '@nestjs/testing';
import { forwardRef, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/apis/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Signupdto } from '../src/apis/users/users.dto';
import { AuthModule } from '../src/apis/auth/auth.module';
import { AlbumsModule } from '../src/apis/albums/albums.module';
import { CommentsModule } from '../src/apis/comments/comments.module';
import { FollowsModule } from '../src/apis/follows/follows.module';
import { LikesModule } from '../src/apis/likes/likes.module';
import { PhotosModule } from '../src/apis/photos/photos.module';

describe('Users - /users (e2e)', () => {
  const user = {
    username: 'nsa2me',
    email: 'naes2m@gmail.com',
    password: '123456',
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          synchronize: true,
          logging: false,
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'album_nest',
          autoLoadEntities: true,
        }),
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
      .send(user as Signupdto)
      .expect(201);
  });

  // it('Get all users [GET /users]', () => {
  //   return request(app.getHttpServer())
  //     .get('/users')
  //     .expect(200)
  //     .then(({ body }) => {
  //       expect(body).toBeDefined();
  //     });
  // });

  // it('Get one user [GET /users/:id]', () => {
  //   return request(app.getHttpServer())
  //     .get('/users/2')
  //     .expect(200)
  //     .then(({ body }) => {
  //       expect(body).toBeDefined();
  //     });
  // });

  // it('Delete one user [DELETE /users/:id]', () => {
  //   return request(app.getHttpServer()).delete('/users/1').expect(200);
  // });

  // afterAll(async () => {
  //   await app.close();
  // });
});
