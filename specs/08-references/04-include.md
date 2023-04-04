# Include

`#include` loads a concepts file from given path and replaces definitions inside
that file to the place where it was included. Below, `$parameter` concept is
included from another file;

`CONCEPTS: parameter.concepts.json`

```json name="parameter.concepts.json"
{
    "$parameter*": "$type"
}
```

`CONCEPTS: service-1.concepts.json`

```json name="service-1.concepts.json"
{
    "$service+": {
        "#include": "parameter.concepts.json"
    }
}
```

Here `service-1.concepts.json` is equivalent to below concepts definition;

`CONCEPTS: service-2.concepts.json`

```json name="service-2.concepts.json"
{
    "$service+": {
        "$parameter*": "$type"
    }
}
```

## Processing Order

When a concepts definition is loaded, first `#include`s are processed. Then it
should process references of included definition, and it finally places
processed definition into where it was included. Below is an example;

`CONCEPTS: method.concepts.json`

```json name="order/method.concepts.json"
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

`CONCEPTS: class-1.concepts.json`

```json name="order/class-1.concepts.json"
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

- Load file `class-1.concepts.json`
- Look for `#include`s
  - Load file `method.concepts.json`
  - Look for `#include`s
    - None found
  - Process references in `method.concepts.json`
  - Place processed definition of `method.concepts.json` where it was included
- Process references in `class-1.concepts.json`

So it becomes a concepts definition equivalent to the following;

`CONCEPTS: class-2.concepts.json`

```json name="order/class-2.concepts.json"
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

```json name="remote/service.concepts.json"
{
    "$service+": {
        "#include": "https://my-concepts.com/parameter.concepts.json"
    }
}
```
