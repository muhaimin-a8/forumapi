const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'comment-123',
      content: 'sebuah comment',
    };

    const payload2 = {
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const payload3 = {
      id: 'comment-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedComment(payload1)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedComment(payload2)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedComment(payload3)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const payload2 = {
      id: 'comment-123',
      content: {},
      owner: 'user-123',
    };

    const payload3 = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedComment(payload1)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedComment(payload2)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedComment(payload3)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
