export const IpcRendererMessages = {
  HIDE_WINDOW_BY_NAME: 'clippy_hide_window_by_name',
  SHOW_WINDOW_BY_NAME: 'clippy_show_window_by_name',
};

export type HideWindowByNameOptions = {
  windowName: string;
}

export type ShowWindowByNameOptions = {
  positionAsPopover?: boolean;
  windowName: string;
};
