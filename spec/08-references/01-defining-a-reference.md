# Defining A Reference

A key with a `#` prefix at the root of the file means that it is a definition of
a reusable reference. When it is encountered in value side, it means that
reference is being used. Below is an example.

`CONCEPTS 1: class.concepts.json`

```json
{
    "$class+": "#properties",
    "#properties": {
        "$property*": "$type"
    }
}
```

Above there is a `#properties` reference in which `property` concept is defined.
This reference is used right under `class` concept. So this definition is
equivalent to below definition;

`CONCEPTS 2: class.concepts.json`

```json
{
    "$class+": {
        "$property*": "$type"
    }
}
```

References does not have an effect in concepts shadow and schema validation,
they are exactly the same as definition in `CONCEPTS 2`.

## References Can Only Be Defined at the Root

Below is an invalid definition because `#method` is defined under `class`
concept instead of being defined at the root;

`CONCEPTS: class.concepts.json`

```json
{
    "$class+": {
        "$method*": "#method",
        "#method": {
            "$parameter*": "$type",
            "returns": "$type"
        }
    }
}
```

`ERROR: 'class.concepts.json' is not valid, '#method' should be defined at the`
`root.`
