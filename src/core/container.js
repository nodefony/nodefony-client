import {
  v4 as uuidv4
} from 'uuid';

export default (nodefony) => {

  'use strict';

  const ISDefined = function(ele) {
    if (ele !== null && ele !== undefined) {
      return true;
    }
    return false;
  };

  const generateId = function() {
    return uuidv4();
  };

  const parseParameterString = function(str, value) {
    let ns = null;
    switch (nodefony.typeOf(str)) {
      case "string":
        return parseParameterString.call(this, str.split("."), value);
      case "array":
        switch (str.length) {
          case 1:
            ns = Array.prototype.shift.call(str);
            if (!this[ns]) {
              this[ns] = value;
            } else {
              if (ISDefined(value)) {
                this[ns] = value;
              } else {
                return this[ns];
              }
            }
            return value;
          default:
            ns = Array.prototype.shift.call(str);
            if (!this[ns] && ISDefined(value)) {
              this[ns] = {};
            }
            return parseParameterString.call(this[ns], str, value);
        }
        break;
      default:
        return false;
    }
  };

  /*
   *
   *	CONTAINER CLASS
   *
   */
  class Container {

    constructor(services, parameters) {
      this.protoService = function() {};
      this.protoParameters = function() {};
      this.scope = {};
      this.services = new this.protoService();
      if (services && typeof services === "object") {
        for (let service in services) {
          this.set(service, services[service]);
        }
      }
      this.parameters = new this.protoParameters();
      if (parameters && typeof parameters === "object") {
        for (let parameter in parameters) {
          this.set(parameter, parameters[parameter]);
        }
      }
    }

    logger(pci, severity, msgid, msg) {
      let syslog = this.get("syslog");
      if (!msgid) {
        msgid = "CONTAINER SERVICES ";
      }
      return syslog.logger(pci, severity, msgid, msg);
    }

    set(name, object) {
      return this.protoService.prototype[name] = object;
    }

    get(name) {
      if (name in this.services) {
        return this.services[name];
      }
      return null;
      //this.log("GET : " + name+" don't exist", "WARNING");
    }

    has(name) {
      return this.services[name];
    }

    addScope(name) {
      if (!this.scope[name]) {
        return this.scope[name] = {};
      }
      return this.scope[name];
    }

    enterScope(name) {
      let sc = new Scope(name, this);
      this.scope[name][sc.id] = sc;
      return sc;
    }

    enterScopeExtended(name) {
      let sc = new ExtendedScope(name, this);
      this.scope[name][sc.id] = sc;
      return sc;
    }

    leaveScope(scope) {
      if (this.scope[scope.name]) {
        let sc = this.scope[scope.name][scope.id];
        if (sc) {
          sc.clean();
          //console.log("pass leaveScope "+ scope.id)
          delete this.scope[scope.name][scope.id];
          sc = null;
        }
        //console.log(this.scope)
      }
    }

    removeScope(name) {
      if (this.scope[name]) {
        for (let scope in this.scope[name]) {
          this.leaveScope(this.scope[name][scope]);
        }
        delete this.scope[name];
      }
    }

    setParameters(name, str) {
      if (typeof name !== "string") {
        this.log(new Error("setParameters : container parameter name must be a string"));
        return false;
      }
      if (!ISDefined(str)) {
        this.log(new Error("setParameters : " + name + " container parameter value must be define"));
        return false;
      }
      if (parseParameterString.call(this.protoParameters.prototype, name, str) === str) {
        return str;
      } else {
        this.log(new Error("container parameter " + name + " parse error"));
        return false;
      }
    }

    getParameters(name) {
      if (typeof name !== "string") {
        this.log(new Error("container parameter name must be a string"));
        return false;
      }
      //return parseParameterString.call(this.protoParameters.prototype, name, null);
      return parseParameterString.call(this.parameters, name, null);
    }
  }

  /*
   *
   *	SCOPE CLASS
   *
   */

  class Scope extends Container {

    constructor(name, parent) {
      super();
      this.name = name;
      this.parent = parent;
      this.services = new parent.protoService();
      this.parameters = new parent.protoParameters();
      this.scope = parent.scope;
      this.id = generateId();

    }

    set(name, obj) {
      this.services[name] = obj;
      return super.set(name, obj);
    }

    clean() {
      this.services = null;
      delete this.services;
      this.parameters = null;
      delete this.parameters;
    }

    setParameters(name, str) {
      if (parseParameterString.call(this.parameters, name, str) === str) {
        return super.setParameters(name, str);
      } else {
        this.log(new Error("container parameter " + name + " parse error"));
        return false;
      }
    }
  }

  /*
   *
   *	ExtendedScope CLASS
   *
   */
  class ExtendedScope extends Container {

    constructor(name, parent) {
      super();
      this.name = name;
      this.parent = parent;
      this.services = new parent.protoService();
      this.parameters = new parent.protoParameters();
      this.scope = parent.scope;
      this.id = generateId();
      this.protoService = function() {};
      this.protoService.prototype = nodefony.extend({}, this.parent.protoService.prototype);
      this.protoParameters = function() {};
      this.protoParameters.prototype = nodefony.extend({}, this.parent.protoParameters.prototype);
    }

    clean() {
      this.services = null;
      delete this.services;
      this.parameters = null;
      delete this.parameters;
      this.protoService = null;
      this.protoParameters = null;
    }

    set(name, obj) {
      this.services[name] = obj;
      return super.set(name, obj);
    }

    setParameters(name, str) {
      if (parseParameterString.call(this.parameters, name, str) === str) {
        return super.setParameters(name, str);
      } else {
        this.log(new Error("container parameter " + name + " parse error"));
        return false;
      }
    }
  }
  //nodefony.Container = Container;
  //nodefony.Scope = Scope;
  //nodefony.ExtendedScope = ExtendedScope;
  return {
    Container,
    Scope,
    ExtendedScope
  };
};
