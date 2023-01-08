class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {content, comment, thread, owner} = payload;

    this.content = content;
    this.comment = comment;
    this.thread = thread;
    this.owner = owner;
  }

  _verifyPayload({content, comment, thread, owner}) {
    if (!content || !comment || !owner || !thread) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string' || typeof comment !== 'string' || typeof thread !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (content.length > 1500) {
      throw new Error('ADD_REPLY.CONTENT_LIMIT_CHAR');
    }
  }
}

module.exports = AddReply;
