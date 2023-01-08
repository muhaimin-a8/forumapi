const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const requestAddReplyPayload = {
        content: 'new reply',
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
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      const threadId = responseAddThreadJson.data.addedThread.id;
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'new comment',
        },
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      /* adding reply */
      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${responseAddCommentJson.data.addedComment.id}/replies`,
        payload: requestAddReplyPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddReplyJson = JSON.parse(responseAddReply.payload);
      expect(responseAddReply.statusCode).toEqual(201);
      expect(responseAddReplyJson.status).toEqual('success');
      expect(responseAddReplyJson.data.addedReply).toBeDefined();
      expect(responseAddReplyJson.data.addedReply.id).toBeDefined();
      expect(responseAddReplyJson.data.addedReply.content).toEqual(requestAddReplyPayload.content);
      expect(responseAddReplyJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 404 when thread or comment not found', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddReplyPayload = {
        content: 'new reply',
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
      /* adding reply */
      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/notfoundthreadid/comments/notfoundcommentid/replies`,
        payload: requestAddReplyPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddReplyJson = JSON.parse(responseAddReply.payload);
      expect(responseAddReply.statusCode).toEqual(404);
      expect(responseAddReplyJson.status).toEqual('fail');
      expect(responseAddReplyJson.message).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
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
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      const threadId = responseAddThreadJson.data.addedThread.id;
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'new comment',
        },
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      /* adding reply */
      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${responseAddCommentJson.data.addedComment.id}/replies`,
        payload: {},
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddReplyJson = JSON.parse(responseAddReply.payload);
      expect(responseAddReply.statusCode).toEqual(400);
      expect(responseAddReplyJson.status).toEqual('fail');
      expect(responseAddReplyJson.message).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const requestAddReplyPayload = {
        content: 'new reply',
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
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      const threadId = responseAddThreadJson.data.addedThread.id;
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'new comment',
        },
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      /* adding reply */
      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${responseAddCommentJson.data.addedComment.id}/replies`,
        payload: requestAddReplyPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddReplyJson = JSON.parse(responseAddReply.payload);
      const replyId = responseAddReplyJson.data.addedReply.id;
      /* deleting reply */
      const responseDeleteReply = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${responseAddCommentJson.data.addedComment.id}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseDeleteReplyJson = JSON.parse(responseDeleteReply.payload);
      expect(responseDeleteReply.statusCode).toEqual(200);
      expect(responseDeleteReplyJson.status).toEqual('success');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
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

      /* deleting reply */
      const responseDeleteReply = await server.inject({
        method: 'DELETE',
        url: `/threads/123/comments/123/replies/123`,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseDeleteReplyJson = JSON.parse(responseDeleteReply.payload);
      expect(responseDeleteReply.statusCode).toEqual(404);
      expect(responseDeleteReplyJson.status).toEqual('fail');
      expect(responseDeleteReplyJson.message).toBeDefined();
    });

    it('should response 403 when user not authorized', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAuthPayload2 = {
        username: 'dicoding2',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const requestAddReplyPayload = {
        content: 'new reply',
      };
      const server = await createServer(container);

      /* adding user */
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestAuthPayload2.username,
          password: requestAuthPayload2.password,
          fullname: 'Dicoding Indonesia',
        },
      });
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
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      const threadId = responseAddThreadJson.data.addedThread.id;
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'new comment',
        },
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      /* adding reply */
      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${responseAddCommentJson.data.addedComment.id}/replies`,
        payload: requestAddReplyPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseAddReplyJson = JSON.parse(responseAddReply.payload);
      const replyId = responseAddReplyJson.data.addedReply.id;
      /* deleting reply */
      const responseDeleteReply = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${responseAddCommentJson.data.addedComment.id}/replies/${replyId}`,
        headers: {
          // using another user
          Authorization: `Bearer ${responseAuthJson2.data.accessToken}`,
        },
      });

      // Assert
      const responseDeleteReplyJson = JSON.parse(responseDeleteReply.payload);
      expect(responseDeleteReply.statusCode).toEqual(403);
      expect(responseDeleteReplyJson.status).toEqual('fail');
      expect(responseDeleteReplyJson.message).toBeDefined();
    });
  });
});
