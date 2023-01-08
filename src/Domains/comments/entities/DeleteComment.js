class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, owner, thread} = payload;

    this.id = id;
    this.owner = owner;
    this.thread = thread;
  }

  _verifyPayload({id, owner, thread}) {
    if (!id || !owner || !thread) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof thread !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
