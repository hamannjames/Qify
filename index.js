export default function Qify (base) {

  if (typeof base !== 'object') {
    throw new TypeError('Cannot instantiate Qify with type: ' + typeof base + '. Must use an object.');
  }

  let readyState = true;
  const qGet = {};
  let methodQueue = [];
  let queuePointer = methodQueue;

  const methodHandler = function(method, args) {
    const qOptions = args[args.length - 1];
      
    if (!readyState) {
      queuePointer.push({method, args, qOptions});
      return;
    }
    
    if (qOptions?.qGet) {
      args.unshift(qGet[qOptions.qGet]);
    }
    
    resultHandler.call(this, method.bind(this, ...args), qOptions);
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
      queueHandler.call(this);
    }, mils);  
  }
  
  const proto = function() {
    
    const target = {
      wait: function(mils) {
        waitHandler.call(base, mils);
        return this;
      },
      qGet: function(prop) {
        return qGet[prop];
      },
      qLength: function() {
        return methodQueue.length;
      },
      qify: function(base) {
        return Qify(base);
      }
    };
    
    Object.keys(base).forEach(key => {
      if (typeof base[key] === 'function') {
        target[key] = function() {
          methodHandler.call(base, this.__proto__[key], [...arguments]);
          return this;
        }
      }
    });
    
    return target;
  }

  const queueHandler = function() {
    while(methodQueue.length) {
      const nextMethod = methodQueue.shift();
    
      if (Array.isArray(nextMethod)) {
        setTimeout(() => {
          readyState = true;
          queueHandler.call(this);
        }, nextMethod[0]);
      
        methodQueue = nextMethod.slice(1);
        queuePointer = methodQueue;
      
        while(Array.isArray(queuePointer[queuePointer.length - 1])) {
          queuePointer = queuePointer[queuePointer.length - 1]
        }
      
        return;
      }
      
      if (nextMethod.qOptions?.qGet) {
        nextMethod.args.unshift(qGet[nextMethod.qOptions.qGet]);
      }
      
      resultHandler.call(this, nextMethod.method.bind(this, ...nextMethod.args), nextMethod.qOptions);
    }
  }

  const resultHandler = function(method, options) {

    if (options?.qSet) {
      qGet[options.qSet] = method();
    }
    else {
      method();
    }
  }
  
  return Object.assign(Object.setPrototypeOf({}, base), proto());
}