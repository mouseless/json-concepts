# Basics

"JSON Concepts" is a schema specification in JSON format which allows you to
create a conceptual design for any type of data structure, especially those
that represent a schema.

A conceptual design is a file in JSON format with a `.concepts.json` extension.
These files are referred as concepts files throughout the document. Below is an
example of a concepts file;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response": "$responseType"
    }
}
```

Although it is more or less of a self explanatory example, what this document
represents will become more and more clear as you go throughout this document.
For now, we only need you to realise that this file defines concepts to
validate a schema like the following;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

## About Specifications

Every specification introduces a feature of JSON Concepts and there will be one
or more cases to clearly define the feature. Just like above examples, there
will be a sample concepts file and a sample schema to demonstrate that case.
