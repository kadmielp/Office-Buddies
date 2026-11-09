// buddy-hands: Office Buddies' native "hands" helper (spike).
// Reads an app's UI Automation tree as a numbered, label-based list and acts on it by label.
// Built with the C# 5 compiler that ships with .NET Framework 4 (no SDK needed): see build.cmd.
//
//   buddy-hands see [app]                         numbered controls + visible text of the app's window
//   buddy-hands click <label|[id]> [double|right]  UIA pattern first (works without focus), mouse fallback
//   buddy-hands type <field|[id]> "<text>" [submit|append]
//   buddy-hands press "ctrl+s" [app]
//   buddy-hands windows                          top-level windows
//   buddy-hands --serve                          JSON lines: ["click","Save"] in -> {"ok":..} out
//
// Every action re-reads the window and reports whether it changed. Secrets are masked here, so raw
// password values never leave the helper. Risky labels are refused unless the caller passes --allow-risky
// (the app's gate passes it only after the user's Allow).
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows;
using System.Windows.Automation;

namespace OfficeBuddies.Hands
{
    class Node
    {
        public int id;
        public string role;
        public string label;
        public string value;
        public int[] rect; // x, y, w, h (screen pixels)
        public bool secret;
        public bool risky;
        public bool enabled;
        public string automationId;
        [ScriptIgnore] public AutomationElement element;
    }

    class Map
    {
        public int pid;
        public string app;
        public string window;
        public long hwnd;
        public List<Node> nodes = new List<Node>();
        public List<string> texts = new List<string>();
        public string focused = "";
        public long ms;
        // The first web/document area and how many visible items sit inside it (Chromium wakes up lazily).
        [ScriptIgnore] public Rect page = Rect.Empty;
        [ScriptIgnore] public int pageItems;

