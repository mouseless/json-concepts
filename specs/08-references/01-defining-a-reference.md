# Defining A Reference

A key with a `#` prefix at the root of the file means that it is a definition of
a reusable reference. When it is encountered in value side, it means that
reference is being used. Below is an example.

`CONCEPTS: class-1.concepts.json`

```json name="class-1.concepts.json"
{
    "$class+": "#properties",
    "#properties": {
        "$property*": "$type"
    }
}
```

Above there is a `#properties` reference in which `$property` concept is
defined and it is used under `$class` concept. This definition is equivalent to
below definition;

`CONCEPTS: class-2.concepts.json`

```json name="class-2.concepts.json"
{
    "$class+": {
        "$property*": "$type"
    }
}
```

References does not have an effect in concepts shadow and schema validation, so
`class-1.concepts.json` has exactly the same shadow and schema validation
behavior with `class-2.concepts.json`.

## References Can Only Be Defined at the Root

Below is an invalid definition because `#method` is defined under `$class`
concept instead of being defined at the root;

`CONCEPTS: class.concepts.json`

```json name="root/class.concepts.json"
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
