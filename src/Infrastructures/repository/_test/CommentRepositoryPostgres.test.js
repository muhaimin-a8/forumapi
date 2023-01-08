const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');

const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    // Arrange
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    // Action & Assert
    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment function', () => {
      it('should persist add comment and return added comment correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        const addComment = new AddComment({
          content: 'comment content',
          thread: 'thread-123',
          owner: 'dicoding',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const comment = await commentRepositoryPostgres.addComment(addComment);
        const commentFinded = await CommentsTableTestHelper.findCommentById('comment-123');

        // Assert
        expect(comment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: 'comment content',
          owner: 'dicoding',
        }));
        expect(commentFinded).toHaveLength(1);
      });

      it('should throw error when thread not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        const addComment = new AddComment({
          content: 'comment content',
          thread: 'thread-123',
          owner: 'dicoding',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(commentRepositoryPostgres.addComment(addComment)).rejects.toThrowError();
      });

      it('should throw error when user not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        const addComment = new AddComment({
          content: 'comment content',
          thread: 'thread-123',
          owner: 'dicoding-tidak-ada',
        });

        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(commentRepositoryPostgres.addComment(addComment)).rejects.toThrowError();
      });
    });

    describe('softDeleteCommentById function', () => {
      it('should soft delete comment by id', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        await CommentsTableTestHelper.addComment({id: 'comment-123', owner: 'dicoding', thread: 'thread-123'});
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        await commentRepositoryPostgres.softDeleteCommentById('comment-123');

        // Assert
        const commentFinded = await CommentsTableTestHelper.findCommentById('comment-123');
        expect(commentFinded[0].is_deleted).toEqual(true);
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should throw error when comment owner is invalid', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        await CommentsTableTestHelper.addComment({id: 'comment-123', owner: 'dicoding', thread: 'thread-123'});
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentOwner({id: 'comment-123', owner: 'dicoding-tidak-ada'})).rejects.toThrowError();
      });

      it('should not throw error when comment owner is valid', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        await CommentsTableTestHelper.addComment({id: 'comment-123', owner: 'dicoding', thread: 'thread-123'});
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentOwner({
          id: 'comment-123',
          owner: 'dicoding',
        })).resolves.not.toThrowError();
      });
    });
    describe('verifyCommentIsExistById function', () => {
      it('should throw error when comment is not exist', async () => {
        // Arrange
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentIsExistById('comment-123')).rejects.toThrowError();
      });

      it('should not throw error when comment is exist', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        await CommentsTableTestHelper.addComment({id: 'comment-123', owner: 'dicoding', thread: 'thread-123'});
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentIsExistById('comment-123')).resolves.not.toThrowError();
      });
    });

    describe('getDetailCommentsByThreadId function', () => {
      it('should return detail comments correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'dicoding'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'dicoding'});
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          owner: 'dicoding',
          content: 'comment content',
          thread: 'thread-123',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-1234',
          owner: 'dicoding',
          content: 'comment content',
          thread: 'thread-123',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const detailComments = await commentRepositoryPostgres.getDetailCommentsByThreadId('thread-123');

        // Assert
        expect(detailComments).toHaveLength(2);
      });
    });
  });
});
