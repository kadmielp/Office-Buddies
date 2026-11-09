$ErrorActionPreference = 'Stop'
# whisper.cpp for local speech-to-text (Settings > Advanced > Voice input).
# CPU build only: the CUDA build is a 685 MB download, and the base model
# transcribes a few seconds of speech in well under a second on a CPU.
$release = 'b5454'
$archive = @{ name = 'whisper-bin-x64.zip'; sha = '6ba69e3482d7826214f90a6a9c84ca07782aec1e1d0c6a7c30c994fd5d816ccb' }
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\resources\whisper'))
$cache = Join-Path $env:TEMP "officebuddies-whisper-$release"

function Get-Sha256([string]$path) {
    $stream = [System.IO.File]::OpenRead($path)
    try {
        $hasher = [System.Security.Cryptography.SHA256]::Create()
        try { return ([BitConverter]::ToString($hasher.ComputeHash($stream))).Replace('-', '').ToLowerInvariant() }
        finally { $hasher.Dispose() }
    } finally { $stream.Dispose() }
}

New-Item -ItemType Directory -Force -Path $cache | Out-Null
Get-Process -Name 'whisper-server' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 300
if (Test-Path $root) { Remove-Item -LiteralPath $root -Recurse -Force }
New-Item -ItemType Directory -Force -Path $root | Out-Null

$zip = Join-Path $cache $archive.name
if (!(Test-Path $zip) -or (Get-Sha256 $zip) -ne $archive.sha) {
    & curl.exe -fL "https://github.com/ggml-org/whisper.cpp/releases/download/$release/$($archive.name)" -o $zip
    if ($LASTEXITCODE -ne 0) { throw "Download failed: $($archive.name)" }
}
if ((Get-Sha256 $zip) -ne $archive.sha) { throw "Checksum mismatch: $($archive.name)" }

$staging = Join-Path $cache 'unpacked'
if (Test-Path $staging) { Remove-Item -LiteralPath $staging -Recurse -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $staging)

$server = Get-ChildItem -Path $staging -Filter 'whisper-server.exe' -Recurse -File | Select-Object -First 1
if (!$server) { throw "whisper-server.exe not found in $($archive.name)" }
# The server and the libraries it loads; not the CLIs, SDL2 or the bundled llama.
Get-ChildItem -LiteralPath $server.DirectoryName -File |
    Where-Object { $_.Name -eq 'whisper-server.exe' -or $_.Name -eq 'whisper.dll' -or $_.Name -like 'ggml*.dll' } |
    Copy-Item -Destination $root -Force

if (!(Test-Path (Join-Path $root 'whisper-server.exe'))) { throw 'Missing whisper-server.exe' }
Write-Host "whisper.cpp $release ready in $root"
