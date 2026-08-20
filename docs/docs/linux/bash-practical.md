---
title: Practical Bash
description: 'Safe Bash composition with quoting, globbing, redirection, pipelines, exit status, command substitution, xargs, and script guardrails.'
sidebar_position: 2
keywords:
  - bash
  - shell scripting
  - redirection
  - pipelines
  - quoting
  - exit status
---

Bash is most useful when commands remain small and their inputs, outputs, and failure behaviour are explicit. The shell
performs parsing and expansion before a command receives its arguments, so many apparent command failures are actually
quoting or expansion mistakes.

## Quoting and expansion

~~~bash
name="Ada Lovelace"
printf '%s\n' "$name"
~~~

Double quotes allow parameter and command expansion while preserving the result as one argument. Single quotes preserve
literal text. Unquoted expansions can undergo word splitting and pathname expansion; quote variables unless you
deliberately need those behaviours.

Globs are expanded by the shell:

| Pattern | Meaning |
| --- | --- |
| <code>*</code> | Zero or more characters |
| <code>?</code> | Exactly one character |
| <code>[abc]</code> | One character from the set |
| <code>[!abc]</code> | One character outside the set |

Check how no-match behaviour should work in scripts; it varies with shell options.

## Standard streams and redirection

Processes normally receive standard input on descriptor 0 and write standard output and standard error on descriptors 1
and 2.

~~~bash
command >output.log
command >>output.log
command 2>errors.log
command >combined.log 2>&1
command </path/to/input
~~~

Redirections are processed left to right. In <code>2>&1 >file</code>, standard error keeps pointing to the original
standard output; this differs from <code>>file 2>&1</code>.

## Pipelines

~~~bash
journalctl -u example.service | grep -F 'timeout' | wc -l
~~~

A pipeline connects the standard output of one process to the standard input of the next. By default, Bash reports the
exit status of the final command. In scripts where failure anywhere matters, enable <code>set -o pipefail</code> and
handle expected non-zero statuses deliberately.

Avoid parsing human-oriented output when a command offers structured, null-delimited, or machine-readable output.

## Exit status and conditional execution

Exit status 0 means success by convention; non-zero values represent different failure conditions.

~~~bash
if command; then
  printf '%s\n' 'succeeded'
else
  printf '%s\n' 'failed' >&2
fi

prepare && deploy
health_check || rollback
~~~

Use <code>&&</code> and <code>||</code> for short, clear conditions. Use an <code>if</code> statement when error handling
or precedence would otherwise be ambiguous.

## Command and process substitution

~~~bash
kernel_version="$(uname -r)"
diff <(sort expected.txt) <(sort actual.txt)
~~~

Command substitution captures standard output and removes trailing newlines. Quote the result. Process substitution gives
a command a file-like path backed by a pipe and is a Bash feature rather than portable POSIX shell syntax.

## Safe argument construction

Use arrays when building a command dynamically so each value remains one argument:

~~~bash
args=(--format json)
args+=(--output "$destination")
~~~

Do not construct a shell command by concatenating untrusted strings and passing it to <code>eval</code>.

Use the end-of-options marker when a filename could begin with a dash:

~~~bash
rm -- "$filename"
~~~

For filenames from <code>find</code>, prefer direct execution or null delimiters:

~~~bash
find . -type f -name '*.log' -exec gzip -- {} +
find . -type f -print0 | xargs -0 tool
~~~

## Script baseline

~~~bash
#!/usr/bin/env bash
set -Eeuo pipefail

main() {
  local input=$1
  process "$input"
}

main "$@"
~~~

Strict options catch many mistakes but are not a substitute for error design. <code>set -e</code> has contextual rules;
test scripts and explicitly handle commands whose non-zero status is expected. Use <code>shellcheck</code> and a formatter
in the delivery pipeline.

## Operational connection

Shell scripts are excellent for orchestration around reliable commands. Move complex data transformation, concurrency,
or long-lived business logic into a language with clearer types, tests, and error handling. Connect scripts to
[Linux observability](/linux/observability/), [package management](/linux/package-manager/), and
[AWS CI/CD](/aws/development/cicd/).

## References

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [ShellCheck](https://www.shellcheck.net/)
