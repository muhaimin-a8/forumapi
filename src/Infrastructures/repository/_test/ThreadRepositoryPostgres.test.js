const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    // Arrange
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    // Action & Assert
    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist add thread and return added thread correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'user-123'});
        const newThread = new AddThread({
          title: 'new thread',
          body: 'new thread body',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
        const addedThread = await threadRepositoryPostgres.addThread(newThread);
        const threadCreated = await ThreadsTableTestHelper.findThreadById('thread-123');

        // Assert
        expect(addedThread).toStrictEqual(new AddedThread({
          id: 'thread-123',
          title: 'new thread',
          owner: 'user-123',
        }));
        expect(threadCreated).toHaveLength(1);
      });
    });

    describe('verifyAvailableThreadById', () => {
      it('should throw NotFoundError when thread not found', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(threadRepositoryPostgres.verifyAvailableThreadById('not-found-thread-id')).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when thread found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'user-123'});
        await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'user-123'});
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(threadRepositoryPostgres.verifyAvailableThreadById('thread-123')).resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('getDetailThreadById function', () => {
      it('should presist get detail thread and return detail thread correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({id: 'user-123'});
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          title: 'new thread',
          body: 'new thread body',
          owner: 'user-123',
          updated_at: '2023-01-04T02:31:57.749Z',
        });
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action
        const detailThread = await threadRepositoryPostgres.getDetailThreadById('thread-123');

        // Assert
        expect(detailThread).toHaveProperty('id');
        expect(detailThread).toHaveProperty('title');
        expect(detailThread).toHaveProperty('date');
        expect(detailThread).toHaveProperty('username');
      });
    });
  });
});
