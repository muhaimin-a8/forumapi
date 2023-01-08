const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyAvailableThreadById(useCasePayload.thread);
    return await this._commentRepository.addComment(new AddComment(useCasePayload));
  }
}

module.exports = AddCommentUseCase;

