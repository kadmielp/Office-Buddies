import { ManagedModel } from "../models";

export function isModelDownloading(model?: ManagedModel) {
  return model && !!model.downloadState && model.downloadState.state !== 'completed';
}

