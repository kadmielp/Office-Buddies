@echo off
rem Builds buddy-hands.exe with the C# compiler that ships with Windows (.NET Framework 4.x). No SDK needed.
rem Output: resources\buddy-hands\buddy-hands.exe, packaged by forge.config.ts like the llama.cpp runtimes.
setlocal
set FW=%WINDIR%\Microsoft.NET\Framework64\v4.0.30319
set OUT=%~dp0..\..\resources\buddy-hands
if not exist "%OUT%" mkdir "%OUT%"
"%FW%\csc.exe" /nologo /optimize+ /platform:x64 /target:exe /out:"%OUT%\buddy-hands.exe" ^
  /r:"%FW%\WPF\UIAutomationClient.dll" /r:"%FW%\WPF\UIAutomationTypes.dll" /r:"%FW%\WPF\WindowsBase.dll" ^
  /r:"%FW%\System.Web.Extensions.dll" /r:"%FW%\Microsoft.CSharp.dll" ^
  "%~dp0BuddyHands.cs"
exit /b %ERRORLEVEL%
