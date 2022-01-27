import AbstractModel from './abstract-model';
import {ChangeType} from '../utils/const.js';

class CommentsModelError extends Error {}

export default class CommentsModel extends AbstractModel {
  set comments(comments) {
    this._data = comments;

    this._notifyObservers(ChangeType.MAJOR);
  }

  get comments() {
    return this._data;
  }

  init() {
    return Promise.resolve();
  }

  getComment(commentId) {
    const comment = this.comments.find(({id: currentCommentId}) => currentCommentId === commentId);

    if (comment === undefined) {
      throw new CommentsModelError(`Comment with ID '${commentId}' not found.`);
    }

    return comment;
  }

  deleteComment(commentId) {
    this.getComment(commentId);

    this._data = this._data.filter(({id: currentCommentId}) => currentCommentId === commentId);

    this._notifyObservers(ChangeType.MINOR);
  }
}
