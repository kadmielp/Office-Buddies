import { execFile } from "child_process";

const FOREGROUND_PROCESS_SCRIPT = `Add-Type -Namespace OfficeBuddies -Name Foreground -MemberDefinition '[DllImport("user32.dll")] public static extern System.IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(System.IntPtr hWnd, out uint processId);'
$processId = 0
[void][OfficeBuddies.Foreground]::GetWindowThreadProcessId([OfficeBuddies.Foreground]::GetForegroundWindow(), [ref]$processId)
(Get-Process -Id $processId).ProcessName`;

/**
 * Returns the lowercase process name of the window in front (for example
 * "claude" or "code"), or null when it can't be determined.
 */
export function getForegroundProcessName(): Promise<string | null> {
  if (process.platform !== "win32") {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", FOREGROUND_PROCESS_SCRIPT],
      { windowsHide: true, timeout: 5000 },
      (error, stdout) => {
        const name = stdout?.trim().toLowerCase();
        resolve(error || !name ? null : name);
      },
    );
  });
}
