const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({replyRepository, commentRepository, threadRepository}) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.verifyAvailableThreadById(deleteReply.thread);
    await this._commentRepository.verifyCommentIsExistById(deleteReply.comment);
    await this._replyRepository.verifyAvailableReplyById(deleteReply.id);
    await this._replyRepository.verifyReplyOwner({
      id: deleteReply.id,
      owner: deleteReply.owner,
    });
    await this._replyRepository.softDeleteReplyById(deleteReply.id);
  }
}

module.exports = DeleteReplyUseCase;
