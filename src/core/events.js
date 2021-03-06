const events = require('events');
const regListenOn = /^on(.*)$/;
const defaultNbListeners = 20;
//const _ = require('lodash');
//import { get, isEmpty} from 'lodash';

export default (nodefony) => {

  'use strict';

  class Notification extends events.EventEmitter {

    constructor(settings, context, options = {}) {
      super(options);
      if (options.nbListeners) {
        this.setMaxListeners(options.nbListeners || defaultNbListeners);
      }
      if (settings) {
        this.settingsToListen(settings, context);
      }
    }
    /**
     *
     *  @method listen
     *
     */
    listen(context, eventName, callback) {
      let event = arguments[1];
      let ContextClosure = this;
      if (typeof(callback) === 'function' || callback instanceof Function) {
        this.addListener(eventName, callback.bind(context));
      }
      return function() {
        Array.prototype.unshift.call(arguments, event);
        return ContextClosure.fire.apply(ContextClosure, arguments);
      };
    }
    /**
     *
     *  @method fire
     *
     */
    fire(...args) {
      try {
        return this.emit(...args);
      } catch (e) {
        throw e;
      }
    }

    async emitAsync(type, ...args) {
      const handler = this._events[type];
      //const handler = _.get(this._events, type);
      //if (_.isEmpty(handler) && !nodefony.isFunction(handler)) {
      if (!nodefony.isFunction(handler) && handler.length === 0) {
        return false;
      }
      let tab = [];
      if (typeof handler === 'function') {
        tab.push(await Reflect.apply(handler, this, args));
      } else {
        let size = handler.length;
        let i = 0;
        while (size !== i) {
          tab.push(await Reflect.apply(handler[i], this, args));
          if (handler.length === size) {
            i++;
          } else {
            size--;
          }
        }
        /*for await (const func of handler) {
          tab.push(await Reflect.apply(func, this, args));
        }*/
      }
      return tab;
    }

    async fireAsync(...args) {
      return this.emitAsync(...args);
    }
    /**
     *
     *  @method settingsToListen
     *
     */
    settingsToListen(localSettings, context) {
      for (let i in localSettings) {
        let res = regListenOn.exec(i);
        if (!res) {
          continue;
        }
        if (context) {
          return this.listen(context || this, res[0], localSettings[i]);
        }
        return this.on(res[0], localSettings[i]);
      }
    }
    /**
     *
     *  @method unListen
     *
     */
    unListen(...args) {
      return this.removeListener(...args);
    }
  }

  return  Notification;
};