        public string Digest()
        {
            var sb = new StringBuilder(window);
            foreach (var n in nodes) sb.Append('|').Append(n.role).Append(':').Append(n.label).Append('=').Append(n.value);
            foreach (var t in texts) sb.Append('|').Append(t);
            using (var sha = SHA1.Create())
                return Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(sb.ToString())));
        }

        public string Describe()
        {
            var lines = new List<string>();
            lines.Add(string.Format("App: {0} (pid {1}). Window: {2}", app, pid, Safety.Mask(window)));
            foreach (var n in nodes)
            {
                var line = string.Format("[{0}] {1} {2}", n.id, n.role, Quote(n.label));
                if (!string.IsNullOrEmpty(n.value) && !n.secret) line += " = " + Quote(Trunc(n.value, 60));
                if (n.secret) line += " (secret)";
                if (!n.enabled) line += " (disabled)";
                line += string.Format(" (at {0},{1})", n.rect[0] + n.rect[2] / 2, n.rect[1] + n.rect[3] / 2);
                lines.Add(line);
            }
            if (focused.Length > 0) lines.Add("Focused: " + focused);
            lines.Add("Visible text (data): " + Trunc(string.Join(" | ", texts), 1400));
            return string.Join("\n", lines);
        }

        static string Quote(string s) { return "\"" + (s ?? "").Replace("\"", "\\\"") + "\""; }
        public static string Trunc(string s, int n) { return s == null ? "" : s.Length <= n ? s : s.Substring(0, n) + "…"; }
    }

    static class Safety
    {
        // Ported from Atticus (MIT): what counts as secret or risky.
        public static readonly Regex Secret = new Regex(@"password|passcode|passphrase|passport|\bpin\b|card|cvv|cvc|security (answer|code)|\bssn\b|social security|api.?key|token|secret|one.?time|verification|auth.*code|2fa|\botp\b|bank|account.?number|routing|iban|tax.?id|recovery|seed|mnemonic", RegexOptions.IgnoreCase);
        public static readonly Regex Risky = new Regex(@"\b(buy|purchase|pay|payment|checkout|order|send|delete|remove|trash|submit|publish|post|sign.?out|log.?out|unsubscribe|subscribe|transfer|bid|erase|withdraw|donate|authorize|grant access|allow access|logout|book|reserve|merge|deploy|discard|wipe|format|uninstall|reset|apply(?! filters| changes| settings| coupon| code| promo| discount| theme| style| formatting)|confirm)\b", RegexOptions.IgnoreCase);
        static readonly Regex Generic = new Regex(@"^\s*(ok|yes|continue|allow|accept|agree|complete|finish|grant)\s*$", RegexOptions.IgnoreCase);

        public static bool IsRisky(string label, Map map)
        {
            if (string.Equals((label ?? "").Trim(), "cancel", StringComparison.OrdinalIgnoreCase)) return false;
            if (Risky.IsMatch(label ?? "")) return true;
            // "OK" is only risky inside a dialog that talks about something risky.
            return Generic.IsMatch(label ?? "") && Risky.IsMatch(map.window + " " + string.Join(" ", map.texts));
        }

        public static string Mask(string s)
        {
            if (string.IsNullOrEmpty(s)) return s ?? "";
            s = Regex.Replace(s, @"\b(?:\d[ -]?){13,19}\b|\b\d{3}[- ]\d{2}[- ]\d{4}\b|\b\d{6,8}\b", "[SECRET]");
            if (Regex.IsMatch(s, @"(one.?time|verification|security|auth|otp|code)\D{0,20}\d{4,8}", RegexOptions.IgnoreCase))
                s = Regex.Replace(s, @"\b\d{4,8}\b", "[SECRET]");
            return s;
        }
    }

    static class Native
    {
        [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
        [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
        [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
        [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
        [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint a, uint b, bool attach);
        [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
        [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
        [DllImport("user32.dll")] public static extern bool GetCursorPos(out POINT p);
        [DllImport("user32.dll", SetLastError = true)] public static extern uint SendInput(uint n, INPUT[] inputs, int size);
        [DllImport("user32.dll")] public static extern short VkKeyScan(char c);
        [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
        [DllImport("user32.dll")] public static extern IntPtr GetWindow(IntPtr h, uint cmd);
        [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
        [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr h);
        [DllImport("user32.dll")] public static extern IntPtr GetAncestor(IntPtr h, uint flags);

        [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X, Y; }
        [StructLayout(LayoutKind.Sequential)] public struct MOUSEINPUT { public int dx, dy; public uint mouseData, dwFlags, time; public IntPtr extra; }
        [StructLayout(LayoutKind.Sequential)] public struct KEYBDINPUT { public ushort wVk, wScan; public uint dwFlags, time; public IntPtr extra; }
        [StructLayout(LayoutKind.Explicit)] public struct InputUnion { [FieldOffset(0)] public MOUSEINPUT mi; [FieldOffset(0)] public KEYBDINPUT ki; }
        [StructLayout(LayoutKind.Sequential)] public struct INPUT { public uint type; public InputUnion u; }

        const uint MOUSE = 0, KEYBOARD = 1;
        const uint KEYUP = 0x2, UNICODE = 0x4;

        public static void Send(params INPUT[] inputs) { SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(INPUT))); }

        public static INPUT Mouse(uint flags)
        {
            var i = new INPUT { type = MOUSE };
            i.u.mi.dwFlags = flags;
            return i;
        }

        public static INPUT Key(ushort vk, bool up)
        {
            var i = new INPUT { type = KEYBOARD };
            i.u.ki.wVk = vk;
            i.u.ki.dwFlags = up ? KEYUP : 0;
            return i;
        }

        public static void TypeUnicode(string text)
        {
            var list = new List<INPUT>();
            foreach (var c in text)
            {
                foreach (var up in new[] { false, true })
                {
                    var i = new INPUT { type = KEYBOARD };
                    i.u.ki.wScan = c;
                    i.u.ki.dwFlags = UNICODE | (up ? KEYUP : 0);
                    list.Add(i);
                }
            }
            Send(list.ToArray());
        }

        // The window the user was in before a raise, put back once keys or the mouse are done.
        public static IntPtr Borrowed = IntPtr.Zero;

        public static void Restore()
        {
            if (Borrowed == IntPtr.Zero) return;
            var back = Borrowed;
            Borrowed = IntPtr.Zero;
            if (GetForegroundWindow() != back) Raise(back, false);
        }

        // Windows only lets the foreground app hand focus away; attaching to its input thread is the usual way in.
        public static void Raise(IntPtr hwnd, bool remember = true)
        {
            var current = GetForegroundWindow();
            if (current == hwnd) return;
            if (remember && Borrowed == IntPtr.Zero) Borrowed = current;
            if (IsIconic(hwnd)) ShowWindow(hwnd, 9);
            uint pid;
            var fg = GetForegroundWindow();
            uint fgThread = GetWindowThreadProcessId(fg, out pid), me = GetCurrentThreadId();
            if (fgThread != me) AttachThreadInput(me, fgThread, true);
            SetForegroundWindow(hwnd);
            if (fgThread != me) AttachThreadInput(me, fgThread, false);
        }
    }

    class Failure : Exception { public Failure(string m) : base(m) { } }

    static class Hands
    {
        const int MaxNodes = 250, MaxTexts = 120;
        static readonly string StateFile = Path.Combine(Path.GetTempPath(), "buddy-hands-" + Environment.UserName + ".json");
        public static bool AllowRisky;

        static readonly HashSet<ControlType> Actionable = new HashSet<ControlType> {
            ControlType.Button, ControlType.CheckBox, ControlType.ComboBox, ControlType.Edit, ControlType.Hyperlink,
            ControlType.ListItem, ControlType.MenuItem, ControlType.RadioButton, ControlType.Slider, ControlType.Spinner,
            ControlType.SplitButton, ControlType.TabItem, ControlType.TreeItem, ControlType.DataItem, ControlType.Document,
            ControlType.Menu, ControlType.ScrollBar, ControlType.HeaderItem,
        };

        // ---------- targets ----------

        // Office Buddies' own windows (the buddy, its chat) are never a target: the app passes its pid.
        public static int OwnerPid = -1;

        public static AutomationElement Window(string app)
        {
            AutomationElement w = FindWindow(app);
            if (w.Current.ProcessId == OwnerPid) throw new Failure("That is Office Buddies itself. Name the app to work in.");
            var h = new IntPtr(w.Current.NativeWindowHandle);
            if (h != IntPtr.Zero && Native.IsIconic(h))
                throw new Failure("\"" + w.Current.Name + "\" is minimized. Run show \"" + (app ?? h.ToString()) + "\" to bring it back without taking focus.");
            return w;
        }

        static AutomationElement FindWindow(string app)
        {
            if (!string.IsNullOrEmpty(app))
            {
                long h;
                if (long.TryParse(app, out h)) return AutomationElement.FromHandle(new IntPtr(h));
                var want = app.ToLowerInvariant().Replace(".exe", "").Trim();
                AutomationElement best = null;
                var exact = new List<AutomationElement>();
                foreach (AutomationElement w in AutomationElement.RootElement.FindAll(TreeScope.Children, Condition.TrueCondition))
                {
                    string proc = "", title = "";
                    try
                    {
                        if (w.Current.ProcessId == OwnerPid) continue;
                        proc = Process.GetProcessById(w.Current.ProcessId).ProcessName.ToLowerInvariant();
                        title = w.Current.Name.ToLowerInvariant();
                    }
                    catch { continue; }
                    if (proc == want || title == want) exact.Add(w);
                    else if (best == null && (title.Contains(want) || proc.Contains(want))) best = w;
                }
                // Store apps can leave an empty frame behind: prefer the window with the most inside it.
                if (exact.Count == 1) return exact[0];
                if (exact.Count > 1)
                    return exact.OrderByDescending(w =>
                    {
                        try { return w.FindAll(TreeScope.Descendants, Automation.ControlViewCondition).Count; }
                        catch { return 0; }
                    }).First();
                if (best != null) return best;
                throw new Failure("No open window for \"" + app + "\". Run windows to see what is open, or open it.");
            }
            // No app named: the front window, skipping our own (the user is usually typing in the buddy's chat).
            var fg = Native.GetForegroundWindow();
            for (var h = fg; h != IntPtr.Zero; h = Native.GetWindow(h, 2 /* GW_HWNDNEXT */))
            {
                if (!Native.IsWindowVisible(h) || Native.GetWindowTextLength(h) == 0 || Native.GetAncestor(h, 2 /* GA_ROOT */) != h) continue;
                uint pid;
                Native.GetWindowThreadProcessId(h, out pid);
                if ((int)pid == OwnerPid || Native.IsIconic(h)) continue;
                try
                {
                    var name = Process.GetProcessById((int)pid).ProcessName.ToLowerInvariant();
                    if (name == "cua-driver" || name == "textinputhost" || name == "shellexperiencehost" || name == "searchhost") continue;
                }
                catch { continue; }
                return AutomationElement.FromHandle(h);
            }
            throw new Failure("No window is in front.");
        }

        public static string Show(string app)
        {
            var w = FindWindow(app);
            var h = new IntPtr(w.Current.NativeWindowHandle);
            Native.ShowWindow(h, 4); // SW_SHOWNOACTIVATE: restored, but the user keeps focus
            Thread.Sleep(300);
            WaitForContent(w, h); // a Store app stays suspended until it is activated
            return "Restored \"" + w.Current.Name + "\".";
        }

        // Opens an app, folder, document, settings page (ms-settings:) or web address. Never scripts or installers.
        public static string Open(string target)
        {
            var t = target.Trim().Trim('"');
            if (Regex.IsMatch(t, @"\.(bat|cmd|ps1|psm1|vbs|vbe|js|jse|wsf|wsh|hta|msi|msp|scr|com|cpl|reg|lnk|exe)\s*$", RegexOptions.IgnoreCase) && !Regex.IsMatch(t, @"^[\w-]+\.exe$", RegexOptions.IgnoreCase))
                throw new Failure("Opening scripts, installers or programs by path is not allowed. Open an app by name instead.");
            if (Regex.IsMatch(t, @"^(javascript|vbscript|file):", RegexOptions.IgnoreCase))
                throw new Failure("That kind of address is not allowed.");
            var before = new HashSet<int>();
            foreach (AutomationElement w in AutomationElement.RootElement.FindAll(TreeScope.Children, Condition.TrueCondition))
                try { before.Add(w.Current.NativeWindowHandle); } catch { }
            // App names as people say them ("Calculator", "Paint") live in the Start menu's app list, not on the PATH.
            var app = Regex.IsMatch(t, @"[:\\/.]") ? null : StartMenuApp(t);
            try
            {
                if (app != null) Process.Start(new ProcessStartInfo("explorer.exe", "shell:AppsFolder\\" + app[1]) { UseShellExecute = true });
                else Process.Start(new ProcessStartInfo(t) { UseShellExecute = true });
            }
            catch (Exception e)
            {
                throw new Failure("Could not open \"" + t + "\": " + e.Message + ". Use the app's name as the Start menu shows it, or list_windows if it is already open.");
            }
            if (app != null) t = app[0];
            for (int i = 0; i < 24; i++) // a new window, or 6 s
            {
                Thread.Sleep(250);
                foreach (AutomationElement w in AutomationElement.RootElement.FindAll(TreeScope.Children, Condition.TrueCondition))
                {
                    try
                    {
                        var c = w.Current;
                        if (!before.Contains(c.NativeWindowHandle) && !string.IsNullOrEmpty(c.Name))
                        {
                            WaitForContent(w, new IntPtr(c.NativeWindowHandle));
                            return string.Format("Opened \"{0}\" (window {1}).", c.Name, c.NativeWindowHandle) + Siblings(c.ProcessId, c.NativeWindowHandle);
                        }
                    }
                    catch { }
                }
            }
            return "Opened \"" + t + "\" (no new window appeared; it may have reused one).";
        }

        // Other windows of the same app, so a model that opened a copy can still use the one the user meant.
        static string Siblings(int pid, int except)
        {
            var names = new List<string>();
            foreach (AutomationElement w in AutomationElement.RootElement.FindAll(TreeScope.Children, new PropertyCondition(AutomationElement.ProcessIdProperty, pid)))
                try { if (w.Current.NativeWindowHandle != except && !string.IsNullOrEmpty(w.Current.Name)) names.Add(string.Format("\"{0}\" ({1})", w.Current.Name, w.Current.NativeWindowHandle)); } catch { }
            return names.Count == 0 ? "" : " Already open in this app: " + string.Join(", ", names) + ". If the user meant one of those, use its number as app.";
        }

        // A new window is ready once it shows more than its frame. Store apps sit on their splash
        // screen until activated, so a window still empty after a second is brought forward once
        // (the user asked to open it, so it belongs in front).
        static void WaitForContent(AutomationElement w, IntPtr hwnd)
        {
            for (int i = 0; i < 24; i++)
            {
                int count = 0;
                try { count = w.FindAll(TreeScope.Descendants, Automation.ControlViewCondition).Count; } catch { }
                if (count > 8) return;
                if (i == 4) Native.Raise(hwnd, false);
                Thread.Sleep(250);
            }
        }

        // The Start menu's apps (classic and Store) as [name, AppUserModelID], matched by name.
        static string[] StartMenuApp(string name)
        {
            var want = name.Trim().ToLowerInvariant();
            var apps = new List<string[]>();
            try
            {
                var shell = Activator.CreateInstance(System.Type.GetTypeFromProgID("Shell.Application"));
                dynamic folder = shell.GetType().InvokeMember("NameSpace", System.Reflection.BindingFlags.InvokeMethod, null, shell, new object[] { "shell:AppsFolder" });
                foreach (dynamic item in folder.Items()) apps.Add(new[] { (string)item.Name, (string)item.Path });
            }
            catch { return null; }
            return apps.FirstOrDefault(a => a[0].ToLowerInvariant() == want)
                ?? apps.Where(a => a[0].ToLowerInvariant().StartsWith(want)).OrderBy(a => a[0].Length).FirstOrDefault()
                ?? apps.Where(a => want.Length >= 4 && a[0].ToLowerInvariant().Contains(want)).OrderBy(a => a[0].Length).FirstOrDefault();
        }

        // Paged readable text of a window: documents, fields and labels, including what is scrolled out of view.
        public static string Read(string app, int offset)
        {
            const int Page = 4000;
            var win = Window(app);
            var sb = new StringBuilder();
            object p;
            foreach (AutomationElement d in win.FindAll(TreeScope.Descendants, new OrCondition(
                         new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Document),
                         new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit))))
            {
                try
                {
                    if (d.Current.IsPassword) continue;
                    if (d.TryGetCurrentPattern(TextPattern.Pattern, out p)) sb.AppendLine(((TextPattern)p).DocumentRange.GetText(200000));
                    else if (d.TryGetCurrentPattern(ValuePattern.Pattern, out p)) sb.AppendLine(((ValuePattern)p).Current.Value);
                }
                catch { }
                if (sb.Length > 200000) break;
            }
            if (sb.ToString().Trim().Length == 0)
                foreach (AutomationElement t in win.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text)))
                {
                    try { sb.AppendLine(t.Current.Name); } catch { }
                    if (sb.Length > 200000) break;
                }
            var text = Safety.Mask(Regex.Replace(Regex.Replace(sb.ToString(), @"\r\n?", "\n"), @"\n{3,}", "\n\n"));
            if (offset >= text.Length) return "(end of text)";
            var page = text.Substring(offset, Math.Min(Page, text.Length - offset));
            var next = offset + page.Length;
            return page + (next < text.Length ? "\n(more: read --offset " + next + ")" : "\n(end of text)");
        }

        // ---------- see ----------

        static readonly Regex Chromium = new Regex("^(chrome|msedge|brave|comet|opera|vivaldi|arc|electron|code|slack|discord|teams|ms-teams)$", RegexOptions.IgnoreCase);

        static readonly Regex Browser = new Regex("^(chrome|msedge|brave|comet|opera|vivaldi|arc)$", RegexOptions.IgnoreCase);

        public static Map See(string app)
        {
            var sw = Stopwatch.StartNew();
            var win = Window(app);
            Map map = null;
            // Chromium builds its page tree only after an accessibility client shows up: the first reads
            // can hold only the browser frame. Give it a moment.
            for (int attempt = 0; attempt < 4; attempt++)
            {
                map = SeeOnce(attempt == 0 ? win : Window(app));
                if (!Chromium.IsMatch(map.app ?? "") || map.pageItems > 0) break;
                // A browser always has a page; other Chromium apps only when a document area showed up empty.
                if (!Browser.IsMatch(map.app ?? "") && map.page.IsEmpty) break;
                Thread.Sleep(600);
            }
            map.ms = sw.ElapsedMilliseconds;
            Save(map);
            return map;
        }

        static Map SeeOnce(AutomationElement win)
        {
            var map = new Map();
            var cur = win.Current;
            map.pid = cur.ProcessId;
            map.window = cur.Name;
            map.hwnd = cur.NativeWindowHandle;
            try { map.app = Process.GetProcessById(map.pid).ProcessName; } catch { map.app = "?"; }

            var cache = new CacheRequest { TreeScope = TreeScope.Element, AutomationElementMode = AutomationElementMode.Full };
            foreach (var p in new AutomationProperty[] {
                AutomationElement.NameProperty, AutomationElement.ControlTypeProperty, AutomationElement.BoundingRectangleProperty,
                AutomationElement.IsOffscreenProperty, AutomationElement.IsPasswordProperty, AutomationElement.IsEnabledProperty,
                AutomationElement.AutomationIdProperty, AutomationElement.HelpTextProperty, ValuePattern.ValueProperty,
                AutomationElement.IsValuePatternAvailableProperty })
                cache.Add(p);

            AutomationElementCollection all;
            using (cache.Activate())
                all = win.FindAll(TreeScope.Descendants, Automation.ControlViewCondition);

            var seen = new HashSet<string>();
            foreach (AutomationElement e in all)
            {
                if (map.nodes.Count >= MaxNodes && map.texts.Count >= MaxTexts) break;
                ControlType type; Rect r; string name; bool offscreen;
                try
                {
                    type = (ControlType)e.GetCachedPropertyValue(AutomationElement.ControlTypeProperty);
                    r = (Rect)e.GetCachedPropertyValue(AutomationElement.BoundingRectangleProperty);
                    name = ((string)e.GetCachedPropertyValue(AutomationElement.NameProperty) ?? "").Trim();
                    offscreen = (bool)e.GetCachedPropertyValue(AutomationElement.IsOffscreenProperty);
                }
                catch { continue; }
                if (offscreen || r.IsEmpty || r.Width < 2 || r.Height < 2) continue;

                if (type == ControlType.Document && map.page.IsEmpty) map.page = r;
                else if (!map.page.IsEmpty && map.page.Contains(r)) map.pageItems++;

                if (type == ControlType.Text)
                {
                    if (name.Length > 0 && map.texts.Count < MaxTexts && seen.Add("t:" + name)) map.texts.Add(Safety.Mask(name));
                    continue;
                }
                if (!Actionable.Contains(type) || map.nodes.Count >= MaxNodes) continue;

                var n = new Node();
                n.element = e;
                n.role = type.ProgrammaticName.Replace("ControlType.", "");
                n.automationId = (string)e.GetCachedPropertyValue(AutomationElement.AutomationIdProperty) ?? "";
                if (name.Length == 0) name = (string)e.GetCachedPropertyValue(AutomationElement.HelpTextProperty) ?? "";
                if (name.Length == 0 && type != ControlType.Edit && type != ControlType.Document) continue; // unlabeled: useless to a label-driven model
                n.label = Safety.Mask(Map.Trunc(name, 120));
                n.enabled = (bool)e.GetCachedPropertyValue(AutomationElement.IsEnabledProperty);
                n.secret = (bool)e.GetCachedPropertyValue(AutomationElement.IsPasswordProperty) || Safety.Secret.IsMatch(name);
                try
                {
                    if ((bool)e.GetCachedPropertyValue(AutomationElement.IsValuePatternAvailableProperty))
                        n.value = n.secret ? "" : Safety.Mask((string)e.GetCachedPropertyValue(ValuePattern.ValueProperty) ?? "");
                }
                catch { }
                n.rect = new[] { (int)r.X, (int)r.Y, (int)r.Width, (int)r.Height };
                n.id = map.nodes.Count + 1;
                map.nodes.Add(n);
            }
            foreach (var n in map.nodes) n.risky = Safety.IsRisky(n.label, map);
            try
            {
                var f = AutomationElement.FocusedElement;
                if (f != null && f.Current.ProcessId == map.pid) map.focused = f.Current.ControlType.ProgrammaticName.Replace("ControlType.", "") + " \"" + Safety.Mask(f.Current.Name) + "\"";
            }
            catch { }
            return map;
        }

        static void Save(Map map)
        {
            var s = new JavaScriptSerializer { MaxJsonLength = int.MaxValue };
            File.WriteAllText(StateFile, s.Serialize(new Dictionary<string, object> { { "hwnd", map.hwnd }, { "app", map.app } }));
        }

        static string LastWindow()
        {
            try
            {
                var d = new JavaScriptSerializer().Deserialize<Dictionary<string, object>>(File.ReadAllText(StateFile));
                return Convert.ToString(d["hwnd"]);
            }
            catch { return null; }
        }

        // ---------- resolve ----------

        // Keys and symbols that apps label with words.
        static readonly Dictionary<string, string> Spoken = new Dictionary<string, string> {
            {"0","zero"},{"1","one"},{"2","two"},{"3","three"},{"4","four"},{"5","five"},{"6","six"},{"7","seven"},{"8","eight"},{"9","nine"},
            {"+","plus"},{"-","minus"},{"*","multiply by"},{"x","multiply by"},{"×","multiply by"},{"times","multiply by"},{"multiply","multiply by"},
            {"/","divide by"},{"÷","divide by"},{"divide","divide by"},{"=","equals"},{".","decimal separator"},{",","decimal separator"},
        };

        static readonly HashSet<string> Editable = new HashSet<string> { "Edit", "Document", "ComboBox" };

        static Node Resolve(Map map, string target, string near, bool editable = false)
        {
            // Only "[12]" is an id; a bare "7" is a label (a keypad key, a page number).
            var m = Regex.Match(target.Trim(), @"^\[(\d+)\]$");
            if (m.Success)
            {
                int id = int.Parse(m.Groups[1].Value);
                var hit = map.nodes.FirstOrDefault(n => n.id == id);
                if (hit == null) throw new Failure("No control [" + id + "]. Run see again.");
                return hit;
            }
            var want = Norm(target);
            var pool = editable && map.nodes.Any(n => Editable.Contains(n.role)) ? map.nodes.Where(n => Editable.Contains(n.role)).ToList() : map.nodes;
            var ranked = pool.Select(n => new { n, score = Rank(Norm(n.label), want, Norm(n.automationId)) })
                                  .Where(x => x.score > 0).OrderByDescending(x => x.score).ToList();
            string spoken;
            if (ranked.Count == 0 && Spoken.TryGetValue(want, out spoken))   // "7" -> "Seven", "×" -> "Multiply by"
                ranked = pool.Select(n => new { n, score = Rank(Norm(n.label), spoken, "") })
                                  .Where(x => x.score > 0).OrderByDescending(x => x.score).ToList();
            if (ranked.Count == 0) throw new Failure("No visible control named \"" + target + "\". Run see and use a label from it.");
            var top = ranked.Where(x => x.score == ranked[0].score).Select(x => x.n).ToList();
            if (top.Count > 1 && !string.IsNullOrEmpty(near))
            {
                var anchor = Resolve(map, near, null);
                top = top.OrderBy(n => Dist(n, anchor)).ToList();
                return top[0];
            }
            if (top.Count > 1 && top.Select(n => n.label).Distinct().Count() > 1)
                throw new Failure("\"" + target + "\" matches several controls: " + string.Join(", ", top.Take(5).Select(n => "[" + n.id + "] " + n.label)) + ". Use the [id] or near <label>.");
            return top[0];
        }

        static int Rank(string label, string want, string autoId)
        {
            if (label == want) return 3;
            if (autoId == want) return 2;
            if (want.Length >= 3 && label.Contains(want)) return 1;
            return 0;
        }

        static double Dist(Node a, Node b)
        {
            double dx = a.rect[0] - b.rect[0], dy = a.rect[1] - b.rect[1];
            return dx * dx + dy * dy;
        }

        static string Norm(string s) { return Regex.Replace((s ?? "").ToLowerInvariant().Replace("&", ""), @"\s+", " ").Trim(); }

        // ---------- act ----------

        static Map Target(string app)
        {
            // Act in the window the last see looked at, unless an app is named.
            return See(string.IsNullOrEmpty(app) ? LastWindow() : app);
        }

        static void Gate(Node n, Map map, string verb)
        {
            if (!n.enabled) throw new Failure("[" + n.id + "] " + n.label + " is disabled.");
            if (n.risky && !AllowRisky)
                throw new Failure("RISKY: " + verb + " \"" + n.label + "\" needs the user's Allow.");
        }

        public static Dictionary<string, object> Click(string target, string app, string near, bool dbl, bool right)
        {
            var before = Target(app);
            var n = Resolve(before, target, near);
            Gate(n, before, "click");
            string how = null;
            if (!dbl && !right) how = Invoke(n.element);
            if (how == null)
            {
                Mouse(before, n, dbl, right);
                how = right ? "right-click" : dbl ? "double-click" : "mouse";
            }
            return After(before, "Clicked \"" + n.label + "\" (" + how + ")");
        }

        static string Invoke(AutomationElement e)
        {
            object p;
            if (e.TryGetCurrentPattern(InvokePattern.Pattern, out p)) { ((InvokePattern)p).Invoke(); return "invoke"; }
            if (e.TryGetCurrentPattern(TogglePattern.Pattern, out p)) { ((TogglePattern)p).Toggle(); return "toggle"; }
            if (e.TryGetCurrentPattern(SelectionItemPattern.Pattern, out p)) { ((SelectionItemPattern)p).Select(); return "select"; }
            if (e.TryGetCurrentPattern(ExpandCollapsePattern.Pattern, out p))
            {
                var ec = (ExpandCollapsePattern)p;
                if (ec.Current.ExpandCollapseState == ExpandCollapseState.Expanded) ec.Collapse(); else ec.Expand();
                return "expand";
            }
            return null;
        }

        // Mouse fallback needs the window in front; the user's pointer goes back where it was.
        static void Mouse(Map map, Node n, bool dbl, bool right)
        {
            Native.POINT old;
            Native.GetCursorPos(out old);
            Native.Raise(new IntPtr(map.hwnd));
            Thread.Sleep(80);
            Native.SetCursorPos(n.rect[0] + n.rect[2] / 2, n.rect[1] + n.rect[3] / 2);
            uint down = right ? 0x0008u : 0x0002u, up = right ? 0x0010u : 0x0004u;
            for (int i = 0; i < (dbl ? 2 : 1); i++) Native.Send(Native.Mouse(down), Native.Mouse(up));
            Thread.Sleep(60);
            Native.SetCursorPos(old.X, old.Y);
        }

        public static Dictionary<string, object> Type(string target, string text, string app, bool submit, bool append)
        {
            var before = Target(app);
            var n = Resolve(before, target, null, true); // typing goes into fields, never a same-named menu
            Gate(n, before, "type into");
            if (n.secret) throw new Failure("\"" + n.label + "\" is a secret field. The user must type it, or explicitly ask you to.");
            string how;
            object p;
            if (!submit && n.element.TryGetCurrentPattern(ValuePattern.Pattern, out p) && !((ValuePattern)p).Current.IsReadOnly)
            {
                var vp = (ValuePattern)p;
                vp.SetValue(append ? vp.Current.Value + text : text);
                how = "value";
            }
            else
            {
                Native.Raise(new IntPtr(before.hwnd));
                n.element.SetFocus();
                Thread.Sleep(60);
                if (!append) { Keys("ctrl+a"); }
                Native.TypeUnicode(text);
                if (submit) Keys("enter");
                how = "keys";
            }
            return After(before, "Typed into \"" + n.label + "\" (" + how + ")");
        }

        // Shortcuts that delete, send or confirm are as risky as the buttons they stand for.
        static readonly Regex RiskyCombo = new Regex(@"^(?:(?:ctrl|control|shift|alt)\+)*(?:del|delete|backspace)$|^(?:ctrl|control)\+(?:return|enter|d)$|^alt\+s$", RegexOptions.IgnoreCase);
        static readonly Regex DeleteKey = new Regex(@"^(?:del|delete)$", RegexOptions.IgnoreCase);

        static bool IsRiskyCombo(string combo, Map map)
        {
            var c = Regex.Replace(combo.Trim(), @"\s+", "");
            if (!RiskyCombo.IsMatch(c)) return false;
            // A bare Delete/Backspace edits text; it only removes things (files, mail, items) outside a text field.
            if ((DeleteKey.IsMatch(c) || c.Equals("backspace", StringComparison.OrdinalIgnoreCase)))
                return !map.focused.StartsWith("Edit") && !map.focused.StartsWith("Document");
            return true;
        }

        public static Dictionary<string, object> Press(string combo, string app)
        {
            var before = Target(app);
            if (IsRiskyCombo(combo, before) && !AllowRisky)
                throw new Failure("RISKY: press \"" + combo + "\" needs the user's Allow.");
            Native.Raise(new IntPtr(before.hwnd));
            Thread.Sleep(60);
            Keys(combo);
            return After(before, "Pressed " + combo);
        }

        static readonly Dictionary<string, ushort> VK = new Dictionary<string, ushort> {
            {"ctrl",0x11},{"control",0x11},{"shift",0x10},{"alt",0x12},{"win",0x5B},{"enter",0x0D},{"return",0x0D},
            {"esc",0x1B},{"escape",0x1B},{"tab",0x09},{"space",0x20},{"backspace",0x08},{"delete",0x2E},{"del",0x2E},
            {"home",0x24},{"end",0x23},{"pageup",0x21},{"pagedown",0x22},{"left",0x25},{"up",0x26},{"right",0x27},{"down",0x28},
        };

        static void Keys(string combo)
        {
            var mods = new List<ushort>();
            ushort key = 0;
            foreach (var part in combo.ToLowerInvariant().Split('+'))
            {
                ushort vk;
                if (VK.TryGetValue(part, out vk)) { if (vk == 0x11 || vk == 0x10 || vk == 0x12 || vk == 0x5B) mods.Add(vk); else key = vk; }
                else if (Regex.IsMatch(part, @"^f([1-9]|1[0-2])$")) key = (ushort)(0x70 + int.Parse(part.Substring(1)) - 1);
                else if (part.Length == 1) key = (ushort)(Native.VkKeyScan(part[0]) & 0xFF);
                else throw new Failure("Unknown key \"" + part + "\".");
            }
            if (mods.Contains(0x5B) && key == 0x4C) throw new Failure("win+l is not allowed.");
            var seq = new List<Native.INPUT>();
            foreach (var m in mods) seq.Add(Native.Key(m, false));
            if (key != 0) { seq.Add(Native.Key(key, false)); seq.Add(Native.Key(key, true)); }
            for (int i = mods.Count - 1; i >= 0; i--) seq.Add(Native.Key(mods[i], true));
            Native.Send(seq.ToArray());
        }

        // Re-read and report what changed: a click isn't success until the state says so.
        static Dictionary<string, object> After(Map before, string did)
        {
            Native.Restore();
            // Wait for a change, then for it to settle (two reads in a row agree): pages keep loading after a click.
            Map after = null;
            string last = null;
            bool changed = false;
            var clock = Stopwatch.StartNew();
            while (clock.ElapsedMilliseconds < 3000)
            {
                Thread.Sleep(changed ? 300 : 200);
                try { after = SeeOnce(AutomationElement.FromHandle(new IntPtr(before.hwnd))); }
                catch (ElementNotAvailableException) { after = null; break; } // the window closed
                catch (Failure) { after = null; break; }
                catch (ArgumentException) { after = null; break; }
                var d = after.Digest();
                if (!changed) { changed = d != before.Digest(); if (!changed && clock.ElapsedMilliseconds > 1500) break; }
                else if (d == last) break;
                last = d;
            }
            if (after != null) Save(after);
            var r = new Dictionary<string, object>();
            r["ok"] = true;
            r["did"] = did;
            r["changed"] = after == null || after.Digest() != before.Digest();
            r["map"] = after == null ? "The window closed." : after.Describe();
            return r;
        }

        public static string Windows()
        {
            var lines = new List<string>();
            foreach (AutomationElement w in AutomationElement.RootElement.FindAll(TreeScope.Children, Condition.TrueCondition))
            {
                try
                {
                    var c = w.Current;
                    if (string.IsNullOrEmpty(c.Name) || c.ProcessId == OwnerPid) continue;
                    var min = Native.IsIconic(new IntPtr(c.NativeWindowHandle));
                    if (c.IsOffscreen && !min) continue;
                    lines.Add(string.Format("{0} {1} \"{2}\"{3}", c.NativeWindowHandle, Process.GetProcessById(c.ProcessId).ProcessName, c.Name, min ? " (minimized)" : ""));
                }
                catch { }
            }
            return string.Join("\n", lines);
        }
    }

    static class Program
    {
        [STAThread]
        static int Main(string[] argv)
        {
            Native.SetProcessDPIAware(); // UIA rects are physical pixels; mouse must match
            Console.OutputEncoding = new UTF8Encoding(false);
            var args = argv.ToList();
            Hands.AllowRisky = args.Remove("--allow-risky");
            var owner = Environment.GetEnvironmentVariable("BUDDY_HANDS_OWNER_PID");
            int ownerPid;
            if (owner != null && int.TryParse(owner, out ownerPid)) Hands.OwnerPid = ownerPid;
            if (args.Count == 1 && args[0] == "--serve") return Serve();
            var r = Run(args);
            Console.WriteLine(r.ContainsKey("text") ? r["text"] : new JavaScriptSerializer { MaxJsonLength = int.MaxValue }.Serialize(r));
            return (bool)r["ok"] ? 0 : 1;
        }

        static int Serve()
        {
            var json = new JavaScriptSerializer { MaxJsonLength = int.MaxValue };
            string line;
            // The app writes UTF-8. Console.In would decode it with the console's legacy code page
            // (850/437), turning "ações" into "a├º├Áes" before it is typed anywhere.
            var input = new StreamReader(Console.OpenStandardInput(), new UTF8Encoding(false));
            while ((line = input.ReadLine()) != null)
            {
                Dictionary<string, object> r;
                try
                {
                    var req = json.Deserialize<Dictionary<string, object>>(line);
                    var args = ((System.Collections.ArrayList)req["args"]).Cast<object>().Select(Convert.ToString).ToList();
                    Hands.AllowRisky = req.ContainsKey("allowRisky") && Convert.ToBoolean(req["allowRisky"]);
                    r = Run(args);
                    if (req.ContainsKey("id")) r["id"] = req["id"];
                }
                catch (Exception e) { r = new Dictionary<string, object> { { "ok", false }, { "error", e.Message } }; }
                Console.WriteLine(json.Serialize(r));
                Console.Out.Flush();
            }
            return 0;
        }

        static string Opt(List<string> a, string name)
        {
            int i = a.IndexOf(name);
            if (i < 0 || i + 1 >= a.Count) return null;
            var v = a[i + 1];
            a.RemoveRange(i, 2);
            return v;
        }

        static bool Flag(List<string> a, string name) { return a.Remove(name); }

        static Dictionary<string, object> Run(List<string> a)
        {
            var sw = Stopwatch.StartNew();
            var r = new Dictionary<string, object>();
            try
            {
                if (a.Count == 0) throw new Failure("Usage: windows | open <target> | show <app> | see [app] | read [app] [--offset N] | click <label|[id]> [near <label>] [double|right] [in <app>] | type <field> \"text\" [submit|append] [in <app>] | press \"ctrl+s\" [in <app>]");
                var verb = a[0];
                a.RemoveAt(0);
                var app = Opt(a, "in");
                switch (verb)
                {
                    case "see":
                        var map = Hands.See(a.Count > 0 ? a[0] : app);
                        r["ok"] = true; r["text"] = map.Describe() + "\n(" + map.ms + " ms, " + map.nodes.Count + " controls)";
                        break;
                    case "click":
                        var near = Opt(a, "near");
                        bool dbl = Flag(a, "double"), right = Flag(a, "right");
                        if (a.Count != 1) throw new Failure("click <label|[id]>");
                        r = Hands.Click(a[0], app, near, dbl, right);
                        break;
                    case "type":
                        bool submit = Flag(a, "submit"), append = Flag(a, "append");
                        if (a.Count != 2) throw new Failure("type <field|[id]> \"text\"");
                        r = Hands.Type(a[0], a[1], app, submit, append);
                        break;
                    case "press":
                        if (a.Count != 1) throw new Failure("press \"ctrl+s\"");
                        r = Hands.Press(a[0], app);
                        break;
                    case "open":
                        if (a.Count != 1) throw new Failure("open \"<app|folder|file|url|ms-settings:page>\"");
                        r["ok"] = true; r["text"] = Hands.Open(a[0]);
                        break;
                    case "show":
                        if (a.Count != 1) throw new Failure("show <app>");
                        r["ok"] = true; r["text"] = Hands.Show(a[0]);
                        break;
                    case "read":
                        var off = Opt(a, "--offset");
                        r["ok"] = true; r["text"] = Hands.Read(a.Count > 0 ? a[0] : app, off == null ? 0 : int.Parse(off));
                        break;
                    case "windows":
                        r["ok"] = true; r["text"] = Hands.Windows();
                        break;
                    default:
                        throw new Failure("Unknown verb \"" + verb + "\".");
                }
            }
            catch (Failure f) { r = new Dictionary<string, object> { { "ok", false }, { "error", f.Message } }; }
            catch (ElementNotAvailableException) { r = new Dictionary<string, object> { { "ok", false }, { "error", "That control went away. Run see again." } }; }
            catch (Exception e) { r = new Dictionary<string, object> { { "ok", false }, { "error", e.GetType().Name + ": " + e.Message } }; }
            r["ms"] = sw.ElapsedMilliseconds;
            if (r.ContainsKey("text") && !(bool)r["ok"]) r.Remove("text");
            return r;
        }
    }
}
