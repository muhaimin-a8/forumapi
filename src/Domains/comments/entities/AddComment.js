class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {content, thread, owner} = payload;
    this.content = content;
    this.thread = thread;
    this.owner = owner;
  }
  _verifyPayload({content, thread, owner}) {
    if (!content || !thread || !owner) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof thread !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (content.length > 1500) {
      throw new Error('ADD_COMMENT.CONTENT_LIMIT_CHAR');
    }
  }
}

module.exports = AddComment;
