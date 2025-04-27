import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

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

let externalWindow: Window | null = null;
let containerDiv: HTMLDivElement | null = null;

export function WindowPortal({
  children,
  width = 400,
  height = 500,
  isOpen,
  onClose,
  title = 'Clippy Chat'
}: WindowPortalProps) {
  // This will run once on component init
  useEffect(() => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
    }

    // Create function for window management
    const showWindow = () => {
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
      }

      externalWindow.focus();
    };

    // Close window function
    const hideWindow = () => {
      if (externalWindow && !externalWindow.closed) {
        externalWindow.close();
        externalWindow = null;
      }
    };

    // Show/hide based on prop
    if (isOpen) {
      showWindow();
    } else {
      hideWindow();
    }

    // Cleanup only on component unmount, not on every render
    return () => {
      console.log("WindowPortal unmounting");
      if (externalWindow && !externalWindow.closed) {
        externalWindow.close();
        externalWindow = null;
      }
    };
  }, [isOpen, width, height, onClose]);

  // Don't render if window isn't visible
  if (!isOpen || !containerDiv) {
    return null;
  }

  // Render portal only when needed
  return ReactDOM.createPortal(children, containerDiv);
}
