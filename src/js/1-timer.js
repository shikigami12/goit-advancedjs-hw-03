// Libraries
import flatpickr from "flatpickr";
import iziToast from "izitoast";
// Styles
import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

/**
 * @class Timer
 * @classdesc A class that implements a countdown timer.
 */
class Timer {
  /**
   * @param {string} selector - The CSS selector for the timer container.
   */
  constructor(selector) {
    /**
     * @private
     * @type {string}
     * @description The CSS selector for the timer container.
     */
    this._selector = selector;

    /**
     * @private
     * @type {Date | null}
     * @description The target date for the countdown.
     */
    this._targetDate = null;

    /**
     * @private
     * @type {number | null}
     * @description The ID of the interval timer.
     */
    this._intervalId = null;

    /**
     * @private
     * @type {boolean}
     * @description Indicates whether the timer is currently active.
     */
    this._isActive = false;

    /**
     * @private
     * @type {object}
     * @description Configuration options for the flatpickr instance.
     */
    this._flatpickrOptions = {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose: (selectedDates) => {
        const selectedDate = selectedDates[0];
        if (selectedDate < new Date()) {
          iziToast.error({
            message: 'Please choose a date in the future'
          });
          return;
        }
        this._targetDate = selectedDate;
        this._startButton.disabled = false;
      },
    };

    /**
     * @private
     * @type {HTMLButtonElement}
     * @description The button element that starts the timer.
     */
    this._startButton = document.querySelector(`${this._selector} button[data-start]`);

    /**
     * @private
     * @type {HTMLElement}
     * @description The main container element of the timer.
     */
    this._timerContainer = document.querySelector(this._selector);
  }

  /**
   * @private
   * @method _start
   * @description Starts the countdown timer.
   */
  _start() {
    if (this._isActive) {
      return;
    }
    this._isActive = true;

    const delta = this._targetDate - new Date();
    if (delta <= 0) {
      iziToast.show({
        color: 'red',
        title: 'Error',
        message: 'Please choose a date in the future'
      });
      return;
    }

    this._intervalId = setInterval(() => {
      const currentTime = new Date();
      const delta = this._targetDate - currentTime;

      if (delta <= 0) {
        clearInterval(this._intervalId);
        const dateTimePicker = this._timerContainer.querySelector('input#datetime-picker');
        if (dateTimePicker) {
          dateTimePicker.disabled = false;
          this._isActive = false;
        }
        return;
      }

      const { days, hours, minutes, seconds } = this._convertMs(delta);
      this._timerContainer.querySelector(`.value[data-days]`).textContent = String(days).padStart(2, '0');
      this._timerContainer.querySelector(`.value[data-hours]`).textContent = String(hours).padStart(2, '0');
      this._timerContainer.querySelector(`.value[data-minutes]`).textContent = String(minutes).padStart(2, '0');
      this._timerContainer.querySelector(`.value[data-seconds]`).textContent = String(seconds).padStart(2, '0');
    }, 1000);
  }

  /**
   * @private
   * @method _convertMs
   * @param {number} ms - The number of milliseconds to convert.
   * @returns {object} An object containing days, hours, minutes, and seconds.
   */
  _convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  /**
   * @method init
   * @description Initializes the timer functionality. Sets up the flatpickr instance and the start button event listener.
   */
  init() {
    flatpickr(`${this._selector} input#datetime-picker`, this._flatpickrOptions);
    this._startButton.disabled = true;
    this._startButton.addEventListener('click', () => {
      this._start();
      this._startButton.disabled = true;
      const dateTimePicker = this._timerContainer.querySelector('input#datetime-picker');
      if (dateTimePicker) {
        dateTimePicker.disabled = true;
      }
    });
  }
}

const timer = new Timer('div.timer-wrapper');
timer.init();