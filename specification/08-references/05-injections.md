# Injections

`#inject` is used to get a concepts definition and inject it at a path specified
in `@path` meta-data. In below definition, `return` literal is defined
separately and injected under `$property` concept;

`CONCEPTS 1: class.concepts.json`

```json
{
    "$class+": { 
        "$property*": { }
    },
    "#inject": {
        "return": "$returnType",
        "@path": "/$class/$property"
    }
}
```

This is equivalent to below definition;

`CONCEPTS 2: class.concepts.json`

```json
{
    "$class+": { 
        "$property*": {
            "return": "$returnType"
        }
    }
}
```

## Multiple Paths

It can inject a definition to multiple paths. Below example injects `return`
literal to both `$property` and `$method` concepts;

`CONCEPTS 1: class.concepts.json`

```json
{
    "$class+": { 
        "$property*": { },
        "$method*": { }
    },
    "#inject": {
        "return": "$returnType",
        "@path": [ "/$class/$property", "/$class/$method" ]
    }
}
```

This is equivalent to below definition;

`CONCEPTS 2: class.concepts.json`

```json
{
    "$class+": { 
        "$property*": {
            "return": "$returnType"
        },
        "$method*": {
            "return": "$returnType"
        }
    }
}
```

## Wildcard Support

`@path` supports wildcard characters `*` and `**`. `*` means "any node" for one
level, `**` means "any node" for every level.

`CONCEPTS: class.concepts.json`

```json
{
    "$class+": { 
        "$property*": { },
        "$method*": { }
    },
    "#inject": {
        "return": "$returnType",
        "@path": [ "/*/$property", "/**/$method" ]
    }
}
```

## No Path

When an injection does not have a `@path` meta-data, it means its definition is
going to be injected at the root. Below is an example;

`CONCEPTS 1: class.concepts.json`

```json
{
    "#inject": {
        "$class+": { }
    }
}
```

This is equivalent to the following;

`CONCEPTS 2: class.concepts.json`

```json
{
    "$class+": { }
}
```

## Multiple Injections

`#inject` can have an array of definitions.

`CONCEPTS 1: class.concepts.json`

```json
{
    "#inject": [
        {
            "$class+": { }
        },
        {
            "$property+": { },
            "@path": "/**/$class",
        },
        {
            "$method+": { },
            "@path": "/**/$class",
        },
        {
            "returns": "$returnType",
            "@path": [ "/**/$method", "/**/$property" ],
        },
        {
            "$parameter*": "$type",
            "@path": "/**/$method"
        }
    ]
}
```

Above definition is equivalent to this;

`CONCEPTS 2: class.concepts.json`

```json
{
    "$class+": {
        "$property+": { 
            "returns": "$returnType"
        },
        "$method+": { 
            "$parameter*": "$type",
            "returns": "$returnType"
        }
    }
}
```

## Order of Injections

The order of injections matters, they are processed in the order they appear.
Below definition will only have `$class` concept after being processed.

`CONCEPTS 1: class.concepts.json`

```json
{
    "#inject": [
        {
            "$parameter*": "$type",
            "@path": "/**/$method"
        },
        {
            "returns": "$returnType",
            "@path": [ "/**/$method", "/**/$property" ],
        },
        {
            "$method+": { },
            "@path": "/**/$class",
        },
        {
            "$property+": { },
            "@path": "/**/$class",
        },
        {
            "$class+": { }
        }
    ]
}
```

This is equivalent to the following;

`CONCEPTS 2: class.concepts.json`

```json
{
    "$class+": { }
}
```

## Process Order of Injections, References and Include

Just like included concepts definitions, an injected definition can also have
its own references.

`CONCEPTS 1: dto.concepts.json`

```json
{
    "$class+": "#properties",
    "#properties": {
        "$property+": { }
    }
}
```

`CONCEPTS 2: behavior.concepts.json`

```json
{
    "#include": "dto.concepts.json",
    "#inject": [
        {
            "$method+": "#parameters",
            "#parameters": {
                "$parameter*": "$type"
            },
            "@path": "/**/$class",
        },
        {
            "returns": "$returnType",
            "@path": [ "/**/$method", "/**/$property" ],
        }
    ]
}
```

For this example, process order of `behavior.concepts.json` is as follows;

1. Process `#include`s of `behavior.concepts.json`;
   1. Process `#include`s of `dto.concepts.json`
   2. Process `#` references at the root of `dto.concepts.json`
      1. Process `#properties` reference
   3. Process `#inject`s of `dto.concepts.json`
2. Process `#` references at the root of `behavior.concepts.json`
3. Process `#inject`s of `behavior.concepts.json`
   1. Process `#` references of first `#inject`
      1. Process `#parameters` reference
   2. Place first `#inject` to paths matching `/**/$class`
   3. Process `#` references of second `#inject`
   4. Place second `#inject` to paths matching `/**/$method` or `/**/$property`

Therefore `behavior.concepts.json` is equivalent to below definition;

`CONCEPTS 3: class.concepts.json`

```json
{
    "$class+": {
        "$property+": { 
            "returns": "$returnType"
        },
        "$method+": { 
            "$parameter*": "$type",
            "returns": "$returnType"
        }
    }
}
```
