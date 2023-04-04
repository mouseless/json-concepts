# Transformation

> TBD -> define all transformation specs

## Access Parent

Parent access should be available in all steps `from`, `where` and `select`.

## Allow Different Naming Conventions

SQL -> from, where, select
JS -> source, filter, map

## Automatic Selection

Selection is by default with the same key.

```json
{
    "function": {
        "from": "service",
        "select": {
            "_": "_",
            "returnType": "returnType"
        }
    }
}
```

is equivalent to

```json
{
    "function": {
        "from": "service",
        "select": { }
    }
}
```

is equivalent to

```json
{
    "function": {
        "from": "service"
    }
}
```

## Concept Name Reference

```json
{
    "function": {
        "from": "service",
        "select": {
            "_": "_ | pascalCase",
        }
    }
}
```

## Multiple Transformations

```json
{
    "function": [
    {
        "from": "service",
        "select": {
            "_": "_ | after 'say' | camelCase",
            "rootPath": "_",
            "returnType": "responseType | capitalize"
        }
    },
    {
        "from": "parameter",
        "select": {
            "_": "_",
            "type": "type | capitalize"
        }
    }
    ]
}
```

## Treat Arrays Like Concepts

> TBD -> Arrays require different queries, even if they are value arrays

## Wildcard For Target Concept Path

```json
{
    "function": {
        "from": "/**/service",
        "returnType": "responseType"
    },
    "argument": {
        "$from": "/*/parameter",
        "type": "type"
    }
}
```
