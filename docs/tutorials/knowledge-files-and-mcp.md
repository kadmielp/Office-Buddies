# Knowledge Tutorial: Files and MCP

This guide shows how to add knowledge to Office Buddies in two ways:

- local files (notes, docs, PDFs)
- MCP resources (live workspace context from connected servers)

## Where to find it

1. Open the app.
2. Open the chat window settings.
3. Go to `Settings > Knowledge`.

You should see two panels:

- `Files`
- `MCP`

## Activate knowledge usage first

Before adding references, enable knowledge for the session:

1. In `Settings > Knowledge`, find `Have the model use the knowledge base.`.
2. Turn it on.
3. Keep it enabled while testing Files and MCP sources.

If this toggle is off, attached files and MCP resources may be present but not used by the model at chat start.

## Part 1: Add knowledge via files

Use this when you want the model to reference local documents.

1. In `Settings > Knowledge`, keep `Have the model use the knowledge base.` enabled.
2. In the `Files` panel, click `Add Files`.
3. Select one or more files.
4. Confirm that the files appear in the list with a status badge.

Notes:

- DOCX and PDF files may refresh shortly after being added so preview text can be prepared.
- Use `Remove` on an item to delete one reference.
- Use `Clear Files` to remove all local references.

## Part 2: Add knowledge via MCP

Use this for live resources like issue trackers, docs systems, or database-backed sources.

### A. Add an MCP server (optional, if you do not already have one)

1. In the `MCP` panel, click `+ Add MCP Server`.
2. Fill:
   - `Name`
   - `Type` (`HTTP` or `stdio`)
   - `Endpoint` (for `HTTP`) or `Command` (for `stdio`)
   - `Credential` (optional)
3. Click `Save Server`.

You should then see the server in `Configured MCP Servers`.

### B. Attach MCP resources to knowledge

1. Click `Browse MCP`.
2. Wait for `Available MCP Sources` to load.
3. Select a source from the `Source` dropdown.
4. Click `Add Resource`.
5. Confirm it appears in the MCP knowledge list with a status badge.

Notes:

- `Delete Server` removes the configured server.
- `Remove` on a knowledge source detaches only that source from the session knowledge list.

## Recommended usage pattern

- Put static context in `Files` (briefs, reference docs, exported notes).
- Put changing context in `MCP` (live systems you update frequently).
- Keep only relevant sources attached to reduce noise in responses.

## Quick troubleshooting

- `Browse MCP` shows no sources:
  - verify server endpoint/command and credentials
  - save server again and retry `Browse MCP`
- Resource cannot be added:
  - ensure the source is selected in dropdown
  - ensure it is not already attached
- File context seems ignored:
  - verify `Have the model use the knowledge base.` is enabled
  - remove unrelated files to keep context focused
