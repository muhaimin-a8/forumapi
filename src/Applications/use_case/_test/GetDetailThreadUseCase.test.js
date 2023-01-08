const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailComment = require('../../../Domains/comments/entities/GetDetailComment');
const GetDetailReply = require('../../../Domains/replies/entities/GetDetailReply');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    /* mock use case input */
    const mockDetailThread = new GetDetailThread({
      id: threadId,
      title: 'thread title',
      body: 'thread body',
      username: 'user-123',
      updated_at: '2022-01-01T07:07:07.070Z',
    });
    const mockListDetailComment = [
      new GetDetailComment({
        id: commentId,
        content: 'comment content',
        username: 'user-123',
        updated_at: '2022-01',
        is_deleted: false,
      }),
    ];
    const mockListDetailReply = [
      new GetDetailReply({
        id: 'reply-123',
        content: 'reply content',
        username: 'user-123',
        updated_at: '2022-01',
        is_deleted: false,
      }),
    ];
    /* create dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new CommentRepository();
    /* mock needed function */
    mockThreadRepository.verifyAvailableThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getDetailCommentsByThreadId = jest.fn(() => Promise.resolve(mockListDetailComment));
    mockReplyRepository.getDetailReplyByCommentId = jest.fn(() => Promise.resolve(mockListDetailReply));

    /* create use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toStrictEqual({...mockDetailThread, comments: mockListDetailComment});
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getDetailCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getDetailReplyByCommentId).toBeCalledWith(commentId);
  });
});
