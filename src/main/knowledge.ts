import { randomUUID } from "crypto";
import { app, dialog } from "electron";
import fs from "fs";
import path from "path";

import { KnowledgeFileSource, KnowledgeSource } from "../shared/shared-state";
import { getIntegrationManager } from "./integrations";
import { getLogger } from "./logger";

const KNOWLEDGE_FILE_FILTERS = [
  {
    name: "Knowledge Files",
    extensions: [
      "md",
      "txt",
      "pdf",
      "docx",
      "json",
      "csv",
      "ts",
      "tsx",
      "js",
      "jsx",
      "html",
      "css",
      "yaml",
      "yml",
    ],
  },
];

const TEXT_PREVIEW_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".json",
  ".csv",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".html",
  ".css",
  ".yaml",
  ".yml",
]);

const DOCUMENT_PREVIEW_EXTENSIONS = new Set([".docx", ".pdf"]);
const MAX_PREVIEW_CHARS = 4000;

export async function pickKnowledgeFiles(
  existingFiles: KnowledgeFileSource[] = [],
): Promise<KnowledgeFileSource[]> {
  try {
    const result = await dialog.showOpenDialog({
      title: "Select knowledge files",
      defaultPath: app.getPath("documents"),
      filters: KNOWLEDGE_FILE_FILTERS,
      properties: ["openFile", "multiSelections"],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return existingFiles;
    }

    const existingByPath = new Map(
      existingFiles.map((file) => [normalizeFilePath(file.filePath), file]),
    );

    for (const filePath of result.filePaths) {
      const normalizedPath = normalizeFilePath(filePath);
      const existing = existingByPath.get(normalizedPath);
      const source = await buildKnowledgeFileSource(filePath, existing?.id);
      existingByPath.set(normalizedPath, source);
    }

    return Array.from(existingByPath.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  } catch (error) {
    getLogger().error("Error picking knowledge files", error);
    return existingFiles;
  }
}

export async function refreshKnowledgeFiles(
  existingFiles: KnowledgeFileSource[] = [],
): Promise<KnowledgeFileSource[]> {
  const refreshedFiles: KnowledgeFileSource[] = [];

  for (const file of existingFiles) {
    try {
      const refreshedFile = await buildKnowledgeFileSource(
        file.filePath,
        file.id,
      );
      refreshedFiles.push(refreshedFile);
    } catch (error) {
      getLogger().warn(
        `Unable to refresh knowledge file ${file.filePath}`,
        error,
      );
      refreshedFiles.push(file);
    }
  }

  return refreshedFiles;
}

export async function getAvailableKnowledgeSources(): Promise<
  KnowledgeSource[]
> {
  const configuredSources =
    getIntegrationManager().getAvailableKnowledgeSources();

  return configuredSources.map((source) => ({
    ...source,
  }));
}

async function buildKnowledgeFileSource(
  filePath: string,
  existingId?: string,
): Promise<KnowledgeFileSource> {
  const fileName = path.basename(filePath);
  const stats = await fs.promises.stat(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const previewText = await readPreviewText(filePath, extension);

  return {
    id: existingId || `knowledge-file-${randomUUID()}`,
    name: fileName,
    meta: `Pinned from local files | ${formatFileSize(stats.size)}`,
    status: getKnowledgeFileStatus(extension, previewText),
    filePath,
    previewText,
  };
}

async function readPreviewText(
  filePath: string,
  extension: string,
): Promise<string | undefined> {
  try {
    if (TEXT_PREVIEW_EXTENSIONS.has(extension)) {
      return await readTextPreview(filePath);
    }

    if (extension === ".docx") {
      return await readDocxPreview(filePath);
    }

    if (extension === ".pdf") {
      return await readPdfPreview(filePath);
    }

    return undefined;
  } catch (error) {
    getLogger().warn(
      `Unable to read knowledge preview from ${filePath}`,
      error,
    );
    return undefined;
  }
}

async function readTextPreview(filePath: string): Promise<string | undefined> {
  const content = await fs.promises.readFile(filePath, "utf8");
  return normalizePreviewText(content);
}

async function readDocxPreview(filePath: string): Promise<string | undefined> {
  const mammoth = await loadMammoth();
  const result = await mammoth.extractRawText({ path: filePath });

  if (result.messages.length > 0) {
    getLogger().info("DOCX extraction messages", result.messages);
  }

  return normalizePreviewText(result.value);
}

async function readPdfPreview(filePath: string): Promise<string | undefined> {
  const { PDFParse } = await loadPdfParse();
  const buffer = await fs.promises.readFile(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return normalizePreviewText(result.text);
}

async function loadMammoth() {
  const mammothModule = await import("mammoth");
  return mammothModule.default;
}

async function loadPdfParse() {
  return import("pdf-parse");
}

function normalizePreviewText(content: string): string | undefined {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, MAX_PREVIEW_CHARS);
}

function getKnowledgeFileStatus(
  extension: string,
  previewText?: string,
): KnowledgeFileSource["status"] {
  if (
    TEXT_PREVIEW_EXTENSIONS.has(extension) ||
    DOCUMENT_PREVIEW_EXTENSIONS.has(extension)
  ) {
    return previewText ? "Indexed" : "Error";
  }

  return "Ready";
}

function normalizeFilePath(filePath: string): string {
  return path.normalize(filePath).toLowerCase();
}

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.round(sizeBytes / 1024)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}
