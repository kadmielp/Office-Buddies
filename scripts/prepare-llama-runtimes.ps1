$ErrorActionPreference = 'Stop'
$release = 'b11163'
$root = Join-Path $PSScriptRoot '..\resources\local_gguf'
$root = [System.IO.Path]::GetFullPath($root)
$cache = Join-Path $env:TEMP 'officebuddies-llama-b11163'
function Get-Sha256([string]$path) {
    $stream = [System.IO.File]::OpenRead($path)
    try {
        $hasher = [System.Security.Cryptography.SHA256]::Create()
        try { return ([BitConverter]::ToString($hasher.ComputeHash($stream))).Replace('-', '').ToLowerInvariant() }
        finally { $hasher.Dispose() }
    } finally { $stream.Dispose() }
}
New-Item -ItemType Directory -Force -Path $root, $cache | Out-Null
Get-Process -Name 'llama-server' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500
foreach ($backend in @('cpu', 'cuda', 'vulkan')) {
    $destination = [System.IO.Path]::GetFullPath((Join-Path $root $backend))
    if (!$destination.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar)) { throw 'Unsafe runtime destination' }
    if (Test-Path $destination) { Remove-Item -LiteralPath $destination -Recurse -Force }
}

$archives = @(
    @{ name = 'llama-b11163-bin-win-cpu-x64.zip'; sha = '087450606c3220be1d40accdef6708b6ebd65e89f2b03acbbcaf7031ab776899'; target = 'cpu' },
    @{ name = 'llama-b11163-bin-win-vulkan-x64.zip'; sha = '48c139d37db08fcdc85c7e94624e004c210fb0d2b6e08d003267986740067cf5'; target = 'vulkan' },
    @{ name = 'llama-b11163-bin-win-cuda-12.4-x64.zip'; sha = '24c1f777dd9f360e54e3a70497caa6851fc6e88cb523b7ba96d5a95e44f2a960'; target = 'cuda' },
    @{ name = 'cudart-llama-bin-win-cuda-12.4-x64.zip'; sha = '8c79a9b226de4b3cacfd1f83d24f962d0773be79f1e7b75c6af4ded7e32ae1d6'; target = 'cuda' }
)

foreach ($archive in $archives) {
    $zip = Join-Path $cache $archive.name
    if (!(Test-Path $zip) -or (Get-Sha256 $zip) -ne $archive.sha) {
        & curl.exe -fL "https://github.com/ggml-org/llama.cpp/releases/download/$release/$($archive.name)" -o $zip
        if ($LASTEXITCODE -ne 0) { throw "Download failed: $($archive.name)" }
    }
    if ((Get-Sha256 $zip) -ne $archive.sha) { throw "Checksum mismatch: $($archive.name)" }
    $staging = Join-Path $cache ($archive.name + '.unpacked')
    if (!(Test-Path $staging)) {
        [System.IO.Directory]::CreateDirectory($staging) | Out-Null
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $staging)
    }
    $server = Get-ChildItem -Path $staging -Filter 'llama-server.exe' -Recurse -File | Select-Object -First 1
    $source = if ($server) { $server.DirectoryName } else {
        $dll = Get-ChildItem -Path $staging -Filter '*.dll' -Recurse -File | Select-Object -First 1
        if (!$dll) { throw "No runtime files found in $($archive.name)" }
        $dll.DirectoryName
    }
    $destination = Join-Path $root $archive.target
    New-Item -ItemType Directory -Force -Path $destination | Out-Null
    Get-ChildItem -LiteralPath $source -File | Where-Object { $_.Extension -eq '.dll' -or $_.Name -eq 'llama-server.exe' } | Copy-Item -Destination $destination -Force
}

foreach ($backend in @('cpu', 'cuda', 'vulkan')) {
    if (!(Test-Path (Join-Path $root "$backend\llama-server.exe"))) { throw "Missing $backend llama-server.exe" }
}
