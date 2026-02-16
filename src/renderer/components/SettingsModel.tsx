import { Column, TableView } from "./TableView";
import { Progress } from "./Progress";
import React, { useEffect, useState } from "react";
import { useSharedState } from "../contexts/SharedStateContext";
import { clippyApi } from "../clippyApi";
import { prettyDownloadSpeed } from "../helpers/convert-download-speed";
import { ManagedModel } from "../../models";
import { isModelDownloading } from "../../helpers/model-helpers";
import { AiProvider } from "../../sharedState";
import { fetchProviderModels } from "../ai-provider-client";
import { useChat } from "../contexts/ChatContext";
import localProviderIcon from "../images/icons/network_drive_off.png";
import remoteProviderIcon from "../images/icons/network_drive_on.png";

function filterRemoteModelsByProvider(
  provider: AiProvider,
  models: string[],
): string[] {
  if (provider !== "gemini") {
    return models;
  }

  return models.filter((modelName) => {
    const normalized = modelName.trim().toLowerCase();
    return normalized.startsWith("gemini") || normalized.startsWith("gemma");
  });
}

export const SettingsModel: React.FC = () => {
  const { models, settings } = useSharedState();
  const { setAnimationKey } = useChat();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectedProvider = settings.aiProvider || "local";
  const [remoteModelOptions, setRemoteModelOptions] = useState<string[]>([]);
  const [isLoadingRemoteModels, setIsLoadingRemoteModels] = useState(false);
  const [remoteModelsError, setRemoteModelsError] = useState<string>("");

  const columns: Array<Column> = [
    { key: "default", header: "Loaded", width: 50 },
    { key: "name", header: "Name" },
    {
      key: "size",
      header: "Size",
      render: (row) => `${row.size.toLocaleString()} MB`,
    },
    { key: "company", header: "Company" },
    { key: "downloaded", header: "Downloaded" },
  ];

  const modelKeys = Object.keys(models || {});
  const data = modelKeys.map((modelKey) => {
    const model = models?.[modelKey as keyof typeof models];

    return {
      default: model?.name === settings.selectedModel ? "ｘ" : "",
      name: model?.name,
      company: model?.company,
      size: model?.size,
      downloaded: model.downloaded ? "Yes" : "No",
    };
  });

  // Variables
  const selectedModel =
    models?.[modelKeys[selectedIndex] as keyof typeof models] || null;
  const isDownloading = isModelDownloading(selectedModel);
  const isDefaultModel = selectedModel?.name === settings.selectedModel;

  // Handlers
  // ---------------------------------------------------------------------------
  const handleRowSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleDownload = async () => {
    if (selectedModel) {
      await clippyApi.downloadModelByName(data[selectedIndex].name);
    }
  };

  const handleDeleteOrRemove = async () => {
    if (selectedModel?.imported) {
      await clippyApi.removeModelByName(selectedModel.name);
      setAnimationKey("");
      window.setTimeout(() => {
        setAnimationKey("EmptyTrash");
      }, 0);
    } else if (selectedModel) {
      const isDeleted = await clippyApi.deleteModelByName(selectedModel.name);
      if (isDeleted) {
        setAnimationKey("");
        window.setTimeout(() => {
          setAnimationKey("EmptyTrash");
        }, 0);
      }
    }
  };

  const handleMakeDefault = async () => {
    if (selectedModel) {
      clippyApi.setState("settings.selectedModel", selectedModel.name);
    }
  };

  const updateSetting = (key: string, value: string) => {
    clippyApi.setState(key, value);
  };

  useEffect(() => {
    if (selectedProvider === "local") {
      setRemoteModelOptions([]);
      setRemoteModelsError("");
      return;
    }

    const hasApiKey =
      (selectedProvider === "openai" && !!settings.openAiApiKey?.trim()) ||
      (selectedProvider === "gemini" && !!settings.geminiApiKey?.trim()) ||
      (selectedProvider === "maritaca" && !!settings.maritacaApiKey?.trim());

    if (!hasApiKey) {
      setRemoteModelOptions([]);
      setRemoteModelsError("");
      return;
    }

    let cancelled = false;

    const loadRemoteModels = async () => {
      setIsLoadingRemoteModels(true);
      setRemoteModelsError("");

      try {
        const list = await fetchProviderModels(selectedProvider, settings);
        const filteredList = filterRemoteModelsByProvider(selectedProvider, list);
        if (cancelled) {
          return;
        }

        setRemoteModelOptions(filteredList);

        if (
          filteredList.length > 0 &&
          !filteredList.includes(settings.remoteModel || "")
        ) {
          clippyApi.setState("settings.remoteModel", filteredList[0]);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setRemoteModelOptions([]);
        setRemoteModelsError(
          error instanceof Error ? error.message : String(error),
        );
      } finally {
        if (!cancelled) {
          setIsLoadingRemoteModels(false);
        }
      }
    };

    void loadRemoteModels();

    return () => {
      cancelled = true;
    };
  }, [
    selectedProvider,
    settings.openAiApiKey,
    settings.geminiApiKey,
    settings.maritacaApiKey,
    settings.remoteModel,
  ]);

  const handleRefreshRemoteModels = async () => {
    if (selectedProvider === "local") {
      return;
    }

    setIsLoadingRemoteModels(true);
    setRemoteModelsError("");

    try {
      const list = await fetchProviderModels(selectedProvider, settings);
      const filteredList = filterRemoteModelsByProvider(selectedProvider, list);
      setRemoteModelOptions(filteredList);

      if (
        filteredList.length > 0 &&
        !filteredList.includes(settings.remoteModel || "")
      ) {
        clippyApi.setState("settings.remoteModel", filteredList[0]);
      }
    } catch (error) {
      setRemoteModelOptions([]);
      setRemoteModelsError(
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setIsLoadingRemoteModels(false);
    }
  };

  return (
    <div>
      <fieldset style={{ marginBottom: "16px" }}>
        <legend>AI Provider</legend>
        <div className="field-row">
          <label htmlFor="aiProvider">Provider</label>
          <select
            id="aiProvider"
            value={selectedProvider}
            onChange={(e) =>
              clippyApi.setState("settings.aiProvider", e.target.value)
            }
          >
            <option value={"local" as AiProvider}>Local (GGUF)</option>
            <option value={"openai" as AiProvider}>OpenAI</option>
            <option value={"gemini" as AiProvider}>Google</option>
            <option value={"maritaca" as AiProvider}>Maritaca</option>
          </select>
          <img
            src={
              selectedProvider === "local" ? localProviderIcon : remoteProviderIcon
            }
            alt=""
            aria-hidden="true"
            style={{
              marginLeft: "auto",
              width: "32px",
              height: "32px",
            }}
          />
        </div>
        {selectedProvider !== "local" && (
          <>
            <div className="field-row">
              <label htmlFor="remoteModel">Model</label>
              <select
                id="remoteModel"
                value={settings.remoteModel || ""}
                onChange={(e) =>
                  updateSetting("settings.remoteModel", e.target.value)
                }
                disabled={remoteModelOptions.length === 0}
              >
                {remoteModelOptions.length === 0 ? (
                  <option value="">
                    {isLoadingRemoteModels
                      ? "Loading models..."
                      : "No models found. Add API key and refresh."}
                  </option>
                ) : (
                  remoteModelOptions.map((modelName) => (
                    <option key={modelName} value={modelName}>
                      {modelName}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="field-row">
              <label htmlFor="providerApiKey">API Key</label>
              <input
                id="providerApiKey"
                type="password"
                value={
                  selectedProvider === "openai"
                    ? settings.openAiApiKey || ""
                    : selectedProvider === "gemini"
                      ? settings.geminiApiKey || ""
                      : settings.maritacaApiKey || ""
                }
                onChange={(e) =>
                  updateSetting(
                    selectedProvider === "openai"
                      ? "settings.openAiApiKey"
                      : selectedProvider === "gemini"
                        ? "settings.geminiApiKey"
                        : "settings.maritacaApiKey",
                    e.target.value,
                  )
                }
              />
            </div>
            <div className="field-row">
              <button
                onClick={handleRefreshRemoteModels}
                disabled={isLoadingRemoteModels}
              >
                {isLoadingRemoteModels ? "Loading..." : "Refresh Models"}
              </button>
            </div>
            {remoteModelsError && (
              <p style={{ marginTop: "8px", marginBottom: 0 }}>
                Failed to load models: {remoteModelsError}
              </p>
            )}
          </>
        )}
      </fieldset>

      {selectedProvider === "local" ? (
        <p>
          Select the model you want to use for your chat. The larger the model,
          the more powerful the chat, but the slower it will be - and the more
          memory it will use. Office Buddies uses models in the GGUF format.{" "}
          <a
            href="https://github.com/felixrieseberg/clippy?tab=readme-ov-file#downloading-more-models"
            target="_blank"
          >
            More information.
          </a>
        </p>
      ) : (
        <p>
          Configure the remote model and API key for the selected provider. The
          chat will be sent to the configured provider instead of local GGUF
          models.
        </p>
      )}

      {selectedProvider === "local" ? (
        <>
          <button
            style={{ marginBottom: 10 }}
            onClick={() => clippyApi.addModelFromFile()}
          >
            Add model from file
          </button>
          <TableView
            columns={columns}
            data={data}
            onRowSelect={handleRowSelect}
            initialSelectedIndex={selectedIndex}
          />

          {selectedModel && (
            <div
              className="model-details sunken-panel"
              style={{ marginTop: "20px", padding: "15px" }}
            >
              <strong>{selectedModel.name}</strong>

              {selectedModel.description && <p>{selectedModel.description}</p>}

              {selectedModel.homepage && (
                <p>
                  <a
                    href={selectedModel.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Homepage
                  </a>
                </p>
              )}

              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                {!selectedModel.downloaded ? (
                  <button disabled={isDownloading} onClick={handleDownload}>
                    Download Model
                  </button>
                ) : (
                  <>
                    <button
                      disabled={isDownloading || isDefaultModel}
                      onClick={handleMakeDefault}
                    >
                      {isDefaultModel
                        ? "Office Buddies uses this model"
                        : "Make Office Buddies use this model"}
                    </button>
                    <button onClick={handleDeleteOrRemove}>
                      {selectedModel?.imported ? "Remove" : "Delete"} Model
                    </button>
                  </>
                )}
              </div>
              <SettingsModelDownload model={selectedModel} />
            </div>
          )}
        </>
      ) : (
        <div
          className="sunken-panel"
          style={{ marginTop: "12px", padding: 12 }}
        >
          Remote provider selected. Local GGUF model selection is disabled.
        </div>
      )}
    </div>
  );
};

const SettingsModelDownload: React.FC<{
  model?: ManagedModel;
}> = ({ model }) => {
  if (!model || !isModelDownloading(model)) {
    return null;
  }

  const downloadSpeed = prettyDownloadSpeed(
    model?.downloadState?.currentBytesPerSecond || 0,
  );

  return (
    <div style={{ marginTop: "15px" }}>
      <p>
        Downloading {model.name}... ({downloadSpeed}/s)
      </p>
      <Progress progress={model.downloadState?.percentComplete || 0} />
    </div>
  );
};
