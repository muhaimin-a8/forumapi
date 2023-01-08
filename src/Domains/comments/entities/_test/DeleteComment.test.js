const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'comment-123',
      owner: 'user-123',
    };
    const payload2 = {
      id: 'comment-123',
      thread: 'thread-123',
    };
    const payload3 = {
      owner: 'user-123',
      thread: 'thread-123',
    };

    // Action and Assert
    expect(() => new DeleteComment(payload1)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new DeleteComment(payload2)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new DeleteComment(payload3)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      owner: 'user-123',
      thread: 'thread-123',
    };
    const payload2 = {
      id: 'comment-123',
      owner: 123,
      thread: 'thread-123',
    };
    const payload3 = {
      id: 'comment-123',
      owner: 'user-123',
      thread: 123,
    };

    // Action and Assert
    expect(() => new DeleteComment(payload1)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DeleteComment(payload2)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DeleteComment(payload3)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      thread: 'thread-123',
    };

    // Action
    const {id, owner, thread} = new DeleteComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
  });
});
