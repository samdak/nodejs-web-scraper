const Operation = require('./Operation');
var cheerio = require('cheerio');
var cheerioAdv = require('cheerio-advanced-selectors');
cheerio = cheerioAdv.wrap(cheerio);
const { createDelay } = require('../utils/delay');
const rpur = require('../utils/rpur');

/**
 * Base class for all operations that require reaching out to the internet.
 */
class HttpOperation extends Operation {
  constructor(config) {
    super(config);

    // this.virtualOperations = [];//Will hold "virtual operations" performed by Puppeteer, which are out of the normal scraping flow.

    if (this.condition) {
      const type = typeof this.condition;
      if (config && config.condition) {
        const type = typeof config.condition;
        if (type !== 'function') {
          throw new Error(`"condition" hook must receive a function, got: ${type}`);
        }
      }

      this.counter = 0;
    }
  }

  /**
   *
   * @param {Error} error
   */
  async emitError(error) {
    if (this.config.getException) await this.config.getException(error);
  }

  async repeatPromiseUntilResolved(promiseFactory, href) {
    // debugger;
    const maxAttempts = this.scraper.config.maxRetries + 1; //Note that "maxRetries refers" to the number of retries, whereas
    //"maxAttempts" is the overall number of iterations, therefore adding 1.

    const shouldStop = (error) => {
      // debugger;
      const errorCode = error.response ? error.response.status : error;
      if (this.scraper.config.errorCodesToSkip.includes(errorCode)) {
        // debugger;
        const error = new Error();
        error.message = `Skipping error ${errorCode}`;
        // debugger;
        error.code = errorCode;
        return true;
      }
      return false;
    };
    const onError = async (error, retries) => {
      this.scraper.log(`Retrying failed promise...error: ${error}, 'href:' ${href}`);
      // this.scraper.log('Retrying failed promise...error:', error);
      const newRetries = retries + 1;
      this.scraper.log(`Retreis ${newRetries}`);
      await this.emitError(error);
    };

    // return await this.qyuFactory(() => this.repeatPromiseUntilResolved(promiseFactory, url));

    return await rpur(promiseFactory, { maxAttempts, shouldStop, onError, timeout: 0 });
  }

  /**
   *
   * @param {Function} promiseFunction
   * @return {Qyu}
   *
   */
  qyuFactory(promiseFunction) {
    //This function pushes promise-returning functions into the qyu.

    return this.scraper.qyu(promiseFunction);
  }

  /**
   *
   * @param {string} message
   */
  async beforePromiseFactory(message) {
    //Runs at the beginning of the promise-returning function, that is sent to repeatPromiseUntilResolved().

    this.scraper.state.currentlyRunning++;
    this.scraper.log(message);
    this.scraper.log(`currentlyRunning: ${this.scraper.state.currentlyRunning}`);
    await this.createDelay();
    this.scraper.state.numRequests++;
    this.scraper.log(`overall requests: ${this.scraper.state.numRequests}`);
  }

  afterPromiseFactory() {
    //Runs at the end of the promise-returning function, that is sent to repeatPromiseUntilResolved().
    this.scraper.state.currentlyRunning--;
    this.scraper.log(`currentlyRunning: ${this.scraper.state.currentlyRunning}`);
  }

  async createDelay() {
    let currentSpacer = this.scraper.requestSpacer;
    // this.scraper.requestSpacer = currentSpacer.then(() => Promise.delay(this.scraper.config.delay));
    this.scraper.requestSpacer = currentSpacer.then(() => createDelay(this.scraper.config.delay));
    await currentSpacer;
  }
}
// Object.assign(HttpOperation.prototype,PageMixin)
module.exports = HttpOperation;
