import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ChangePassworddto, UpdateInfordto } from '../src/apis/users/users.dto';
import { AppModule } from '../src/app.module';
import { CreateAlbumDto, UpdateAlbumdto } from '../src/apis/albums/albums.dto';
import { Logindto, Registerdto } from '../src/apis/auth/auth.dto';

const random = Math.floor(Math.random() * 100000000);
const data_test = {
  user1: {
    username: '233fc32',
    email: 'e322@gmail.com',
    password: '1232456',
  },

  userUpdate1: {
    username: 'na33333',
    email: 'na3223@gmail.com',
    status: 'Busy',
  },

  userChangePassword1: {
    currentPassword: '1232456',
    newPassword: 'nam1234256',
  },

  user2: {
    username: `32ded222ew3e232${random}`,
    email: `${random}2222@gmail.com`,
    password: '1232456',
  },

  album: {
    name: 'Ha Noi ve dem',
    description: 'Chuoi ngay di phuot dem ...',
  },

  albumUpdate: {
    name: 'Mot ngay dai',
    description: 'Mot hai ba bon',
    status: 'Private',
  },

  photo: {
    caption: 'Mua he chuyen lanh',
  },

  photoUpdate: {
    caption: 'Mot ngay hai ngay ba ngay',
    status: 'Private',
  },

  comments: {
    comment: 'Anh nay dep dep',
  },

  commentUpdates: {
    commentUpdate: 'Cute is not FoUND',
  },
};

let app: INestApplication;
let accessToken: string,
  photo: any,
  album: any,
  user1: any,
  user2: any,
  comment: any;

