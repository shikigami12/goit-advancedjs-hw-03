import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

/**
 * @class PromiseGenerator
 * @classdesc A class that handles form submission, generates promises based on user input,
 * and displays notifications using iziToast.
 */
class PromiseGenerator {
  /**
   * @constructor
   * @param {string} formSelector - The CSS selector for the form element.
   */
  constructor(formSelector) {
    /**
     * @private
     * @type {HTMLFormElement}
     * @description The form element.
     */
    this._form = document.querySelector(formSelector);

    if (!this._form) {
      console.error(`Form with selector "${formSelector}" not found.`);
      return;
    }

    this._form.addEventListener('submit', this._handleSubmit.bind(this));
  }

  /**
   * @private
   * @method _handleSubmit
   * @param {Event} event - The submit event object.
   * @description Handles the form submission, extracts data, generates a promise,
   * and displays the result using iziToast.
   */
  _handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(this._form);
    const delay = parseInt(formData.get('delay'));
    const state = formData.get('state');

    const isResolved = state === 'fulfilled';
    this._generatePromise(isResolved, delay)
      .then(data => {
        iziToast.show({
          title: '✅',
          message: data,
          position: 'topRight',
          color: 'green',
        });
      })
      .catch(error => {
        iziToast.show({
          title: '❌',
          message: error,
          position: 'topRight',
          color: 'red',
        });
      });
    this._form.reset();
  }

  /**
   * @private
   * @method _generatePromise
   * @param {boolean} shouldResolve - Whether the promise should resolve or reject.
   * @param {number} delay - The delay in milliseconds before the promise settles.
   * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
   */
  _generatePromise(shouldResolve, delay) {
    const successfulMessage = `Fulfilled promise in ${delay}ms`;
    const failedMessage = `Rejected promise in ${delay}ms`;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldResolve) {
          resolve(successfulMessage);
        } else {
          reject(failedMessage);
        }
      }, delay);
    });
  }
}

// Initialize the PromiseGenerator with the form selector
const promiseGenerator = new PromiseGenerator('form');