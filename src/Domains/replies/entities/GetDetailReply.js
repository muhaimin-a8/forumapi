/* eslint-disable camelcase */
class GetDetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, content, username, updated_at, is_deleted} = payload;

    this.id = id;
    this.content = (!is_deleted) ? content : '**balasan telah dihapus**';
    this.username = username;
    this.date = updated_at;
  }
  _verifyPayload({id, content, username, updated_at, is_deleted}) {
    if (!id || !content || !username || !updated_at || is_deleted === undefined) {
      throw new Error('GET_DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof username !== 'string' || typeof updated_at !== 'string' || typeof is_deleted !== 'boolean') {
      throw new Error('GET_DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetDetailReply;
