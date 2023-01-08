const DeleteReply = require('../../../../Domains/replies/entities/DeleteReply');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = new DeleteReply({
      id: 'reply-123',
      comment: 'comment-123',
      owner: 'user-123',
      thread: 'thread-123',
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExistById = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReplyById = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.softDeleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await deleteReplyUseCase.execute(useCasePayload);
    await expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(useCasePayload.thread);
    await expect(mockCommentRepository.verifyCommentIsExistById).toBeCalledWith(useCasePayload.comment);
    await expect(mockReplyRepository.verifyAvailableReplyById).toBeCalledWith(useCasePayload.id);
    await expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith({
      id: useCasePayload.id,
      owner: useCasePayload.owner,
    });
    await expect(mockReplyRepository.softDeleteReplyById).toBeCalledWith(useCasePayload.id);
  });
});
