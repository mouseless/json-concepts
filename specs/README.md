# Introduction

This section includes all the specifications of **json concepts**. A file that
ends with `.concepts.json` is referred as a concepts definition throughout this
document. Below is an example of a concepts definition;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response": "$responseType"
    }
}
```

This definition represents a meta-schema that will validate a schema like below;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

## About Syntax

To keep its syntax short, **json concepts** makes a heavy use of special
characters. This is a design decision to have an expressive syntax, just like
regular expressions.

We ask two basic questions when choosing a special character;

1. Does it mean only one thing?
2. Is it familiar?

If the answer is yes to both questions, then that special character is a good
choice.

A special character is considered to be familiar either because it has the same
meaning in another well-known language or specification, or because its name or
shape makes sense in the context it is used.

Any special character that doesn't suit well to this approach is subject to a
change.

| Character | Meaning                           | Familiarity                                 | Status     |
| --------- | --------------------------------- | ------------------------------------------- | ---------- |
| $         | variable                          | variables in php, bash, powershell          | :+1:       |
| #         | macro                             | c, c++, c# preprocessor directives          | :+1:       |
| !         | force                             | css important                               | :+1:       |
| @         | meta-data                         | java annotations                            | :+1:       |
| ?         | zero or one                       | regex, ternary operator                     | :+1:       |
| +         | one or more                       | regex                                       | :+1:       |
| {,}       | quantifier                        | regex                                       | :+1:       |
| :         | type                              | specifying type in uml, swift or scala      | :+1:       |
| *         | zero or more & any                | regex & file path wildcard                  | :thinking: |
| **        | any child                         | file path wildcard                          | :+1:       |
| /         | path                              | file paths, urls                            | :+1:       |
| ..        | parent                            | file paths                                  | :+1:       |
| ...       | spread                            | javascript spread operator                  | :+1:       |
| \         | escape                            | escape character                            | :+1:       |
| &         | and                               | bitwise and                                 | :+1:       |
| \|        | or                                | bitwise or                                  | :+1:       |
| []        | set default key                   | javascript property accessor                | :thinking: |
| ()        | set default value & pluralization | function call & plain english, e.g. item(s) | :thinking: |
| ^         | from beginning                    | regex start                                 | :thinking: |
| -         | shift left                        | minus sign                                  | :thinking: |

## About Specifications

Every specification introduces a new feature of **json concepts**. Each spec is
written assuming that you have read the specs before that one. There will be one
or more cases to clearly define a feature. Just like above examples, there will
be a sample concepts definition and a sample schema to demonstrate a case.

`CONCEPTS: sample.concepts.json`

```json
{
    "$sample*": "$definition"
}
```

These concepts definitions are usually followed by a schema;

`SCHEMA: schema.sample.json`

```json
{
    "schema": "defined"
}
```

### Another Case

When there is more than one case, following cases will be in a different
heading.

If there is a need for an example code, it will be in `javascript`.

`CODE: sample.js`

```javascript
const schema = Schema.load('schema.sample.json', 'sample.concepts.json');

console.log(schema.definition);
```

When the case is an error case, expected error message will be specified like
this;

`ERROR: an expected error message`

This does not mean that such an error message is expected word by word. It is
rather a suggestion for a potential implementation.

## Final Word

Although **json concepts** is only a specification, there is a Node.js
implementation as well. This implementation serves as a proof of concept that
validates this specification.

Let's go!
