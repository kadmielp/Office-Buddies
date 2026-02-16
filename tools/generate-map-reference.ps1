param(
  [string]$Agent = '',
  [switch]$IncludeIndexLabels
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path -Parent $PSScriptRoot
$agentsRoot = Join-Path $repoRoot 'assets/agents'

if (-not (Test-Path $agentsRoot)) {
  throw "Agents directory not found: $agentsRoot"
}

function Get-AgentDirectories {
  param([string]$Root, [string]$Name)

  if ([string]::IsNullOrWhiteSpace($Name)) {
    return Get-ChildItem -Path $Root -Directory | Sort-Object Name
  }

  $target = Join-Path $Root $Name
  if (-not (Test-Path $target)) {
    throw "Agent not found: $Name"
  }

  return @(Get-Item $target)
}

function Get-AgentFrameData {
  param([string]$AgentScriptPath)

  $scriptContent = Get-Content -Path $AgentScriptPath -Raw

  $frameSizeMatch = [regex]::Match(
    $scriptContent,
    'framesize\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )

  if (-not $frameSizeMatch.Success) {
    throw "Could not parse framesize in $AgentScriptPath"
  }

  $frameWidth = [int]$frameSizeMatch.Groups[1].Value
  $frameHeight = [int]$frameSizeMatch.Groups[2].Value

  $coordMatches = [regex]::Matches(
    $scriptContent,
    '\[\s*(\d+)\s*,\s*(\d+)\s*\]',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )

  $usage = @{}
  foreach ($match in $coordMatches) {
    $x = [int]$match.Groups[1].Value
    $y = [int]$match.Groups[2].Value

    if (($x % $frameWidth) -ne 0 -or ($y % $frameHeight) -ne 0) {
      continue
    }

    $key = "$x,$y"
    if ($usage.ContainsKey($key)) {
      $usage[$key] += 1
    }
    else {
      $usage[$key] = 1
    }
  }

  return [pscustomobject]@{
    FrameWidth = $frameWidth
    FrameHeight = $frameHeight
    Usage = $usage
  }
}

function Draw-AgentOverlay {
  param(
    [string]$AgentName,
    [string]$MapPath,
    [string]$OutputPath,
    [int]$FrameWidth,
    [int]$FrameHeight,
    [hashtable]$Usage,
    [bool]$DrawIndexLabels,
    [ValidateSet('Coordinates', 'FrameIndex')]
    [string]$LabelMode = 'Coordinates'
  )

  $image = [System.Drawing.Image]::FromFile($MapPath)
  try {
    $mapWidth = $image.Width
    $mapHeight = $image.Height

    $cols = [int][Math]::Floor($mapWidth / $FrameWidth)
    $rows = [int][Math]::Floor($mapHeight / $FrameHeight)

    $bitmap = New-Object System.Drawing.Bitmap($mapWidth, $mapHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.Clear([System.Drawing.Color]::Transparent)

        $usedFillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 0, 183, 255))
        $usedOutlinePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 0, 120, 210), 2)
        $unusedOutlinePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), 1)
        $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, 0, 0, 0), 1)

        $fontSize = [Math]::Max(8, [Math]::Floor([Math]::Min($FrameWidth, $FrameHeight) / 6))
        $font = New-Object System.Drawing.Font('Consolas', [float]$fontSize, [System.Drawing.FontStyle]::Bold)
        $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 0, 0, 0))
        $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 255, 255))

        try {
          for ($row = 0; $row -lt $rows; $row++) {
            for ($col = 0; $col -lt $cols; $col++) {
              $x = $col * $FrameWidth
              $y = $row * $FrameHeight
              $rect = New-Object System.Drawing.Rectangle($x, $y, $FrameWidth, $FrameHeight)
              $key = "$x,$y"
              $frameIndex = ($row * $cols) + $col

              if ($Usage.ContainsKey($key)) {
                $graphics.FillRectangle($usedFillBrush, $rect)
                $graphics.DrawRectangle($usedOutlinePen, $x, $y, $FrameWidth - 1, $FrameHeight - 1)

                if ($LabelMode -eq 'FrameIndex') {
                  $label = "#$frameIndex"
                }
                else {
                  $label = "$x,$y"
                }
                $tx = $x + 4
                $ty = $y + 4
                $graphics.DrawString($label, $font, $shadowBrush, [float]($tx + 1), [float]($ty + 1))
                $graphics.DrawString($label, $font, $textBrush, [float]$tx, [float]$ty)
              }
              else {
                $graphics.DrawRectangle($unusedOutlinePen, $x, $y, $FrameWidth - 1, $FrameHeight - 1)

                if ($DrawIndexLabels) {
                  if ($LabelMode -eq 'FrameIndex') {
                    $indexLabel = "#$frameIndex"
                  }
                  else {
                    $indexLabel = "$x,$y"
                  }
                  $tx = $x + 4
                  $ty = $y + 4
                  $graphics.DrawString($indexLabel, $font, $shadowBrush, [float]($tx + 1), [float]($ty + 1))
                  $graphics.DrawString($indexLabel, $font, $textBrush, [float]$tx, [float]$ty)
                }
              }
            }
          }

          for ($x = 0; $x -le $cols; $x++) {
            $px = $x * $FrameWidth
            $graphics.DrawLine($gridPen, $px, 0, $px, $rows * $FrameHeight)
          }

          for ($y = 0; $y -le $rows; $y++) {
            $py = $y * $FrameHeight
            $graphics.DrawLine($gridPen, 0, $py, $cols * $FrameWidth, $py)
          }
        }
        finally {
          $usedFillBrush.Dispose()
          $usedOutlinePen.Dispose()
          $unusedOutlinePen.Dispose()
          $gridPen.Dispose()
          $font.Dispose()
          $shadowBrush.Dispose()
          $textBrush.Dispose()
        }
      }
      finally {
        $graphics.Dispose()
      }

      $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
      $bitmap.Dispose()
    }

    $usedCount = $Usage.Keys.Count
    $totalCells = $cols * $rows
    $unusedCount = $totalCells - $usedCount

    return [pscustomobject]@{
      Agent = $AgentName
      LabelMode = $LabelMode
      MapSize = "$mapWidth x $mapHeight"
      FrameSize = "$FrameWidth x $FrameHeight"
      Grid = "$cols x $rows"
      UsedCells = $usedCount
      UnusedCells = $unusedCount
      Output = $OutputPath
    }
  }
  finally {
    $image.Dispose()
  }
}

