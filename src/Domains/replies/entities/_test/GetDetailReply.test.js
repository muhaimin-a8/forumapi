const GetDetailReply = require('../GetDetailReply');

describe('a GetDetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'reply-123',
      content: 'reply content',
      username: 'user-123',
      updated_at: '2022-01-01T07:07:07.070Z',
    };
    const payload2 = {
      content: 'reply content',
      username: 'user-123',
      updated_at: '2022-01-01T07:07:07.070Z',
      is_deleted: false,
    };
    const payload3 = {
      id: 'reply-123',
      username: 'user-123',
      updated_at: '2022-01-01T07:07:07.070Z',
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new GetDetailReply(payload1)).toThrowError('GET_DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetDetailReply(payload2)).toThrowError('GET_DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetDetailReply(payload3)).toThrowError('GET_DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      content: 'reply content',
      username: 'user-123',
      updated_at: '2022-01-01T07:07:07.070Z',
      is_deleted: false,
    };
    const payload2 = {
      id: 'reply-123',
      content: 123,
      username: 'user-123',
      updated_at: '2022-01-01T07:07:07.070Z',
      is_deleted: false,
    };
    const payload3 = {
      id: 'reply-123',
      content: 'reply content',
      username: 123,
      updated_at: 123,
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new GetDetailReply(payload1)).toThrowError('GET_DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetDetailReply(payload2)).toThrowError('GET_DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetDetailReply(payload3)).toThrowError('GET_DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetDetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      username: 'user-123',
      updated_at: '2022-01-01T07:07:07.070Z',
      is_deleted: false,
    };

    // Action
    const getDetailReply = new GetDetailReply(payload);

    // Assert
    expect(getDetailReply.id).toEqual(payload.id);
    expect(getDetailReply.content).toEqual(payload.content);
    expect(getDetailReply.username).toEqual(payload.username);
    expect(getDetailReply.date).toEqual(payload.updated_at);
  });
});
