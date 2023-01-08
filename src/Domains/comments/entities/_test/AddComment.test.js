const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      content: 'sebuah comment',
      thread: 'thread-123',
    };

    const payload2 = {
      content: 'sebuah comment',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload1)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddComment(payload2)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      content: 123,
      thread: 'thread-123',
      owner: 'dicoding',
    };

    const payload2 = {
      content: 'sebuah comment',
      thread: 'thread-123',
      owner: {},
    };

    // Action and Assert
    expect(() => new AddComment(payload1)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddComment(payload2)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw when comment length is more than 1500 characters', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment'.repeat(1500),
      thread: 'thread-123',
      owner: 'dicoding',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.CONTENT_LIMIT_CHAR');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      thread: 'thread-123',
      owner: 'dicoding',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.thread).toEqual(payload.thread);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
