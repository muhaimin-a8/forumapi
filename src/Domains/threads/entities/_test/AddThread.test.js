const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload didi not contain needed property', () => {
    // Arrange
    const payload1 = {
      title: 'new thread',
      body: 'new thread body',
    };
    const payload2 = {
      body: 'new thread body',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddThread(payload1)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddThread(payload2)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      title: 'new thread',
      body: [],
      owner: 'user-123',
    };
    const payload2 = {
      title: 'new thread',
      body: 'new thread body',
      owner: {},
    };
    const payload3 = {
      title: true,
      body: 'new thread body',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddThread(payload1)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddThread(payload2)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddThread(payload3)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title length is more than 200 characters', () => {
    // Arrange
    const payload = {
      title: 'new thread'.repeat(100),
      body: 'new thread body',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'new thread',
      body: 'new thread body',
      owner: 'user-123',
    };

    // Action
    const {title, body, owner} = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
