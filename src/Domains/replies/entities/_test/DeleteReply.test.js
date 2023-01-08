const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entities', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const payload1 = {
      id: 'reply-123',
      owner: 'user-123',
    };
    const payload2 = {
      owner: 'user-123',
      comment: 'comment-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload1)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new DeleteReply(payload2)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const payload1 = {
      id: 123,
      owner: 'user-123',
      comment: 'comment-123',
      thread: 123,
    };
    const payload2 = {
      id: 'reply-123',
      owner: 123,
      comment: 'comment-123',
      thread: 'thread-123',
    };
    const payload3 = {
      id: 'reply-123',
      owner: 'user-123',
      comment: 123,
      thread: 'thread-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload1)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DeleteReply(payload2)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DeleteReply(payload3)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteReply object correctly', async () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
      comment: 'comment-123',
      thread: 'thread-123',
    };

    // Action
    const {id, owner, comment, thread} = new DeleteReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(comment).toEqual(payload.comment);
    expect(thread).toEqual(payload.thread);
  });
});
