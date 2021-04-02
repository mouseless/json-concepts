# Enums

```json
{
    "$service+": {
        "priority": "$priority:priority"
    },
    ":": {
        "priority": {
            "type": "string",
            "values": [ "default", "primary", "danger" ]
        }
    }
}
```

Shorthand for enums;

```json
{
    "$service+": {
        "priority": "$priority:priority"
    },
    ":": {
        "priority": [ "default", "primary", "danger" ]
    }
}
```
