# Introduction

A software has many aspects with each of these aspects having their own
concepts. Assume that you develop a web based software in which there is a board
where people can post photos and view photos of others. This software will
likely to have;

- UI aspect: a UI app to post and browse photos
- API aspect: an API that handles photo posting and listing
- DevOps aspect: a CI mechanism to manage deployments

For every aspect of this software, there are different concepts. For example;

- From a UI aspect, there are routing concepts
- From an API aspect, there are endpoint concepts
- From a DevOps aspect, there are deployment concepts

**json concepts** can help you to define these concepts. Using your concept
definitions you can create and validate schemas for every aspect. These schemas
will have certain things in common, for example a routing schema may differ for
each environment. So environment is a concept for UI aspect as well. This means
transforming a schema from one aspect into another may also help you to organize
your source code.

For now this section includes a couple of use cases that represent the
motivation behind developing **json concepts**. As it finds more real life
usage, we will add more examples.

## Anatomy of a Use Case

Each use case follows below structure;

- Problem definition
- Short example of the problem
- A solution using **json concepts**
- A solution without **json concepts**
