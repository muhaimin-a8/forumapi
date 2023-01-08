const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GetDetailThread = require('../../Domains/threads/entities/GetDetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const {title, body, owner} = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({...result.rows[0]});
  }

  async verifyAvailableThreadById(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getDetailThreadById(id) {
    const query = {
      text: `SELECT t.id, t.title, t.body, u.username, t.updated_at FROM threads t JOIN users u ON t.owner = u.id WHERE t.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    result.rows[0].updated_at = new Date(result.rows[0].updated_at).toISOString();

    return new GetDetailThread({...result.rows[0]});
  }
}

module.exports = ThreadRepositoryPostgres;
