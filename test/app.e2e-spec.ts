import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  ChangePassworddto,
  CreateUserdto,
  Logindto,
  UpdateInfordto,
} from '../src/apis/users/users.dto';
import { AppModule } from '../src/app.module';
import { data_test } from './test.data';
import { CreateAlbumDto, UpdateAlbumdto } from '../src/apis/albums/albums.dto';
// import { UpdatePhotodto } from '../src/apis/photos/photos.dto';

let app: INestApplication;
let accessToken: string, photo: any, album: any, user: any;

// Feature Users
describe('E2e test feature Users', () => {
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Signup
  it('Create [POST /api/users/signup]', () => {
    request(app.getHttpServer())
      .post('/api/users/signup')
      .send(data_test.user as CreateUserdto)
      .expect(201);
  });

  it('Create [POST /api/users/signup] Conflic', () => {
    return request(app.getHttpServer())
      .post('/api/users/signup')
      .send(data_test.user as CreateUserdto)
      .expect(409);
  });

  it('Create [POST /api/users/signup] Bad Request', () => {
    request(app.getHttpServer())
      .post('/api/users/signup')
      .send(data_test.user as CreateUserdto)
      .expect(400);
  });

  // Login
  it('Create [POST /api/users/login]', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users/login')
      .send(data_test.userLogin as Logindto)
      .expect(201);

    user = response.body.data;
    accessToken = response.body.accessToken;
  });

  it('Create [POST /api/users/login] Bad Request', () => {
    request(app.getHttpServer())
      .post('/api/users/login')
      .send(null)
      .expect(400);
  });

  // Get All User
  it('Create [GET /api/users/all]', () => {
    request(app.getHttpServer())
      .get('/api/users/all')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
  });
  it('Create [GET /api/users/all] Unauthorization', () => {
    request(app.getHttpServer())
      .get('/api/users/all')
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  // Update Infor
  it('Create [PATCH /api/users/:id]', () => {
    request(app.getHttpServer())
      .patch(`/api/users/${user.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.userUpdate as UpdateInfordto)
      .expect(200);
  });

  it('Create [PATCH /api/users/:id] Bad Request', () => {
    request(app.getHttpServer())
      .patch(`/api/users/${user.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.userUpdate as UpdateInfordto)
      .expect(400);
  });

  it('Create [PATCH /api/users/:id]', () => {
    request(app.getHttpServer())
      .patch(`/api/users/${user.id}`)
      .set({ Authorization: 'Bearer' })
      .send(data_test.userUpdate as UpdateInfordto)
      .expect(401);
  });

  // Get One User
  it('Create [GET /api/users/one/:id]', () => {
    request(app.getHttpServer())
      .get(`/api/users/one/${user.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/users/one/:id] Bad Request', () => {
    request(app.getHttpServer())
      .get(`/api/users/one/${'id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/users/one/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .get(`/api/users/one/${user.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  it('Create [GET /api/users/one/:id] Not Found', () => {
    request(app.getHttpServer())
      .get('/api/users/one/9e08af9d-ffa6-5000-a2a7-9a29066793e9')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(404);
  });

  // Change Password
  it('Create [PATCH /api/users/changePassword]', () => {
    request(app.getHttpServer())
      .patch('/api/users/changePassword')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.userChangePassword as ChangePassworddto)
      .expect(200);
  });

  it('Create [PATCH /api/users/changePassword] Bad Request', () => {
    request(app.getHttpServer())
      .patch('/api/users/changePassword')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [PATCH /api/users/changePassword] Unauthorization', () => {
    request(app.getHttpServer())
      .patch('/api/users/changePassword')
      .set({ Authorization: 'Bearer' })
      .send(data_test.userChangePassword as ChangePassworddto)
      .expect(401);
  });
});

//===================================================================
// Feature Albums
describe('E2e test feature Albums', () => {
  // Create Album
  it('Create [POST /api/albums]', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/albums')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.album as CreateAlbumDto)
      .expect(201);

    album = response.body.data;
  });

  it('Create [POST /api/albums] Bad Request', () => {
    request(app.getHttpServer())
      .post('/api/albums')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [POST /api/albums] Unauthorization', () => {
    request(app.getHttpServer())
      .post('/api/albums')
      .set({ Authorization: 'Bearer' })
      .send(data_test.album as CreateAlbumDto)
      .expect(401);
  });

  // Get One Album
  it('Create [GET /api/albums/:id]', () => {
    request(app.getHttpServer())
      .get(`/api/albums/${album.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/albums/:id] Bad Request', () => {
    request(app.getHttpServer())
      .get(`/api/albums/${null}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/albums/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .get(`/api/albums/${album.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  // Update Albums
  it('Create [PATCH /api/albums/:id]', () => {
    request(app.getHttpServer())
      .patch(`/api/albums/${album.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.albumUpdate as UpdateAlbumdto)
      .expect(200);
  });

  it('Create [PATCH /api/albums/:id] Bad Request', () => {
    request(app.getHttpServer())
      .patch(`/api/albums/${null}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.albumUpdate as UpdateAlbumdto)
      .expect(400);
  });

  it('Create [PATCH /api/albums/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .patch(`/api/albums/${album.id}`)
      .set({ Authorization: 'Bearer' })
      .send(data_test.albumUpdate as UpdateAlbumdto)
      .expect(401);
  });

  // Delete Albums
  it('Create [DELETE /api/albums/:id]', () => {
    request(app.getHttpServer())
      .delete(`/api/albums/${album.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
  });

  it('Create [DELETE /api/albums/:id] Bad Request', () => {
    request(app.getHttpServer())
      .delete(`/api/albums/${'id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [DELETE /api/albums/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .delete(`/api/albums/${album.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  // Get All Photo In A Album
  it('Create [GET /api/albums/allPhotoInAlbum/:id]', () => {
    request(app.getHttpServer())
      .get(`/api/albums/allPhotoInAlbum/${album.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
  });

  it('Create [GET /api/albums/allPhotoInAlbum/:id] Bad Request', () => {
    request(app.getHttpServer())
      .get(`/api/albums/allPhotoInAlbum/${'album.id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/albums/allPhotoInAlbum/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .get(`/api/albums/allPhotoInAlbum/${album.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });
});

//=====================================================================
// Feature Photos
describe('E2e test feature Photos', () => {
  // Create A Photo
  it('Create [POST /api/photos]', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/photos')
      .set({ Authorization: `Bearer ${accessToken}` })
      .attach('image', 'image_test/img2-f2ee.jpg')
      .field('caption', data_test.photo.caption)
      .expect(201);

    photo = response.body.data;
    console.log('photo:', photo);
  });

  it('Create [POST /api/photos] Unauthorization', () => {
    request(app.getHttpServer())
      .post('/api/photos')
      .set({ Authorization: 'Bearer' })
      .attach('image', 'image_test/img2-f2ee.jpg')
      .field('caption', data_test.photo.caption)
      .expect(401);
  });

  // Update Photo
  it('Create [PATCH /api/photos/:id]', () => {
    request(app.getHttpServer())
      .patch(`/api/photos/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.photoUpdate)
      .expect(200);
  });

  it('Create [PATCH /api/photos/:id] Bad Request', () => {
    request(app.getHttpServer())
      .patch(`/api/photos/${null}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [PATCH /api/photos/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .patch(`/api/photos/${photo.id}`)
      .set({ Authorization: 'Bearer' })
      .send(data_test.photoUpdate)
      .expect(401);
  });

  // Delete Photo
  it('Create [DELETE /api/photos/:id]', () => {
    request(app.getHttpServer())
      .delete(`/api/photos/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
  });

  it('Create [DELETE /api/photos/:id] Bad Request', () => {
    request(app.getHttpServer())
      .delete(`/api/photos/${'id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [DELETE /api/photos/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .delete(`/api/photos/${photo.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });
});

//=======================================================================
// Feature Likes
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
describe('E2e test feature Likes', () => {
  // Create Like
  it('Create [POST /api/likes]', () => {
    request(app.getHttpServer())
      .post('/api/likes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.album as CreateAlbumDto)
      .expect(201);
  });

  it('Create [POST /api/likes] Bad Request', () => {
    request(app.getHttpServer())
      .post('/api/likes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [POST /api/likes] Unauthorization', () => {
    request(app.getHttpServer())
      .post('/api/likes')
      .set({ Authorization: 'Bearer' })
      .send(data_test.album as CreateAlbumDto)
      .expect(401);
  });

  // Unlike
  it('Create [DELETE /api/likes]', () => {
    request(app.getHttpServer())
      .delete('/api/likes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ photoId: photo.id })
      .expect(201);
  });

  it('Create [DELETE /api/likes/:id] Bad Request', () => {
    request(app.getHttpServer())
      .delete('/api/likes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ photoId: photo.id })
      .expect(400);
  });

  it('Create [DELETE /api/likes/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .delete('/api/likes')
      .set({ Authorization: 'Bearer' })
      .send({ photoId: photo.id })
      .expect(401);
  });

  // Get All Like In A Photo
  it('Create [GET /api/likes/allLikeInPhoto/:photoId]', () => {
    request(app.getHttpServer())
      .get(`/api/likes/allLikeInPhoto/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
  });

  it('Create [GET /api/likes/allLikeInPhoto/:id] Bad Request', () => {
    request(app.getHttpServer())
      .get(`/api/likes/allLikeInPhoto/${'album.id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/likes/allLikeInPhoto/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .get(`/api/likes/allLikeInPhoto/${photo.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });
});

//=====================================================================
// Feature Comments
describe('E2e test feature Comments', () => {
  // Create Comment
  it('Create [POST /api/comments]', () => {
    request(app.getHttpServer())
      .post('/api/comments')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ comment: data_test.comments.comment, photoId: photo.id })
      .expect(201);
  });

  it('Create [POST /api/comments] Bad Request', () => {
    request(app.getHttpServer())
      .post('/api/comments')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [POST /api/comments] Unauthorization', () => {
    request(app.getHttpServer())
      .post('/api/comments')
      .set({ Authorization: 'Bearer' })
      .send({ comment: data_test.comments.comment, photoId: photo.id })
      .expect(401);
  });

  // Update Comment
  it('Create [PATCH /api/comments]', () => {
    request(app.getHttpServer())
      .patch(`/api/comments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        updateComment: data_test.commentUpdates.commentUpdate,
        photoId: photo.id,
      })
      .expect(200);
  });

  it('Create [PATCH /api/comments] Bad Request', () => {
    request(app.getHttpServer())
      .patch(`/api/comments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [PATCH /api/comments] Unauthorization', () => {
    request(app.getHttpServer())
      .patch(`/api/comments`)
      .set({ Authorization: 'Bearer' })
      .send({
        updateComment: data_test.commentUpdates.commentUpdate,
        photoId: photo.id,
      })
      .expect(401);
  });

  // Get All Comment In A Photo
  it('Create [GET /api/comments/allCommentInPhoto/:photoId]', () => {
    request(app.getHttpServer())
      .get(`/api/comments/allCommentInPhoto/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
  });

  it('Create [GET /api/comments/allCommentInPhoto/:photoId] Bad Request', () => {
    request(app.getHttpServer())
      .get(`/api/comments/allCommentInPhoto/${'photo.id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/comments/allCommentInPhoto/:photoId] Unauthorization', () => {
    request(app.getHttpServer())
      .get(`/api/comments/allCommentInPhoto/${photo.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  // Delete Comment
  it('Create [DELETE /api/comments]', () => {
    request(app.getHttpServer())
      .delete(`/api/comments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ photoId: photo.id })
      .expect(201);
  });

  it('Create [DELETE /api/comments] Bad Request', () => {
    request(app.getHttpServer())
      .delete(`/api/comments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [DELETE /api/comments] Unauthorization', () => {
    request(app.getHttpServer())
      .delete(`/api/comments`)
      .set({ Authorization: 'Bearer' })
      .send({ photoId: photo.id })
      .expect(401);
  });
});

//===========================================================================
// Feature Follows
describe('E2e test feature Follows', () => {
  // Create Follow
  it('Create [POST /api/follows]', () => {
    request(app.getHttpServer())
      .post('/api/follows')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ userIdFollowing: data_test.follows.userIdFollowing })
      .expect(201);
  });

  it('Create [POST /api/follows] Bad Request', () => {
    request(app.getHttpServer())
      .post('/api/follows')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [POST /api/follows] Unauthorization', () => {
    request(app.getHttpServer())
      .post('/api/follows')
      .set({ Authorization: 'Bearer' })
      .send({ userIdFollowing: data_test.follows.userIdFollowing })
      .expect(401);
  });

  // New Feed
  it('Create [GET /api/follows/newFeed]', () => {
    request(app.getHttpServer())
      .get(`/api/follows/newFeed`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(201);
  });

  it('Create [GET /api/follows/newFeed] Unauthorization', () => {
    request(app.getHttpServer())
      .post(`/api/follows/newFeed`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  // Unfollow
  it('Create [DELETE /api/follows/:id]', () => {
    request(app.getHttpServer())
      .delete(`/api/follows/${album.id}`)
      .send({ userIdFollowing: data_test.follows.userIdFollowing })
      .expect(200);
  });

  it('Create [DELETE /api/follows/:id] Bad Request', () => {
    request(app.getHttpServer())
      .delete(`/api/follows/${'id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [DELETE /api/follows/:id] Unauthorization', () => {
    request(app.getHttpServer())
      .delete(`/api/follows/${album.id}`)
      .set({ Authorization: 'Bearer' })
      .send({ userIdFollowing: data_test.follows.userIdFollowing })
      .expect(401);
  });
});

//=========================================================================
// Feature Users
describe('E2e test feature Users', () => {
  // Delete User
  it('Create [Delete /api/users/:id]', () => {
    request(app.getHttpServer())
      .delete(`/api/users/${user.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [Delete /api/users/login] Bad request', () => {
    request(app.getHttpServer())
      .delete('/api/users')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [Delete /api/users/login] Unauthorization', () => {
    request(app.getHttpServer())
      .delete(`/api/users/${user.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  afterAll(() => app.close());
});