$agents = Get-AgentDirectories -Root $agentsRoot -Name $Agent
$results = @()

foreach ($dir in $agents) {
  $agentScriptPath = Join-Path $dir.FullName 'agent.js'
  $mapPath = Join-Path $dir.FullName 'map.png'

  if (-not (Test-Path $agentScriptPath) -or -not (Test-Path $mapPath)) {
    Write-Warning "Skipping $($dir.Name): missing agent.js or map.png"
    continue
  }

  $data = Get-AgentFrameData -AgentScriptPath $agentScriptPath
  $coordOutputPath = Join-Path $dir.FullName 'map-reference-overlay.png'
  $frameOutputPath = Join-Path $dir.FullName 'map-reference-frame-overlay.png'

  $coordResult = Draw-AgentOverlay `
    -AgentName $dir.Name `
    -MapPath $mapPath `
    -OutputPath $coordOutputPath `
    -FrameWidth $data.FrameWidth `
    -FrameHeight $data.FrameHeight `
    -Usage $data.Usage `
    -DrawIndexLabels:$IncludeIndexLabels `
    -LabelMode Coordinates

  $frameResult = Draw-AgentOverlay `
    -AgentName $dir.Name `
    -MapPath $mapPath `
    -OutputPath $frameOutputPath `
    -FrameWidth $data.FrameWidth `
    -FrameHeight $data.FrameHeight `
    -Usage $data.Usage `
    -DrawIndexLabels:$IncludeIndexLabels `
    -LabelMode FrameIndex

  $results += $coordResult
  $results += $frameResult
}

if ($results.Count -eq 0) {
  Write-Host 'No overlays generated.'
  exit 1
}

$results |
  Sort-Object Agent |
  Format-Table Agent, LabelMode, FrameSize, Grid, UsedCells, UnusedCells, Output -AutoSize
