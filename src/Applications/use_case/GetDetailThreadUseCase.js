class GetDetailThreadUseCase {
  constructor({threadRepository, commentRepository, replyRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThreadById(threadId);
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    const comments = await this._commentRepository.getDetailCommentsByThreadId(threadId);
    const result = {
      ...thread,
      comments,
    };

    for (let i = 0; i < result.comments.length; i++) {
      result.comments[i].replies = await this._replyRepository.getDetailReplyByCommentId(result.comments[i].id);
    }
    return result;
  }
}

module.exports = GetDetailThreadUseCase;

