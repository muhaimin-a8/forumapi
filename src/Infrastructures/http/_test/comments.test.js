const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
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
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
        payload: {},
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      expect(responseAddComment.statusCode).toEqual(400);
      expect(responseAddCommentJson.status).toEqual('fail');
      expect(responseAddCommentJson.message).toBeDefined();
      expect(responseAddCommentJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const requestAddThreadPayload = {
        title: 'new thread',
        body: 'new thread body',
      };
      const requestAddCommentPayload = {
        content: 123,
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
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
        payload: requestAddCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      expect(responseAddComment.statusCode).toEqual(400);
      expect(responseAddCommentJson.status).toEqual('fail');
      expect(responseAddCommentJson.message).toBeDefined();
      expect(responseAddCommentJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
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
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
        payload: requestAddCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      expect(responseAddComment.statusCode).toEqual(201);
      expect(responseAddCommentJson.status).toEqual('success');
      expect(responseAddCommentJson.data).toBeDefined();
      expect(responseAddCommentJson.data.addedComment).toBeDefined();
      expect(responseAddCommentJson.data.addedComment.id).toBeDefined();
      expect(responseAddCommentJson.data.addedComment.content).toEqual(requestAddCommentPayload.content);
      expect(responseAddCommentJson.data.addedComment.owner).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 403 when requestor not authorized', async () => {
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
      /* adding comment */
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
        payload: requestAddCommentPayload,
        headers: {
          // use access token from user 1
          Authorization: `Bearer ${responseAuthJson1.data.accessToken}`,
        },
      });

      const responseAddCommentJson = JSON.parse(responseAddComment.payload);

      /* deleting comment */
      const responseDeleteComment = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments/${responseAddCommentJson.data.addedComment.id}`,
        headers: {
          // use access token from user 2
          Authorization: `Bearer ${responseAuthJson2.data.accessToken}`,
        },
      });

      // Assert
      const responseDeleteCommentJson = JSON.parse(responseDeleteComment.payload);
      expect(responseDeleteComment.statusCode).toEqual(403);
      expect(responseDeleteCommentJson.status).toEqual('fail');
      expect(responseDeleteCommentJson.message).toBeDefined();
      expect(responseDeleteCommentJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });

    // it('should response 404 when thread not found', async () => {
    //   // Arrange
    //   const requestAuthPayload = {
    //     username: 'dicoding',
    //     password: 'secret',
    //   };
    //   const requestAddThreadPayload = {
    //     title: 'new thread',
    //     body: 'new thread body',
    //   };
    //   const requestAddCommentPayload = {
    //     content: 'new comment',
    //   };
    //   const server = await createServer(container);
    //
    //   /* adding user */
    //   await server.inject({
    //     method: 'POST',
    //     url: '/users',
    //     payload: {
    //       username: requestAuthPayload.username,
    //       password: requestAuthPayload.password,
    //       fullname: 'Dicoding Indonesia',
    //     },
    //   });
    //
    //   // Action
    //   /* login */
    //   const responseAuth = await server.inject({
    //     method: 'POST',
    //     url: '/authentications',
    //     payload: requestAuthPayload,
    //   });
    //   const responseAuthJson = JSON.parse(responseAuth.payload);
    //   /* adding thread */
    //   const responseAddThread = await server.inject({
    //     method: 'POST',
    //     url: '/threads',
    //     payload: requestAddThreadPayload,
    //     headers: {
    //       Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
    //     },
    //   });
    //   const responseAddThreadJson = JSON.parse(responseAddThread.payload);
    //   /* adding comment */
    //   const responseAddComment = await server.inject({
    //     method: 'POST',
    //     url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
    //     payload: requestAddCommentPayload,
    //     headers: {
    //       Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
    //     },
    //   });
    //
    //   const responseAddCommentJson = JSON.parse(responseAddComment.payload);
    //
    //   /* deleting comment */
    //   const responseDeleteComment = await server.inject({
    //     method: 'DELETE',
    //     url: `/threads/notfoundthreadid/comments/${responseAddCommentJson.data.addedComment.id}`,
    //     headers: {
    //       Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
    //     },
    //   });
    //
    //   // Assert
    //   const responseDeleteCommentJson = JSON.parse(responseDeleteComment.payload);
    //   expect(responseDeleteComment.statusCode).toEqual(404);
    //   expect(responseDeleteCommentJson.status).toEqual('fail');
    //   expect(responseDeleteCommentJson.message).toBeDefined();
    //   expect(responseDeleteCommentJson.message).toEqual('Thread tidak ditemukan');
    // });
    //
    // it('should response 404 when comment not found', async () => {
    //   // Arrange
    //   const requestAuthPayload = {
    //     username: 'dicoding',
    //     password: 'secret',
    //   };
    //   const requestAddThreadPayload = {
    //     title: 'new thread',
    //     body: 'new thread body',
    //   };
    //   const server = await createServer(container);
    //
    //   /* adding user */
    //   await server.inject({
    //     method: 'POST',
    //     url: '/users',
    //     payload: {
    //       username: requestAuthPayload.username,
    //       password: requestAuthPayload.password,
    //       fullname: 'Dicoding Indonesia',
    //     },
    //   });
    //
    //   // Action
    //   /* login */
    //   const responseAuth = await server.inject({
    //     method: 'POST',
    //     url: '/authentications',
    //     payload: requestAuthPayload,
    //   });
    //   const responseAuthJson = JSON.parse(responseAuth.payload);
    //   /* adding thread */
    //   const responseAddThread = await server.inject({
    //     method: 'POST',
    //     url: '/threads',
    //     payload: requestAddThreadPayload,
    //     headers: {
    //       Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
    //     },
    //   });
    //
    //   const responseAddThreadJson = JSON.parse(responseAddThread.payload);
    //
    //   /* deleting comment */
    //   const responseDeleteComment = await server.inject({
    //     method: 'DELETE',
    //     url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments/notfoundcommentid`,
    //     headers: {
    //       Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
    //     },
    //   });
    //
    //   // Assert
    //   const responseDeleteCommentJson = JSON.parse(responseDeleteComment.payload);
    //   expect(responseDeleteComment.statusCode).toEqual(404);
    //   expect(responseDeleteCommentJson.status).toEqual('fail');
    //   expect(responseDeleteCommentJson.message).toBeDefined();
    //   expect(responseDeleteCommentJson.message).toEqual('Komentar tidak ditemukan');
    // });
    //
    // it('should response 200 and persisted comment', async () => {
    //   // Arrange
    //   const requestAuthPayload = {
    //     username: 'dicoding',
    //     password: 'secret',
    //   };
    //   const requestAddThreadPayload = {
    //     title: 'new thread',
    //     body: 'new thread body',
    //   };
    //   const requestAddCommentPayload = {
    //     content: 'new comment',
    //   };
    //   const server = await createServer(container);
    //
    //   /* adding user */
    //   await server.inject({
    //     method: 'POST',
    //     url: '/users',
    //     payload: {
    //       username: requestAuthPayload.username,
    //       password: requestAuthPayload.password,
    //       fullname: 'Dicoding Indonesia',
    //     },
    //   });
    //
    //   // Action
    //   /* login */
    //   const responseAuth = await server.inject({
    //     method: 'POST',
    //     url: '/authentications',
    //     payload: requestAuthPayload,
    //   });
    //   const responseAuthJson = JSON.parse(responseAuth.payload);
    //   /* adding thread */
    //   const responseAddThread = await server.inject({
    //     method: 'POST',
    //     url: '/threads',
    //     payload: requestAddThreadPayload,
    //     headers: {
    //       Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
    //     },
    //   });
    //   const responseAddThreadJson = JSON.parse(responseAddThread.payload);
    //   /* adding comment */
    //   const responseAddComment = await server.inject({
    //     method: 'POST',
    //     url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments`,
    //     payload: requestAddCommentPayload,
    //     headers: {
    //       Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
    //     },
    //   });
    //
    //   const responseAddCommentJson = JSON.parse(responseAddComment.payload);
    //   console.log(responseAddCommentJson);
    //
    //   /* deleting comment */
    //   const responseDeleteComment = await server.inject({
    //     method: 'DELETE',
    //     url: `/threads/${responseAddThreadJson.data.addedThread.id}/comments/${responseAddCommentJson.data.addedComment.id}`,
    //     headers: {
    //       Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
    //     },
    //   });
    //
    //   // Assert
    //   const responseDeleteCommentJson = JSON.parse(responseDeleteComment.payload);
    //   expect(responseDeleteComment.statusCode).toEqual(200);
    //   expect(responseDeleteCommentJson.status).toEqual('success');
    // });
  });
});
