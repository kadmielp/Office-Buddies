import { TableView } from "./TableView";
import { Progress } from "./Progress";
import React, { useState, useEffect, useRef } from "react";
import { useSharedState } from "../contexts/SharedStateContext";
import { clippyApi } from "../clippyApi";
import { prettyDownloadSpeed } from "../helpers/convert-download-speed";
import { ManagedModel } from "../../models";
import { isModelDownloading } from "../../helpers/model-helpers";

export function SettingsModel() {
  const { models, settings } = useSharedState();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const columns = [
    { key: 'default', header: 'Loaded' },
    { key: 'name', header: 'Name' },
    { key: 'size', header: 'Size' },
    { key: 'company', header: 'Company' },
    { key: 'downloaded', header: 'Downloaded' },
  ];

  const modelKeys = Object.keys(models || {});
  const data = modelKeys.map(modelKey => {
    const model = models?.[modelKey as keyof typeof models];

    return {
      default: model?.name === settings.selectedModel ? 'ｘ' : '',
      name: model?.name,
      company: model?.company,
      size: `${model.size.toLocaleString()} MB`,
      downloaded: model.downloaded ? 'Yes' : 'No',
    }
  });

  // Variables
  const selectedModel = selectedIndex > -1 ? models?.[modelKeys[selectedIndex] as keyof typeof models] : null;
  const isDownloading = isModelDownloading(selectedModel);
  const isDefaultModel = selectedModel?.name === settings.selectedModel;

  // Start or stop the interval based on download state
  const startProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      clippyApi.updateModelState();
    }, 200);
  };

  const stopProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Check if any model is downloading
  const isAnyModelDownloading = Object.values(models || {}).some(isModelDownloading);

  // Initialize interval if any model is downloading when component mounts
  useEffect(() => {
    if (isAnyModelDownloading && !intervalRef.current) {
      startProgressInterval();
    } else if (!isAnyModelDownloading && intervalRef.current) {
      stopProgressInterval();
    }

    return () => stopProgressInterval();
  }, [isAnyModelDownloading]);

  // Handlers
  // ---------------------------------------------------------------------------
  const handleRowSelect = (row: Record<string, React.ReactNode>, index: number) => {
    setSelectedIndex(index);
  };

  const handleDownload = async () => {
    if (selectedModel) {
      startProgressInterval();
      await clippyApi.downloadModelByName(data[selectedIndex].name);
    }
  };

  const handleDelete = async () => {
    if (selectedModel) {
      await clippyApi.deleteModelByName(selectedModel.name);
      await clippyApi.updateModelState();
    }
  };

  const handleMakeDefault = async () => {
    if (selectedModel) {
      clippyApi.setState('settings.selectedModel', selectedModel.name);
    }
  };

  return (
    <div>
      <p>Select the model you want to use for your chat. The larger the model, the more powerful the chat, but the slower it will be - and the more memory it will use.</p>
      <TableView
        columns={columns}
        data={data}
        onRowSelect={handleRowSelect}
      />

      {selectedModel && (
        <div className="model-details sunken-panel" style={{ marginTop: '20px', padding: '15px' }}>
          <h3>{selectedModel.name}</h3>

          {selectedModel.description && (
            <p>{selectedModel.description}</p>
          )}

          {selectedModel.homepage && (
            <p>
              <a href={selectedModel.homepage} target="_blank" rel="noopener noreferrer">
                Visit Homepage
              </a>
            </p>
          )}

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            {!selectedModel.downloaded ? (
              <button
                disabled={isDownloading}
                onClick={handleDownload}
              >
                Download Model
              </button>
            ) : (
              <>
                <button
                  disabled={isDownloading || isDefaultModel}
                  onClick={handleMakeDefault}
                >
                  {isDefaultModel ? 'Clippy uses this model' : 'Make Clippy use this model'}
                </button>
                <button
                  onClick={handleDelete}
                >
                  Delete Model
                </button>
              </>
            )}
          </div>
          <SettingsModelDownload model={selectedModel} />
        </div>
      )}
    </div>
  );
}

const SettingsModelDownload: React.FC<{
  model?: ManagedModel;
}> = ({ model }) => {
  if (!model || !isModelDownloading(model)) {
    return null;
  }

  const downloadSpeed = prettyDownloadSpeed(model?.downloadState?.currentBytesPerSecond || 0);

  return (
    <div style={{ marginTop: '15px' }}>
      <p>Downloading {model.name}... ({downloadSpeed}/s)</p>
      <Progress progress={model.downloadState?.percentComplete || 0} />
    </div>
  )
};
