# Nested References

References can be used within other references. Below is an example;

`CONCEPTS 1: class.concepts.json`

```json
{
    "$class+": "#properties & #methods",
    "#properties": {
        "$property*": "$type"
    },
    "#methods": {
        "$method*": "#parameters & #return"
    },
    "#parameters": {
        "$parameter*": "$type"
    },
    "#return": {
        "returns": "$type"
    }
}
```

This is equivalent to following;

`CONCEPTS 2: class.concepts.json`

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

## Recursion

A reference is allowed to include itself to create a recursive definition. Below
is an example;

`CONCEPTS: tree.concepts.json`

```json
{
    "$root": "#node",
    "#node": {
        "$node*": "#node"
    }
}
```

Below is a valid schema for above concepts definition;

`SCHEMA: organization.tree.json`

```json
{
    "ceo": {
        "cfo": {
            "accountant": {
                "intern": null
            }
        },
        "cto": {
            "dba": null,
            "developer": null
        },
        "coo": {
            "representative": null
        }
    }
}
```

When a recursive definition exists, concepts shadow cannot express it without
using a reference. So in case of recursion, it makes use of the `reference`
keyword;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "name": "root",
        "concept": {
            "name": "node",
            "quantifier": { "min": 0 },
            "concept": { "reference": "node" }
        }
    }
}
```

## Indirect Recursion

When there is an indirect recursion like in the below example, shadow should use
'reference' keyword whenever a recursion occurs first;

`CONCEPTS: tree.concepts.json`

```json
{
    "$root": "#a",
    "#a": {
        "$a*": "#b"
    },
    "#b": {
        "$b*": "#a"
    }
}
```

In this case, `$a` can include `$b`, but `$b` must have a reference to `$a`;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "name": "root",
        "concept": {
            "name": "a",
            "quantifier": { "min": 0 },
            "concept": {
                "name": "b",
                "quantifier": { "min": 0 },
                "concept": { "reference": "a" }
            }
        }
    }
}
```
