# Knowledge Tutorial: Files, Knowledge Sources, and Integrations

This guide shows how knowledge is organized in Office Buddies:

- `Files`: local notes, docs, PDFs, and source files
- `Knowledge Sources`: read-only connected sources attached to the current session
- `Integrations`: the connection layer that discovers those knowledge sources

Today, `MCP`, `Confluence`, and `Notion` are available integration types. The UI is still
structured so additional native connectors can plug into the same knowledge
source flow later.

For attached Confluence sources, Office Buddies now tries to search and fetch
matching page content at question time.

For attached Notion sources, Office Buddies searches the pages shared with your
integration and fetches page markdown at question time.

## Where to find it

1. Open the app.
2. Open the chat window settings.
3. Go to `Settings > Knowledge`.

You should see three panels:

- `Files`
- `Knowledge Sources`
- `Integrations`

## Activate knowledge usage first

Before adding references, enable knowledge for the session:

1. In `Settings > Knowledge`, find `Have the model use the knowledge base.`.
2. Turn it on.
3. Keep it enabled while testing Files and connected sources.

If this toggle is off, attached files and knowledge sources may be present but
not used by the model at chat start.

## Part 1: Add knowledge via files

Use this when you want the model to reference local documents directly.

1. In `Settings > Knowledge`, keep `Have the model use the knowledge base.` enabled.
2. In the `Files` panel, click `Add Files`.
3. Select one or more files.
4. Confirm that the files appear in the list with a status badge.

Notes:

- DOCX and PDF files may refresh shortly after being added so preview text can be prepared.
- Use `Remove` on an item to delete one reference.
- Use `Clear Files` to remove all local references.

## Part 2: Configure an integration

Use this when the knowledge lives in a connected system instead of a local file.

1. In the `Integrations` panel, click `+ Add Integration`.
2. Fill:
   - `Name`
   - `Connector`
   - For `MCP`:
     - `Transport` (`HTTP` or `stdio`)
     - `Endpoint` (for `HTTP`) or `Command` (for `stdio`)
     - `Credential` (optional)
   - For `Confluence`:
     - `Base URL`
     - `Email`
     - `API token`
   - For `Notion`:
     - `API token`
3. Click `Save Integration`.

You should then see the integration in `Configured Integrations`.

## Part 3: Attach knowledge sources from an integration

1. Click `Browse Sources`.
2. Wait for `Available Knowledge Sources` to load.
3. Select a source from the `Source` dropdown.
4. Click `Add Source`.
5. Confirm it appears in the `Knowledge Sources` list with a status badge.

Notes:

- Saving an integration does not automatically attach it to the session.
- `Delete Integration` removes the connection and detaches any knowledge sources that came from it.
- `Remove` on a knowledge source detaches only that source from the session.

## Recommended usage pattern

- Put static context in `Files` (briefs, exported notes, reference docs).
- Put changing context in `Knowledge Sources` (workspace docs, trackers, live systems).
- Use `Integrations` as the reusable connection layer behind those sources.

## Quick troubleshooting

- `Browse Sources` shows no sources:
  - verify the integration endpoint or command and credentials
  - save the integration again and retry
- A source cannot be added:
  - ensure a source is selected in the dropdown
  - ensure it is not already attached
- File context seems ignored:
  - verify `Have the model use the knowledge base.` is enabled
  - remove unrelated files to keep context focused
