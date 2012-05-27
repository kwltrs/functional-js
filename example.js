var spike = require("./spike.js");

// Dog prototype
var Dog = function(name) { this.name = name; };
Dog.prototype.greet = function() { console.log("Greetings from ", this.name ); };

// Factory function
var createDog = function(breed, name) {
    var dog = new Dog(name);
    dog.breed = breed;
    return dog;
};

// Example for partial
var createDachs = spike.partial(createDog, "dachs");

var dogs = ["Alice", "Bob", "Paula"].map( createDachs );


// Example for prop
console.log("Meet the dogs:", dogs.map( spike.prop("name") ).join(", ") );

// Example for func
dogs.forEach( spike.func("greet") );

// Example for compose
var uppercaseName = spike.compose([ spike.prop("name"), spike.func("toUpperCase") ]);
console.log("Uppercase Name of dogs:", dogs.map( uppercaseName ).join(", ") );
