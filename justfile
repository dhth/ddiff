default: run
alias r := run
alias b := build
alias p := preview
alias l := lint
alias f := format
alias fc := format-check

run:
    bun run dev

build:
    bun run build

preview:
    bun run preview

lint:
    bun run lint

format:
    bun run format

format-check:
    bun run format-check
