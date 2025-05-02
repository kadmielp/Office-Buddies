// Show alert when download links are clicked
document.addEventListener("DOMContentLoaded", () => {
  const downloadButtons = document.querySelectorAll(
    ".downloads .window-body button",
  );

  downloadButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Prevent default action
      e.preventDefault();

      // Alert user that downloads are coming soon
      alert("Downloads coming soon!");
    });
  });

  // Make windows draggable using delta movement with fixed positioning
  const windows = document.querySelectorAll(".window");

  windows.forEach((window) => {
    const titleBar = window.querySelector(".title-bar");
    let isDragging = false;

    // Variables to track mouse movement
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Handle mousedown on the title bar
    titleBar.addEventListener("mousedown", (e) => {
      isDragging = true;

      // Record initial mouse position
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      // Get current position from fixed positioning before making any changes
      const rect = window.getBoundingClientRect();

      // Remove any transforms which could interfere with dragging
      if (window.style.transform) {
        window.style.transform = "none";
        window.style.left = `${rect.left}px`;
        window.style.top = `${rect.top}px`;
      }

      // Ensure window is fixed positioned
      window.style.position = "fixed";

      // Bring window to front
      window.style.zIndex = 1000;

      // Prevent text selection and default behaviors
      e.preventDefault();
    });

    // Handle mouse movement
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      // Calculate how far the mouse has moved since last position
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;

      // Update last known mouse position
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      // Get current window position
      const currentLeft =
        parseInt(window.style.left) || window.getBoundingClientRect().left;
      const currentTop =
        parseInt(window.style.top) || window.getBoundingClientRect().top;

      // Move window by the delta amount
      window.style.left = `${currentLeft + deltaX}px`;
      window.style.top = `${currentTop + deltaY}px`;
    });

    // Handle mouseup to stop dragging
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Add event listeners for window control buttons
    const minimizeButton = titleBar.querySelector(
      'button[aria-label="Minimize"]',
    );
    const maximizeButton = titleBar.querySelector(
      'button[aria-label="Maximize"]',
    );
    const closeButton = titleBar.querySelector('button[aria-label="Close"]');

    // Store original dimensions for restore after minimize/maximize
    let originalDimensions = null;
    let isMaximized = false;
    let isMinimized = false;

    // Minimize button functionality
    minimizeButton.addEventListener("click", () => {
      if (isMinimized) {
        // If already minimized, restore
        isMinimized = false;
        window.style.height = "";
        const windowBody = window.querySelector(".window-body");
        if (windowBody) {
          windowBody.style.display = "";
        }
      } else {
        // Minimize the window
        isMinimized = true;
        isMaximized = false;
        const windowBody = window.querySelector(".window-body");
        if (windowBody) {
          windowBody.style.display = "none";
        }
        window.style.height = "auto";
      }
    });

    // Maximize button functionality
    maximizeButton.addEventListener("click", () => {
      if (isMaximized) {
        // Restore to original size
        isMaximized = false;
        if (originalDimensions) {
          window.style.width = originalDimensions.width;
          window.style.height = originalDimensions.height;
          window.style.top = originalDimensions.top;
          window.style.left = originalDimensions.left;
        }
      } else {
        // Save original dimensions
        originalDimensions = {
          width: window.style.width,
          height: window.style.height,
          top: window.style.top,
          left: window.style.left,
        };

        // Maximize the window
        isMaximized = true;
        isMinimized = false;

        window.style.width = "100%";
        window.style.height = "90vh";
        window.style.top = "5vh";
        window.style.left = "0";
      }
    });

    // Close button functionality
    closeButton.addEventListener("click", () => {
      window.style.display = "none";
    });
  });
});
