const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      content: 'new reply',
      owner: 'user-123',
    };
    const payload2 = {
      comment: 'comment-123',
      owner: 'user-123',
      thread: 'thread-123',
    };

    // Action and Assert
    expect(() => new AddReply(payload1)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddReply(payload2)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      content: 123,
      comment: 'comment-123',
      owner: 'user-123',
      thread: 'thread-123',
    };
    const payload2 = {
      content: 'new reply',
      comment: 123,
      owner: {},
      thread: [],
    };

    // Action and Assert
    expect(() => new AddReply(payload1)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddReply(payload2)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload content length more than 1500 characters', () => {
    // Arrange
    const payload = {
      content: 'new reply'.repeat(300),
      comment: 'comment-123',
      owner: 'user-123',
      thread: 'thread-123',
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.CONTENT_LIMIT_CHAR');
  });

  it('should create AddReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'new reply',
      comment: 'comment-123',
      owner: 'user-123',
      thread: 'thread-123',
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.comment).toEqual(payload.comment);
    expect(addReply.owner).toEqual(payload.owner);
    expect(addReply.thread).toEqual(payload.thread);
  });
});
