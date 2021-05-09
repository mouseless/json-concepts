# Include

`#include` loads a concepts file from given path and replaces definitions inside
that file to the place where it was included. Below `parameter` concept is
included from an outer file;

`CONCEPTS 1: parameter.concepts.json`

```json
{
    "$parameter*": "$type"
}
```

`CONCEPTS 2: service.concepts.json`

```json
{
    "$service+": {
        "#include": "parameter.concepts.json"
    }
}
```

Here `service.concepts.json` is equivalent to below concepts definition;

`CONCEPTS 3: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type"
    }
}
```

## Processing Order

When a concepts definition is loaded, `#include`s are processed first. Then it
should process references of included definition, and it finally places processed
definition into where it was included. Below is an example;

`CONCEPTS 1: method.concepts.json`

```json
{
   "$method*": "#parameters & #return",
    "#parameters": {
        "$parameter*": "$type"
    },
    "#return": {
        "returns": "$type"
    }
}
```

`CONCEPTS 2: class.concepts.json`

```json
{
    "$class+": "#properties & #methods",
    "#properties": {
        "$property*": "$type"
    },
    "#methods": {
        "#include": "method.concepts.json"
    }
}
```

For this example, processing order is as follows;

- Load file `class.concepts.json`
- Look for `#include`s
  - Load file `method.concepts.json`
  - Look for `#include`s
  - Process references in `method.concepts.json`
  - Place processed definition of `method.concepts.json` where it was included
- Process references in `class.concepts.json`

So it becomes a concepts definition equivalent to the following;

`CONCEPTS 3: class.concepts.json`

```json
{
    "$class+": {
        "$property*": "$type",
        "$method*": {
            "$parameter*": "$type",
            "returns": "$type"
        }
    }
}
```

## Including a Remote File

You can also write a complete URL to include a concepts file. Below is an
example;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "#include": "https://json-concepts.github.io/samples/parameter.concepts.json"
    }
}
```
