import type { UiDesign } from "../../shared/shared-state";

import win98StylesheetUrl from "../styles/themes/win98/index.css?url";
import winxpStylesheetUrl from "../styles/themes/winxp/index.css?url";
import win11StylesheetUrl from "../styles/themes/win11/index.css?url";

import win98AddressBookIcon from "../styles/themes/win98/icons/address_book-0.png";
import win98AddressBookUserIcon from "../styles/themes/win98/icons/address_book_user.png";
import win98AttachmentIcon from "../styles/themes/win98/icons/attachment.png";
import win98FileQuestionIcon from "../styles/themes/win98/icons/file_question.png";
import win98InfoIcon from "../styles/themes/win98/icons/info.png";
import win98KbFilesIcon from "../styles/themes/win98/icons/kb_files.png";
import win98KbMcpIcon from "../styles/themes/win98/icons/kb_mcp.png";
import win98MsAgentIcon from "../styles/themes/win98/icons/msagent.png";
import win98NetworkDriveOffIcon from "../styles/themes/win98/icons/network_drive_off.png";
import win98NetworkDriveOnIcon from "../styles/themes/win98/icons/network_drive_on.png";
import win98QuestionIcon from "../styles/themes/win98/icons/question.png";
import win98RecycleBinEmptyIcon from "../styles/themes/win98/icons/recycle_bin_empty.png";
import win98RecycleBinFullIcon from "../styles/themes/win98/icons/recycle_bin_full.png";
import win98SatelliteUpdatesOffIcon from "../styles/themes/win98/icons/satellite_updates_off.png";
import win98SatelliteUpdatesOnIcon from "../styles/themes/win98/icons/satellite_updates_on.png";
import win98SpeakerOffIcon from "../styles/themes/win98/icons/speaker_off.png";
import win98SpeakerOnIcon from "../styles/themes/win98/icons/speaker_on.png";

import winxpAddressBookIcon from "../styles/themes/winxp/icons/address_book-0.png";
import winxpAddressBookUserIcon from "../styles/themes/winxp/icons/address_book_user.png";
import winxpAttachmentIcon from "../styles/themes/winxp/icons/attachment.png";
import winxpFileQuestionIcon from "../styles/themes/winxp/icons/file_question.png";
import winxpInfoIcon from "../styles/themes/winxp/icons/info.png";
import winxpKbFilesIcon from "../styles/themes/winxp/icons/kb_files.png";
import winxpKbMcpIcon from "../styles/themes/winxp/icons/kb_mcp.png";
import winxpMsAgentIcon from "../styles/themes/winxp/icons/msagent.png";
import winxpNetworkDriveOffIcon from "../styles/themes/winxp/icons/network_drive_off.png";
import winxpNetworkDriveOnIcon from "../styles/themes/winxp/icons/network_drive_on.png";
import winxpQuestionIcon from "../styles/themes/winxp/icons/question.png";
import winxpRecycleBinEmptyIcon from "../styles/themes/winxp/icons/recycle_bin_empty.png";
import winxpRecycleBinFullIcon from "../styles/themes/winxp/icons/recycle_bin_full.png";
import winxpSatelliteUpdatesOffIcon from "../styles/themes/winxp/icons/satellite_updates_off.png";
import winxpSatelliteUpdatesOnIcon from "../styles/themes/winxp/icons/satellite_updates_on.png";
import winxpSpeakerOffIcon from "../styles/themes/winxp/icons/speaker_off.png";
import winxpSpeakerOnIcon from "../styles/themes/winxp/icons/speaker_on.png";

import win11AddressBookIcon from "../styles/themes/win11/icons/address_book-0.svg";
import win11AddressBookUserIcon from "../styles/themes/win11/icons/address_book_user.svg";
import win11AttachmentIcon from "../styles/themes/win11/icons/attachment.svg";
import win11FileQuestionIcon from "../styles/themes/win11/icons/file_question.svg";
import win11InfoIcon from "../styles/themes/win11/icons/info.svg";
import win11KbFilesIcon from "../styles/themes/win11/icons/kb_files.svg";
import win11KbMcpIcon from "../styles/themes/win11/icons/kb_mcp.svg";
import win11MsAgentIcon from "../styles/themes/win11/icons/msagent.svg";
import win11NetworkDriveOffIcon from "../styles/themes/win11/icons/network_drive_off.svg";
import win11NetworkDriveOnIcon from "../styles/themes/win11/icons/network_drive_on.svg";
import win11QuestionIcon from "../styles/themes/win11/icons/question.svg";
import win11RecycleBinEmptyIcon from "../styles/themes/win11/icons/recycle_bin_empty.svg";
import win11RecycleBinFullIcon from "../styles/themes/win11/icons/recycle_bin_full.svg";
import win11SatelliteUpdatesOffIcon from "../styles/themes/win11/icons/satellite_updates_off.svg";
import win11SatelliteUpdatesOnIcon from "../styles/themes/win11/icons/satellite_updates_on.svg";
import win11SpeakerOffIcon from "../styles/themes/win11/icons/speaker_off.svg";
import win11SpeakerOnIcon from "../styles/themes/win11/icons/speaker_on.svg";

