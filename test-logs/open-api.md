# Open API

`INPUT`

```json
{
    "openapi": "$spec-version:version",
    "info": {
        "version": "$version:version",
        "title": "$title",
        "license?": {
            "name": "$license-name",
            "url?": "$license-url:url"
        }
    },
    "servers?": [
        {}
    ],
    "@types": {
        "version": "^[0-9]+\\.[0-9]+(\\.[0-9]){0,1}$",
        "url": "http[s]?:\\/\\/.*"
    }
}
```

`OUTPUT`

`ERROR: Cannot read property 'validate' of null`

---

`INPUT`

```json
{
    "#schema": {
        "type?": "$schemaType:string",
        "format?": "$schemaFormat:string",
        "required?": [
            "$requiredFields"
        ],
        "properties?": {
            "$property*": "#schema"
        },
        "items?": {}
    }
}
```

---

`ERROR: Maximum call stack size exceeded`
