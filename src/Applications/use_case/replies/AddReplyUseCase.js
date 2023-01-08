const AddReply = require('../../../Domains/replies/entities/AddReply');
class AddReplyUseCase {
  constructor({replyRepository, commentRepository, threadRepository}) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._threadRepository.verifyAvailableThreadById(addReply.thread);
    await this._commentRepository.verifyCommentIsExistById(addReply.comment);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
