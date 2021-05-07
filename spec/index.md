# Introduction

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

## About Syntax

To keep its syntax short, JSON Concepts makes a heavy use of special
characters. This is a design decision to make the syntax expressive, just like
regular expressions.

For readability there are two basic rules about usage of special characters;

1. They should mean only one thing
2. The meaning should be familiar for an acceptable reason
   1. It may have the same meaning in another language or standard
   2. Name or shape of the symbol makes sense

Any special character usage that doesn't suit above rules should be taken into
reconsideration.

| Character | Meaning | Familiarity |
| - | - | - |
| $ | variable | variables in php, bash, powershell |
| # | macro | c macros, c# preprocessors |
| : | type | uml, swift, scala |
| @ | meta-data | java annotations |
| ? | zero or one | regex, if-else, null propagation |
| + | one or more | regex |
| * | zero or more, any | regex, wildcard |
| {,} | quantifier | regex |
| / | path | urls |
| .. | parent | file paths |
| ** | any child | file path wildcard |
| \ | escape | regular escape character |
| _ | self or current | ?? |
| & | and | bitwise and |
| \| | or | bitwise or |
