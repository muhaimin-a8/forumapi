const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const {content, thread, owner} = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, thread],
    };

    const result = await this._pool.query(query);
    return new AddedComment({...result.rows[0]});
  }

  async verifyCommentOwner({id, owner}) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };
    const res = await this._pool.query(query);
    if (!res.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyCommentIsExistById(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const res = await this._pool.query(query);
    if (!res.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  async softDeleteCommentById(id) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE comments SET (is_deleted, updated_at) = (true, $1) WHERE id = $2',
      values: [updatedAt, id],
    };

    await this._pool.query(query);
  }

  async getDetailCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, c.content, u.username, c.is_deleted, c.updated_at FROM comments c JOIN users u ON c.owner = u.id WHERE thread = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((comment) => {
      comment.updated_at = comment.updated_at.toISOString();
      return new GetDetailComment(comment);
    });
  }
}

module.exports = CommentRepositoryPostgres;
