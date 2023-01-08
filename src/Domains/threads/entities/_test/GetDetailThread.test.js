const GetDetailThread = require('../GetDetailThread');

describe('a GetDetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      owner: 'user-123',
    };
    const payload2 = {
      title: 'thread title',
      body: 'thread body',
      owner: 'user-123',
      updated_at: '2022',
    };
    const payload3 = {
      id: 'thread-123',
      body: 'thread body',
      owner: 'user-123',
      updated_at: '2022',
    };

    // Action and Assert
    expect(() => new GetDetailThread(payload1)).toThrowError('GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetDetailThread(payload2)).toThrowError('GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetDetailThread(payload3)).toThrowError('GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      title: 'thread title',
      body: 'thread body',
      username: 'user-123',
      updated_at: '2022',
    };
    const payload2 = {
      id: 'thread-123',
      title: 123,
      body: 'thread body',
      username: 'user-123',
      updated_at: '2022',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'thread title',
      body: 123,
      username: 'user-123',
      updated_at: {},
    };

    // Action and Assert
    expect(() => new GetDetailThread(payload1)).toThrowError('GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetDetailThread(payload2)).toThrowError('GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetDetailThread(payload3)).toThrowError('GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetDetailThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      username: 'user-123',
      updated_at: '2022',
    };

    // Action
    const getDetailThread = new GetDetailThread(payload);

    // Assert
    expect(getDetailThread.id).toEqual(payload.id);
    expect(getDetailThread.title).toEqual(payload.title);
    expect(getDetailThread.body).toEqual(payload.body);
    expect(getDetailThread.username).toEqual(payload.username);
    expect(getDetailThread.date).toEqual(payload.updated_at);
  });
});
