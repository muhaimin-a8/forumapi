const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'reply-123',
      content: 'reply content',
    };
    const payload2 = {
      content: 'reply content',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedReply(payload1)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedReply(payload2)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      content: 'reply content',
      owner: 'user-123',
    };
    const payload2 = {
      id: 'reply-123',
      content: 123,
      owner: 'user-123',
    };
    const payload3 = {
      id: 'reply-123',
      content: 'reply content',
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedReply(payload1)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedReply(payload2)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedReply(payload3)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      owner: 'user-123',
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
