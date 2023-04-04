# Split Spec and Impl Tests

> TBD -> for node impl, spec tests should include only test cases from specs
> distribution. rest should be in unit tests.
>
> - Specs does not reflect all test cases, some of them are implied. Add those
> cases from not tests to spec mds, and refer to them using `from` function.
> - Refactor test cases so that they are sentences from spec files. e.g. instead
> of `It should merge multiple references` for a mocha test, use `References can
> be merged using '&'` directly from md file.
> - Then move rest of the tests to a separate folder like `unit` or `impl`.
