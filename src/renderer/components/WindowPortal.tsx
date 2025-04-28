import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { clippyApi } from '../clippyApi';
interface WindowPortalProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
}

// Singleton variables - moved outside component to persist across renders
let externalWindow: Window | null = null;
let containerDiv: HTMLDivElement | null = null;
let isInitialized = false;

export function WindowPortal({
  children,
  width = 400,
  height = 500,
  isOpen,
  onClose,
  title = 'Clippy Chat'
}: WindowPortalProps) {
  // Initialize the singleton container only once
  useEffect(() => {
    if (!isInitialized) {
      containerDiv = document.createElement('div');
      isInitialized = true;
    }

    // Create function for window management
    const showWindow = async () => {
      if (!externalWindow || externalWindow.closed) {
        const windowFeatures = `width=${width},height=${height},positionNextToParent`;
        externalWindow = window.open('', '', windowFeatures);

        if (!externalWindow) {
          console.error("Failed to open window - popup may be blocked");
          return;
        }

        // Setup window
        const externalDoc = externalWindow.document;
        externalDoc.title = title;

        // Add styles
        const style = externalDoc.createElement('style');
        style.textContent = ``;

        // Copy styles from parent window
        const parentStyles = Array.from(document.styleSheets);
        for (const sheet of parentStyles) {
          try {
            if (sheet.href) {
              // For external stylesheets
              const linkElem = externalDoc.createElement('link');
              linkElem.rel = 'stylesheet';
              linkElem.href = sheet.href;
              externalDoc.head.appendChild(linkElem);
            } else {
              // For internal stylesheets
              const rules = Array.from(sheet.cssRules || []);
              for (const rule of rules) {
                style.textContent += rule.cssText + '\n';
              }
            }
          } catch (e) {
            console.warn('Could not copy stylesheet', e);
          }
        }

        externalDoc.head.appendChild(style);

        // Setup close event
        externalWindow.addEventListener('beforeunload', () => {
          console.log("Window closed by user");
          if (onClose) {
            onClose();
          }
        });

        externalDoc.body.innerHTML = '';
        externalDoc.body.appendChild(containerDiv);
      } else {
        await clippyApi.toggleChatWindow();
      }

      externalWindow.focus();
    };

    // Close window function
    const hideWindow = async () => {
      // Don't destroy the window, just hide it
      if (externalWindow && !externalWindow.closed) {
        await clippyApi.toggleChatWindow();
      }
    };

    // Show/hide based on prop
    if (isOpen) {
      showWindow();
    } else {
      hideWindow();
    }

    // Cleanup only on app unmount, not component unmount
    return () => {
      // We don't close the window here anymore to maintain singleton
      // The window will be closed when the app is closed
    };
  }, [isOpen, width, height, onClose, title]);

  // Always render to the portal if it exists, regardless of visibility
  if (!containerDiv) {
    return null;
  }

  return ReactDOM.createPortal(children, containerDiv)
}
