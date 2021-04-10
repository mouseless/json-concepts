const Concepts = require("./src/concepts").Concepts;

const concepts = Concepts.load({
    object: {
        "$service": {
            "$parameter*": "$type"
        }
    }
})

console.log(concepts.object);