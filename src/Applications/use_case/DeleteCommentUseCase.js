const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({threadRepository, commentRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {id, owner, thread} = new DeleteComment(useCasePayload);
    await this._threadRepository.verifyAvailableThreadById(thread);
    await this._commentRepository.verifyCommentIsExistById(id);
    await this._commentRepository.verifyCommentOwner({id, owner});
    await this._commentRepository.softDeleteCommentById(id);
  }
}

module.exports = DeleteCommentUseCase;
