# Nested References and Recursion

> TBD - define recursive concepts

`CONCEPTS: tree.concepts.json`

```json
{
    "$root": "#node",
    "#define": {
        "node": {
            "$node*": "#node"
        }
    }
}
```

`SCHEMA: organization.tree.json`

```json
{
    "ceo": {
        "cfo": {
            "accountant": null
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
