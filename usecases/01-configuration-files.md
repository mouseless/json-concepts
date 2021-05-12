# Configuration Files

You can define your configuration concepts using **json concepts**, and then you
can validate and load a configuration file using that definition.

Let's say your application is a web crawler that visits certain urls
periodically and log their contents to a database. An example concepts
definition for this application would be;

`CONCEPTS: config.concepts.json`

```json
{
    "!$environment*": {
        "$database:db": "$connection"
    },
    "$period*": [ "$urls" ],

    "@types": {
        "db": [ "postgresql", "mysql" ]
    }
}
```

This definition helps you to load a json file and validate it to have
environments with a database connection, and periods with list of urls.

`SCHEMA: my-app.config.json`

```json
{
    "development": {
        "mysql": "Server=dev.db;Database=my-app;Uid=...;Pwd=...;"
    },
    "production": {
        "postgresql": "Driver={PostgreSQL};Server=dev.db;Port=5432;Database=my-app;Uid=...;Pwd=...;"
    },
    "0 0 12 1/1 * ? *": [ "https://a.com", "https://b.com" ],
    "0 0 0/1 1/1 * ? *": [ "https://x.com", "https://y.com" ],

    "@concepts": "config.concepts.json"
}
```

This file is loaded along with its concepts definition. So its values can be
accessed through the concepts they belong;

```javascript
const config = jc.Schema.load("my-app.config.json").shadow;

connectDB(config.environment[process.env.NODE_ENV].database.connection);

config.period.forEach(p => process(p.period, p.urls));
```

Without a concepts definition, config file would include all concept names.
Below you can see that the same information requires a more complex json file
without **json concepts**;

```json
{
    "environment": {
        "development": {
            "database": {
                "name": "mysql",
                "connection": "Server=dev.db;Database=my-app;Uid=...;Pwd=...;"
            }
        },
        "production": {
            "database": {
                "name": "postgresql",
                "connection": "Driver={PostgreSQL};Server=dev.db;Port=5432;Database=my-app;Uid=...;Pwd=...;"
            }
        }
    },
    "period": [
        {
            "period": "0 0 12 1/1 * ? *",
            "urls": [ "https://a.com", "https://b.com" ]
        },
        {
            "period": "0 0 0/1 1/1 * ? *",
            "urls": [ "https://x.com", "https://y.com" ]
        }
    ]
}
```

On top of having a larger json file, validation of this file would be still
required, whereas **json concepts** always validates a json file before loading.
So it improves readability of your configuration file, and provides validation
out of the box.