export type ThemeIcons = {
  addressBook: string;
  addressBookUser: string;
  attachment: string;
  fileQuestion: string;
  info: string;
  kbFiles: string;
  kbMcp: string;
  msagent: string;
  networkDriveOff: string;
  networkDriveOn: string;
  question: string;
  recycleBinEmpty: string;
  recycleBinFull: string;
  satelliteUpdatesOff: string;
  satelliteUpdatesOn: string;
  speakerOff: string;
  speakerOn: string;
};

const THEME_STYLESHEET_LINK_ID = "office-buddies-theme";

const WIN98_ICONS: ThemeIcons = {
  addressBook: win98AddressBookIcon,
  addressBookUser: win98AddressBookUserIcon,
  attachment: win98AttachmentIcon,
  fileQuestion: win98FileQuestionIcon,
  info: win98InfoIcon,
  kbFiles: win98KbFilesIcon,
  kbMcp: win98KbMcpIcon,
  msagent: win98MsAgentIcon,
  networkDriveOff: win98NetworkDriveOffIcon,
  networkDriveOn: win98NetworkDriveOnIcon,
  question: win98QuestionIcon,
  recycleBinEmpty: win98RecycleBinEmptyIcon,
  recycleBinFull: win98RecycleBinFullIcon,
  satelliteUpdatesOff: win98SatelliteUpdatesOffIcon,
  satelliteUpdatesOn: win98SatelliteUpdatesOnIcon,
  speakerOff: win98SpeakerOffIcon,
  speakerOn: win98SpeakerOnIcon,
};

const WINXP_ICONS: ThemeIcons = {
  addressBook: winxpAddressBookIcon,
  addressBookUser: winxpAddressBookUserIcon,
  attachment: winxpAttachmentIcon,
  fileQuestion: winxpFileQuestionIcon,
  info: winxpInfoIcon,
  kbFiles: winxpKbFilesIcon,
  kbMcp: winxpKbMcpIcon,
  msagent: winxpMsAgentIcon,
  networkDriveOff: winxpNetworkDriveOffIcon,
  networkDriveOn: winxpNetworkDriveOnIcon,
  question: winxpQuestionIcon,
  recycleBinEmpty: winxpRecycleBinEmptyIcon,
  recycleBinFull: winxpRecycleBinFullIcon,
  satelliteUpdatesOff: winxpSatelliteUpdatesOffIcon,
  satelliteUpdatesOn: winxpSatelliteUpdatesOnIcon,
  speakerOff: winxpSpeakerOffIcon,
  speakerOn: winxpSpeakerOnIcon,
};

const WIN11_ICONS: ThemeIcons = {
  addressBook: win11AddressBookIcon,
  addressBookUser: win11AddressBookUserIcon,
  attachment: win11AttachmentIcon,
  fileQuestion: win11FileQuestionIcon,
  info: win11InfoIcon,
  kbFiles: win11KbFilesIcon,
  kbMcp: win11KbMcpIcon,
  msagent: win11MsAgentIcon,
  networkDriveOff: win11NetworkDriveOffIcon,
  networkDriveOn: win11NetworkDriveOnIcon,
  question: win11QuestionIcon,
  recycleBinEmpty: win11RecycleBinEmptyIcon,
  recycleBinFull: win11RecycleBinFullIcon,
  satelliteUpdatesOff: win11SatelliteUpdatesOffIcon,
  satelliteUpdatesOn: win11SatelliteUpdatesOnIcon,
  speakerOff: win11SpeakerOffIcon,
  speakerOn: win11SpeakerOnIcon,
};

const THEME_STYLESHEETS: Record<UiDesign, string> = {
  Win98: win98StylesheetUrl,
  WinXP: winxpStylesheetUrl,
  Win11: win11StylesheetUrl,
};

const THEME_ICONS: Record<UiDesign, ThemeIcons> = {
  Win98: WIN98_ICONS,
  WinXP: WINXP_ICONS,
  Win11: WIN11_ICONS,
};

export function getThemeStylesheetUrl(uiDesign: UiDesign): string {
  return THEME_STYLESHEETS[uiDesign] ?? THEME_STYLESHEETS.Win11;
}

export function applyThemeDocument(doc: Document, uiDesign: UiDesign) {
  if (!doc?.head) {
    return;
  }

  let link = doc.getElementById(
    THEME_STYLESHEET_LINK_ID,
  ) as HTMLLinkElement | null;

  if (!link) {
    link = doc.createElement("link");
    link.id = THEME_STYLESHEET_LINK_ID;
    link.rel = "stylesheet";
    doc.head.appendChild(link);
  }

  const href = getThemeStylesheetUrl(uiDesign);

  // The chat window clones parent stylesheets when it opens, which can leave
  // behind an older theme link after switching designs. Remove any duplicate
  // Office Buddies theme links so the controlled link below is authoritative.
  const knownThemeUrls = new Set(
    Object.values(THEME_STYLESHEETS).map((url) =>
      new URL(url, doc.baseURI).href,
    ),
  );

  doc.head.querySelectorAll('link[rel="stylesheet"]').forEach((candidate) => {
    if (!(candidate instanceof HTMLLinkElement) || candidate === link) {
      return;
    }

    if (knownThemeUrls.has(candidate.href)) {
      candidate.remove();
    }
  });

  if (link.dataset.uiDesign !== uiDesign || link.href !== href) {
    link.href = href;
    link.dataset.uiDesign = uiDesign;
  }
}

export function getThemeIcons(uiDesign: UiDesign): ThemeIcons {
  return THEME_ICONS[uiDesign] ?? THEME_ICONS.Win11;
}
