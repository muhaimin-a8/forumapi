const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
      };
      const server = await createServer(container);
      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload.username,
          password: requestAuthPayload.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      expect(responseAddThread.statusCode).toEqual(400);
      expect(responseAddThreadJson.status).toEqual('fail');
      expect(responseAddThreadJson.message).toBeDefined();
      expect(responseAddThreadJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload title more than 200 character', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread'.repeat(200),
        body: 'new thread body',
      };
      const server = await createServer(container);
      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload.username,
          password: requestAuthPayload.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      expect(responseAddThread.statusCode).toEqual(400);
      expect(responseAddThreadJson.status).toEqual('fail');
      expect(responseAddThreadJson.message).toBeDefined();
      expect(responseAddThreadJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
    });

    it('should rresponse 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: [],
      };
      const server = await createServer(container);
      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload.username,
          password: requestAuthPayload.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);

      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      expect(responseAddThread.statusCode).toEqual(400);
      expect(responseAddThreadJson.status).toEqual('fail');
      expect(responseAddThreadJson.message).toBeDefined();
      expect(responseAddThreadJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const server = await createServer(container);

      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload.username,
          password: requestAuthPayload.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);
      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      expect(responseAddThread.statusCode).toEqual(201);
      expect(responseAddThreadJson.status).toEqual('success');
      expect(responseAddThreadJson.data.addedThread).toBeDefined();
      expect(responseAddThreadJson.data.addedThread.title).toEqual(requestAddThreadPayload.title);
    });
  });

  describe('GET /threads/{threadId}', () => {
    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 200 and thread detail', async () => {
      // Arrange
      const requestAuthPayload1 = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAuthPayload2 = {
        username: 'dicoding2',
        password: 'supersecret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const requestAddCommentPayload = {
        content: 'new comment',
      };
      const server = await createServer(container);

      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload1.username,
          password: requestAuthPayload1.password,
          fullname: 'Dicoding Indonesia',
        },
      });
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload2.username,
          password: requestAuthPayload2.password,
          fullname: 'Dicoding Indonesia',
        },
      });

      // Action
      /* login */
      const responseAuth1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload1,
      });
      const responseAuthJson1 = JSON.parse(responseAuth1.payload);
      const responseAuth2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload2,
      });
      const responseAuthJson2 = JSON.parse(responseAuth2.payload);
      /* adding thread */
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestAddThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson1.data.accessToken}`,
        },
      });
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      const threadId = responseAddThreadJson.data.addedThread.id;
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestAddCommentPayload,
        headers: {
          // use access token from user 1
          Authorization: `Bearer ${responseAuthJson1.data.accessToken}`,
        },
      });
      const responseAddComment2 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestAddCommentPayload,
        headers: {
          // use access token from user 2
          Authorization: `Bearer ${responseAuthJson2.data.accessToken}`,
        },
      });

      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      const responseAddCommentJson2 = JSON.parse(responseAddComment2.payload);

      /* adding reply */
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${responseAddCommentJson2.data.addedComment.id}/replies`,
        payload: {
          content: 'new reply',
        },
        headers: {
          // use access token from user 1
          Authorization: `Bearer ${responseAuthJson1.data.accessToken}`,
        },
      });

      /* deleting comment */
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${responseAddCommentJson.data.addedComment.id}`,
        headers: {
          // use access token from user 1
          Authorization: `Bearer ${responseAuthJson1.data.accessToken}`,
        },
      });
      /* getting thread detail */
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(responseAddThreadJson.data.addedThread.id);
      expect(responseJson.data.thread.title).toEqual(requestAddThreadPayload.title);
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments.length).toEqual(2);
      expect(responseJson.data.thread.comments[0].replies.length).toEqual(1);
      expect(responseJson.data.thread.comments[0].replies[0].id).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0].content).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0].username).toBeDefined();
    });
  });
});
