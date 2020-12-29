export default function Qify (base) {
  if (typeof base !== 'object') {
    throw new TypeError('Cannot instantiate Qify with type: ' + typeof base + '. Must use an object.');
  }
  
  const proto = function() {
    
    let readyState = true;
    let qGet = {};
  
    let methodQueue = [];
    let queuePointer = methodQueue;
  
    const methodHandler = function(method, args) {
      const qOptions = args[args.length - 1];
      
      if (!readyState) {
        let qSet = {};
        
        if (qOptions?.qSet) {
          qSet.willSet = true;
          qSet.setter = qOptions.qSet;
          qSet.this = base;
          qSet.args = args;
          qSet.method = method;
          
          if (qOptions?.qGet) {
            qSet.getter = qOptions.qGet;
          }

          queuePointer.push(qSet);

          return;
        }
        
        if (qOptions?.qGet) {
          queuePointer.push(method.bind(this, qGet[qOptions.qGet], ...args));
        }
        else {
          queuePointer.push(method.bind(this, ...args));
        }
      
        return;
      }
      
      let result = null;
      
      if(qOptions?.qGet) {
        result = method.call(this, qGet[qOptions.qGet], ...args);
      }
      else {
        result = method.call(this, ...args);
      }
      
      if (qOptions?.qSet) {
        qGet[qOptions.qSet] = result;
      }
      
      if (typeof result === 'Promise') {
        promiseHandler(result);
      }
    }
  
    const waitHandler = function(mils) {
      
      if (!readyState) {
        queuePointer.push([]);
        queuePointer = queuePointer[queuePointer.length - 1];
        queuePointer.push(mils);
      
        return;
      }
    
      readyState = false;
    
      setTimeout(() => {
        readyState = true;
        queueHandler();
      }, mils);
      
    }
  
    const queueHandler = function() {
      while(methodQueue.length) {
        const method = methodQueue.shift();
      
        if (Array.isArray(method)) {
          setTimeout(() => {
            readyState = true;
            queueHandler();
          }, method[0]);
        
          methodQueue = method.slice(1);
          queuePointer = methodQueue;
        
          while(Array.isArray(queuePointer[queuePointer.length - 1])) {
            queuePointer = queuePointer[queuePointer.length - 1]
          }
        
          return;
        }
        
        if (typeof method === 'object' && method.willSet) {
          if (method.getter) {
            method.args.unshift(qGet[method.getter]);
          }
          qGet[method.setter] = method.method.call(method.this, ...method.args);
        }
        else {
          method();
        }
      }
    }
    
    const target = {
      wait: function(mils) {
        waitHandler(mils);
        return this;
      },
      qGet: function(prop) {
        return qGet[prop];
      },
      qLength: function() {
        return methodQueue.length;
      } 
    };
    
    Object.keys(base).forEach(key => {
      if (typeof base[key] === 'function') {
        target[key] = function() {
          methodHandler.call(this, this.__proto__[key], [...arguments]);
          return this;
        }
      }
    });
    
    return target;
  }
  
  return Object.assign(Object.setPrototypeOf({}, base), proto());
}