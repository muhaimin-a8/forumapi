class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, owner, comment, thread} = payload;

    this.id = id;
    this.owner = owner;
    this.comment = comment;
    this.thread = thread;
  }
  _verifyPayload({id, owner, comment, thread}) {
    if (!id || !owner || !comment || !thread) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof comment !== 'string' || typeof thread !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
