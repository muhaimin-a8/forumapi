const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload1 = {
      title: 'sebuah thread',
      owner: 'user-123',
    };
    const payload2 = {
      id: 'thread-123',
      owner: 'user-123',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'sebuah thread',
    };


    // Action and Assert
    expect(() => new AddedThread(payload1)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedThread(payload2)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedThread(payload3)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      title: 'sebuah thread',
      owner: 'user-123',
    };
    const payload2 = {
      id: 'thread-123',
      title: 123,
      owner: 'user-123',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedThread(payload1)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedThread(payload2)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedThread(payload3)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // Action
    const {id, title, owner} = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});

