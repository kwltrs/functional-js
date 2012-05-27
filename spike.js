var webels = (function() {
    "use strict";
    var namespace = {};

    namespace.prop = function(name) {
        return function(obj) {
            return obj[name];
        };
    };

    namespace.func = function(name) {
        return function(obj) {
            if (typeof obj[name] === "function") {
                return obj[name].apply(obj);
            }
        };
    };

    namespace.compose = function(chain) {
        return function(arg) {
            return chain.reduce(function(value, cb) {
                return cb.call(null, value);
            }, arg);
        };
    };

    namespace.partial = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var cb = args.shift();
        return function() {
            return cb.apply(this, 
                args.concat( Array.prototype.slice.call(arguments, 0) )
            );
        };
    };

    return namespace;
}());

if (module) {
    module.exports = webels;
}
