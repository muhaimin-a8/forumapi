const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const GetDetailReply = require('../../Domains/replies/entities/GetDetailReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const {content, owner, comment} = addReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, comment, owner],
    };

    const result = await this._pool.query(query);

    return new AddedReply({...result.rows[0]});
  }

  async verifyAvailableReplyById(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyOwner({id, owner}) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async softDeleteReplyById(id) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE replies SET (is_deleted, updated_at) = (true, $1) WHERE id = $2',
      values: [updatedAt, id],
    };

    await this._pool.query(query);
  }

  async getDetailReplyByCommentId(id) {
    const query = {
      text: 'SELECT r.id, r.content, u.username, r.is_deleted, r.updated_at FROM replies r JOIN users u ON r.owner = u.id WHERE r.comment = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.map((reply) => {
      reply.updated_at = reply.updated_at.toISOString();
      return new GetDetailReply(reply);
    });
  }
}

module.exports = ReplyRepositoryPostgres;
