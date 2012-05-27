var ns = require("../spike.js");

buster.testCase("spike.prop", {
    "is function": function() {
        assert.isFunction(ns.prop);
    },

    "The property getter for 'foo'": {
        setUp: function() {
            this.propGetter = ns.prop("foo");
        },

        "is function": function() {
            assert.isFunction( this.propGetter );
        },

        "gets value of foo property": function() {
            var obj = { foo: "bar" };
            assert.equals( "bar", this.propGetter(obj) );
        },

        "gets undefined of non-existing property": function() {
            refute.defined( this.propGetter({}) );
        }
    }
});


buster.testCase("spike.func", {
    "is function": function() {
        assert.isFunction(ns.func);
    },

    "The caller for function 'foo'": {
        setUp: function() {
            this.funcCaller = ns.func("foo");
        },

        "is function": function() {
            assert.isFunction( this.funcCaller );
        },

        "When passed object with foo method": {
            setUp: function() {
                this.obj = { foo: this.stub().returns( 42 ) };
                this.return_value = this.funcCaller( this.obj );
            },

            "calls function of object": function() {
                assert.called( this.obj.foo );
            },

            "returns value of call": function() {
                assert.equals( 42, this.return_value );
            }
        },

        "When passed object without foo": function() {
            var funcCaller = this.funcCaller;
            refute.exception(function() {
                refute.defined( funcCaller( {} ));
            });
        },

        "When passed object with foo not a method": function() {
            var funcCaller = this.funcCaller;
            refute.exception(function() {
                refute.defined( funcCaller( {foo: "this is string"} ));
            });
        }
    }
});


buster.testCase("spike.compose", {
    "is function": function() {
        assert.isFunction( ns.compose );
    },

    "When calling a composition of 3 functions": {
        setUp: function() {
            this.stubs = [];
            for (var i = 1; i < 4; i++) {
                this.stubs.push( this.stub().withArgs( i ).returns( i+1 ) );
            }

            this.composed = ns.compose( this.stubs );

            this.result = this.composed( 1 );
        },

        "the composition is function": function() {
            assert.isFunction( this.composed );
        },

        "called all 3 function": function() {
            assert.calledOnceWith( this.stubs[0], 1 );
            assert.calledOnceWith( this.stubs[1], 2 );
            assert.calledOnceWith( this.stubs[2], 3 );
        },

        "return value": function() {
            assert.equals( 4, this.result );
        },

        "call order": function() {
            assert.callOrder( this.stubs[0], this.stubs[1], this.stubs[2] );
        }
    }
});


buster.testCase("spike.partial", {
    "is function": function() {
        assert.isFunction( ns.partial );
    },

    "Partial function with one curried argument": {
        setUp: function() {
            this.f = this.stub().returns( 42 );
            this.partial_f = ns.partial(this.f, "foo");
        },

        "is function": function() {
            assert.isFunction( this.partial_f );
        },

        "When called with no argument": {
            setUp: function() {
                this.result = this.partial_f();
            },

            "original function called with curried argument": function() {
                assert.calledWith( this.f, "foo" );
            },

            "returns result from stub": function() {
                assert.equals( 42, this.result );
            }
        },

        "When called with two arguments": {
            setUp: function() {
                this.result = this.partial_f("a", "b");
            },

            "original function called with curried and additional arguments": function() {
                assert.calledWith( this.f, "foo", "a", "b" );
            },

            "returns result from stub": function() {
                assert.equals( 42, this.result );
            }
        }
    },

    "Partial function with two curried arguments": {
        setUp: function() {
            this.f = this.stub().returns( 23 );
            this.partial_f = ns.partial(this.f, "foo", "bar");
        },

        "called with no arguments": function() {
            var result = this.partial_f();
            assert.calledWith( this.f, "foo", "bar" );
            assert.equals(23, result);
        },

        "called with three arguments": function() {
            var result = this.partial_f(1, 2, 3);
            assert.calledWith( this.f, "foo", "bar", 1, 2, 3 );
            assert.equals(23, result);
        }
    }
});
