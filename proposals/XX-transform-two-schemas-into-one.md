# Transform Two Schemas Into One

> TBD - use case

## Example 1

Assume we have schema of api.concepts.json and a schema of
usability.concepts.json, and we need to transform them into
edit-page.concepts.json using a transformation.

## Example 2

You have a schema generated from reflection data. You want to generate a code
from that, but reflection data does not have enough information. You need
another data to use to generate. So again, three concepts, two schemas in, one
schema out.

`greeting.business.json` + `greeting.routing.json` -> `greeting.api.json`

## Example 3

Having both definition, and documentation in the same specification is hard to
maintain. With this feature, you can have;

`greeting.api.json` + `greeting.documentation.json` ->
`greeting.swagger.json`
