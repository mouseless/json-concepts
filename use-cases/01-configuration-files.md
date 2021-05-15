# Configuration Files

Assume you have an application that requires a configuration file to run. You
need to create a schema for this file and write a code to read, validate and
parse this file according to the schema.

## Example Case

Let's say your application is a web crawler that visits certain urls
periodically and log their contents to a database.

## With Concepts

You can define configuration concepts and then you can validate and load a
configuration file using that definition. Below is the concepts definition;

`CONCEPTS: config.concepts.json`

```json
{
    "!$environment*": {
        "$database:db": "$connection"
    },
    "$period(s)[cron]*": [ "$urls" ],

    "@types": {
        "db": [ "postgresql", "mysql" ]
    }
}
```

Below is an example configuration file;

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
    "0 0 0/1 1/1 * ? *": [ "https://x.com", "https://y.com" ]
}
```

Let's load this `config` file using its concepts definition;

```javascript
const config = jc.Schema.load("my-app.config.json", "config.concepts.json").shadow;

connectDB(config.environment[process.env.NODE_ENV].database.connection);

config.periods.forEach(period => process(period.cron, period.urls));
```

## Without Concepts

Without a concepts definition, config file would include all concept names.
Below you can see that the same information requires a more complex json file
without **json concepts**;

`SCHEMA: my-app.config.json`

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
    "periods": [
        {
            "cron": "0 0 12 1/1 * ? *",
            "urls": [ "https://a.com", "https://b.com" ]
        },
        {
            "cron": "0 0 0/1 1/1 * ? *",
            "urls": [ "https://x.com", "https://y.com" ]
        }
    ]
}
```

On top of having a more complex json file, validation of this file would still
be required, whereas **json concepts** always validates a json file before
loading. So it improves readability of your configuration file, and provides
validation out of the box.
