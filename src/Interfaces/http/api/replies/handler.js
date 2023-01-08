const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/replies/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const useCasePayload = {
      content: request.payload.content,
      owner: request.auth.credentials.id,
      thread: request.params.threadId,
      comment: request.params.commentId,
    };
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    }).code(201);
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const useCasePayload = {
      id: request.params.replyId,
      owner: request.auth.credentials.id,
      comment: request.params.commentId,
      thread: request.params.threadId,
    };

    await deleteReplyUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = RepliesHandler;