describe('E2e test feature Auth', () => {
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  // Signup
  it('Create [POST /api/auth/register]', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(data_test.user1 as Registerdto)
      .expect(201);

    user1 = response.body.data;
    console.log('user1:', user1);
  });

  it('Create [POST /api/auth/register] Conflic', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(data_test.user1 as Registerdto)
      .expect(409);
  });

  it('Create [POST /api/auth/register] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(null)
      .expect(400);
  });

  it('Create [POST /api/auth/register]', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(data_test.user2 as Registerdto)
      .expect(201);

    user2 = response.body.data;
  });

  // Login
  it('Create [POST /api/auth/login]', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(data_test.user1 as Logindto)
      .expect(201);

    accessToken = response.body.accessToken;
  });

  it('Create [POST /api/auth/login] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(null)
      .expect(400);
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

  it('Create [POST /api/albums] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .post('/api/albums')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [POST /api/albums] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .post('/api/albums')
      .set({ Authorization: 'Bearer' })
      .send(data_test.album as CreateAlbumDto)
      .expect(401);
  });

  // Get One Album
  it('Create [GET /api/albums/getOne/:id]', async () => {
    await request(app.getHttpServer())
      .get(`/api/albums/getOne/${album.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/albums/getOne/:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .get(`/api/albums/getOne/${null}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/albums/getOne/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .get(`/api/albums/getOne/${album.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  // Search, filter album by name
  it('Create [GET /api/albums/search]', async () => {
    await request(app.getHttpServer())
      .get(`/api/albums/search?filter=a&take=10&page=1`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/albums/search] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .get(`/api/albums/search?filter=a&take=10&page=1`)
      .set({ Authorization: `Bearer` })
      .expect(401);
  });

  // Update Albums
  it('Create [PATCH /api/albums/:id]', async () => {
    await request(app.getHttpServer())
      .patch(`/api/albums/${album.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.albumUpdate as UpdateAlbumdto)
      .expect(200);
  });

  it('Create [PATCH /api/albums/:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .patch(`/api/albums/${null}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.albumUpdate as UpdateAlbumdto)
      .expect(400);
  });

  it('Create [PATCH /api/albums/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .patch(`/api/albums/${album.id}`)
      .set({ Authorization: 'Bearer' })
      .send(data_test.albumUpdate as UpdateAlbumdto)
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
      .field('albumId', album.id)
      .field('caption', data_test.photo.caption)
      .expect(201);

    photo = response.body.data;
  });

  it('Create [POST /api/photos] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .post('/api/photos')
      .set({ Authorization: 'Bearer' })
      .attach('image', 'image_test/img2-f2ee.jpg')
      .field('caption', data_test.photo.caption)
      .expect(401);
  });

  // Search, filter photo by like caption
  it('Create [GET /api/photos/search]', async () => {
    await request(app.getHttpServer())
      .get(`/api/photos/search?filter=a&take=10&page=1`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/photos/search] 401 Unauthorization', async () => {
    request(app.getHttpServer())
      .get(`/api/photos/search?filter=a&take=10&page=1`)
      .set({ Authorization: `Bearer` })
      .expect(401);
  });

  // Get one photo by id
  it('Create [GET /api/photos/getOne/:id]', async () => {
    await request(app.getHttpServer())
      .get(`/api/photos/getOne/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/photos/getOne/:id] 401 Unauthorization', async () => {
    request(app.getHttpServer())
      .get(`/api/photos/getOne/${'photo.id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/photos/getOne/:id] 401 Unauthorization', async () => {
    request(app.getHttpServer())
      .get(`/api/photos/getOne/${photo.id}`)
      .set({ Authorization: `Bearer` })
      .expect(401);
  });

  // Get all photo in an album
  it('Create [GET /api/photos/allPhotoInAlbum/:albumId]', async () => {
    await request(app.getHttpServer())
      .get(`/api/photos/allPhotoInAlbum/${album.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/photos/allPhotoInAlbum/:albumId] 401 Unauthorization', async () => {
    request(app.getHttpServer())
      .get(`/api/photos/allPhotoInAlbum/${'album.id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/photos/allPhotoInAlbum/:albumId] 401 Unauthorization', async () => {
    request(app.getHttpServer())
      .get(`/api/photos/allPhotoInAlbum/${'album.id'}`)
      .set({ Authorization: `Bearer` })
      .expect(401);
  });

  // New Feed
  it('Create [GET /api/photos/newFeed]', async () => {
    await request(app.getHttpServer())
      .get(`/api/photos/newFeed`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/photos/newFeed] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .get(`/api/photos/newFeed`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  // Update Photo
  it('Create [PATCH /api/photos/:id]', async () => {
    request(app.getHttpServer())
      .patch(`/api/photos/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.photoUpdate)
      .expect(200);
  });

  it('Create [PATCH /api/photos/:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .patch(`/api/photos/${null}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [PATCH /api/photos/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .patch(`/api/photos/${photo.id}`)
      .set({ Authorization: 'Bearer' })
      .send(data_test.photoUpdate)
      .expect(401);
  });
});

//=======================================================================
// Feature Likes
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
describe('E2e test feature Likes', () => {
  // Create Like
  it('Create [POST /api/likes]', async () => {
    await request(app.getHttpServer())
      .post('/api/likes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ photoId: photo.id })
      .expect(201);
  });

  it('Create [POST /api/likes] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .post('/api/likes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({})
      .expect(400);
  });

  it('Create [POST /api/likes] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .post('/api/likes')
      .set({ Authorization: 'Bearer' })
      .send({ photoId: photo.id })
      .expect(401);
  });

  // Unlike
  it('Create [DELETE /api/likes]', async () => {
    await request(app.getHttpServer())
      .delete('/api/likes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ photoId: photo.id })
      .expect(200);
  });

  it('Create [DELETE /api/likes/:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .delete('/api/likes')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({})
      .expect(400);
  });

  it('Create [DELETE /api/likes/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .delete('/api/likes')
      .set({ Authorization: 'Bearer' })
      .send({ photoId: photo.id })
      .expect(401);
  });

  // Get All Like In A Photo
  it('Create [GET /api/likes/allLikeInPhoto/:photoId]', async () => {
    await request(app.getHttpServer())
      .get(`/api/likes/allLikeInPhoto/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/likes/allLikeInPhoto/:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .get(`/api/likes/allLikeInPhoto/${'album.id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/likes/allLikeInPhoto/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .get(`/api/likes/allLikeInPhoto/${photo.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });
});

//=====================================================================
// Feature Comments
describe('E2e test feature Comments', () => {
  // Create Comment
  it('Create [POST /api/comments]', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/comments')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ comment: data_test.comments.comment, photoId: photo.id })
      .expect(201);

    comment = response.body.data;
  });

  it('Create [POST /api/comments] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .post('/api/comments')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [POST /api/comments] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .post('/api/comments')
      .set({ Authorization: 'Bearer' })
      .send({ comment: data_test.comments.comment, photoId: photo.id })
      .expect(401);
  });

  // Update Comment
  it('Create [PATCH /api/comments]', async () => {
    await request(app.getHttpServer())
      .patch(`/api/comments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        updateComment: data_test.commentUpdates.commentUpdate,
        photoId: photo.id,
      })
      .expect(200);
  });

  it('Create [PATCH /api/comments] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .patch(`/api/comments`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [PATCH /api/comments] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .patch(`/api/comments`)
      .set({ Authorization: 'Bearer' })
      .send({
        updateComment: data_test.commentUpdates.commentUpdate,
        photoId: photo.id,
      })
      .expect(401);
  });

  // Get All Comment In A Photo
  it('Create [GET /api/comments/allCommentInPhoto/:photoId]', async () => {
    await request(app.getHttpServer())
      .get(`/api/comments/allCommentInPhoto/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/comments/allCommentInPhoto/:photoId] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .get(`/api/comments/allCommentInPhoto/${'photo.id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/comments/allCommentInPhoto/:photoId] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .get(`/api/comments/allCommentInPhoto/${photo.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  // Delete Comment
  it('Create [DELETE /api/comments/:id]', async () => {
    await request(app.getHttpServer())
      .delete(`/api/comments/${comment.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [DELETE /api/comments] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .delete(`/api/comments/${'absnse'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [DELETE /api/comments] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .delete(`/api/comments/${'dd'}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });
});

//===========================================================================
// Feature Follows
describe('E2e test feature Follows', () => {
  // Create Follow
  it('Create [POST /api/follows]', async () => {
    await request(app.getHttpServer())
      .post('/api/follows')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ userIdFollowing: user2.id })
      .expect(201);
  });

  it('Create [POST /api/follows] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .post('/api/follows')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(null)
      .expect(400);
  });

  it('Create [POST /api/follows] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .post('/api/follows')
      .set({ Authorization: 'Bearer' })
      .send({ userIdFollowing: user2.id })
      .expect(401);
  });

  // Unfollow
  it('Create [DELETE /api/follows/:id]', async () => {
    console.log('user2.id:', user2.id);

    await request(app.getHttpServer())
      .delete(`/api/follows/${user2.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [DELETE /api/follows/:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .delete(`/api/follows/${'id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [DELETE /api/follows/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .delete(`/api/follows/${user2.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });
});

describe('E2e test feature Photos', () => {
  // Delete Photo
  it('Create [DELETE /api/photos/:id]', async () => {
    await request(app.getHttpServer())
      .delete(`/api/photos/${photo.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [DELETE /api/photos/:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .delete(`/api/photos/${'id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [DELETE /api/photos/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .delete(`/api/photos/${photo.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });
});

describe('E2e test feature Albums', () => {
  // Delete Albums
  it('Create [DELETE /api/albums/:id]', async () => {
    await request(app.getHttpServer())
      .delete(`/api/albums/${album.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [DELETE /api/albums/:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .delete(`/api/albums/${'id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [DELETE /api/albums/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .delete(`/api/albums/${album.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });
});

// ============================================================
// Feature Users
describe('E2e test feature Users', () => {
  // Update Infor
  it('Create [PATCH /api/users]', async () => {
    await request(app.getHttpServer())
      .patch(`/api/users`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.userUpdate1 as UpdateInfordto)
      .expect(200);
  });

  // it('Create [PATCH /api/users] 400 Bad Request', async () => {
  //   await request(app.getHttpServer())
  //     .patch(`/api/users`)
  //     .set({ Authorization: `Bearer ${accessToken}` })
  //     .send({})
  //     .expect(400);
  // });

  it('Create [PATCH /api/users]', async () => {
    await request(app.getHttpServer())
      .patch(`/api/users`)
      .set({ Authorization: 'Bearer' })
      .send(data_test.userUpdate1 as UpdateInfordto)
      .expect(401);
  });

  // Get One User
  it('Create [GET /api/users/one/:id]', async () => {
    await request(app.getHttpServer())
      .get(`/api/users/one/${user1.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/users/one  /:id] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .get(`/api/users/one/${'id'}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [GET /api/users/one/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .get(`/api/users/one/${user1.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  it('Create [GET /api/users/one/:id] Not Found', async () => {
    await request(app.getHttpServer())
      .get('/api/users/one/9e08af9d-ffa6-5000-a2a7-9a29066793e9')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(404);
  });

  // Search, filter user by username
  it('Create [GET /api/users]', async () => {
    await request(app.getHttpServer())
      .get(`/api/users?filter=a&take=10&page=1`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  it('Create [GET /api/users/search/:username] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .get(`/api/users?filter=a&take=10&page=1`)
      .set({ Authorization: `Bearer` })
      .expect(401);
  });

  // Change Password
  it('Create [PATCH /api/users/changePassword] 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .patch('/api/users/changePassword')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({})
      .expect(400);
  });

  it('Create [PATCH /api/users/changePassword] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .patch('/api/users/changePassword')
      .set({ Authorization: 'Bearer' })
      .send(data_test.userChangePassword1 as ChangePassworddto)
      .expect(401);
  });

  it('Create [PATCH /api/users/changePassword]', async () => {
    await request(app.getHttpServer())
      .patch('/api/users/changePassword')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(data_test.userChangePassword1 as ChangePassworddto)
      .expect(200);
  });

  // Delete User
  it('Create [Delete /api/users/:id] 400 Bad request', async () => {
    await request(app.getHttpServer())
      .delete(`/api/users/random`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(400);
  });

  it('Create [Delete /api/users/:id] 401 Unauthorization', async () => {
    await request(app.getHttpServer())
      .delete(`/api/users/${user1.id}`)
      .set({ Authorization: 'Bearer' })
      .expect(401);
  });

  it('Create [Delete /api/users/:id]', async () => {
    await request(app.getHttpServer())
      .delete(`/api/users/${user1.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200);
  });

  afterAll(() => app.close());
});
