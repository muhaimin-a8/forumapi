const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
      thread: 'thread-123',
    };

    /* creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /* mocking needed function */
    mockThreadRepository.verifyAvailableThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExistById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.softDeleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload));
    await expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(useCasePayload.thread);
    await expect(mockCommentRepository.verifyCommentIsExistById).toBeCalledWith(useCasePayload.id);
    await expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith({
      id: useCasePayload.id,
      owner: useCasePayload.owner,
    });
    await expect(mockCommentRepository.softDeleteCommentById).toBeCalledWith(useCasePayload.id);
  });
});
