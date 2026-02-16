param(
  [string]$Agent = 'F1',
  [string]$Animation = 'Explain',
  [ValidateSet('Both', 'FrameIndex', 'Coordinates')]
  [string]$LabelMode = 'Both'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function Get-CellIndexFromImageRef {
  param(
    [object]$ImageRef,
    [int]$FrameWidth,
    [int]$FrameHeight,
    [int]$Cols
  )

  if ($null -eq $ImageRef) {
    return $null
  }

  if ($ImageRef -is [int] -or $ImageRef -is [long]) {
    return [int]$ImageRef
  }

  if ($ImageRef -is [System.Collections.IList] -and $ImageRef.Count -ge 2) {
    $x = [int]$ImageRef[0]
    $y = [int]$ImageRef[1]
    if ($x -lt 0 -or $y -lt 0) {
      return $null
    }

    if (($x % $FrameWidth) -ne 0 -or ($y % $FrameHeight) -ne 0) {
      return $null
    }

    $col = [int]($x / $FrameWidth)
    $row = [int]($y / $FrameHeight)
    return [int](($row * $Cols) + $col)
  }

  return $null
}

function Get-TimelineCellIndex {
  param(
    [object]$Frame,
    [int]$FrameWidth,
    [int]$FrameHeight,
    [int]$Cols
  )

  if ($null -eq $Frame) {
    return $null
  }

  if (-not ($Frame.PSObject.Properties.Name -contains 'images')) {
    return $null
  }

  $images = $Frame.images
  if ($null -eq $images) {
    return $null
  }

  foreach ($imageRef in $images) {
    $cellIndex = Get-CellIndexFromImageRef -ImageRef $imageRef -FrameWidth $FrameWidth -FrameHeight $FrameHeight -Cols $Cols
    if ($null -ne $cellIndex) {
      return [int]$cellIndex
    }
  }

  return $null
}

function Get-GridLabel {
  param(
    [int]$CellIndex,
    [int]$Cols,
    [int]$FrameWidth,
    [int]$FrameHeight,
    [string]$Mode
  )

  if ($Mode -eq 'FrameIndex') {
    return "#$CellIndex"
  }

  $col = [int]($CellIndex % $Cols)
  $row = [int][Math]::Floor($CellIndex / $Cols)
  $x = $col * $FrameWidth
  $y = $row * $FrameHeight
  return "$x,$y"
}

function Get-TimelineLabel {
  param(
    [int]$FrameIndex,
    [string]$Mode,
    [System.Collections.IList]$Frames,
    [int]$FrameWidth,
    [int]$FrameHeight,
    [int]$Cols
  )

  if ($FrameIndex -lt 0 -or $FrameIndex -ge $Frames.Count) {
    return '(end)'
  }

  $cellIndex = Get-TimelineCellIndex -Frame $Frames[$FrameIndex] -FrameWidth $FrameWidth -FrameHeight $FrameHeight -Cols $Cols
  if ($null -eq $cellIndex) {
    return "n/a(t#$FrameIndex)"
  }

  return (Get-GridLabel -CellIndex $cellIndex -Cols $Cols -FrameWidth $FrameWidth -FrameHeight $FrameHeight -Mode $Mode)
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$agentDir = Join-Path $repoRoot "assets/agents/$Agent"
$agentScriptPath = Join-Path $agentDir 'agent.js'
$mapPath = Join-Path $agentDir 'map.png'

if (-not (Test-Path $agentScriptPath)) {
  throw "agent.js not found for agent '$Agent': $agentScriptPath"
}

if (-not (Test-Path $mapPath)) {
  throw "map.png not found for agent '$Agent': $mapPath"
}

$nodeScript = @'
const fs = require("fs");

const [agentScriptPath, animationName, mapWidthArg] = process.argv.slice(2);
const script = fs.readFileSync(agentScriptPath, "utf8");

let definition = null;
const clippy = {
  ready: (_name, def) => {
    definition = def;
  },
  soundsReady: () => {},
};

new Function("clippy", script)(clippy);

if (!definition) {
  throw new Error("Could not read agent definition from script");
}

const animation = definition.animations?.[animationName];
if (!animation) {
  throw new Error(`Animation not found: ${animationName}`);
}

const frames = animation.frames || [];
const frameWidth = Number(definition.framesize?.[0] || 1);
const frameHeight = Number(definition.framesize?.[1] || 1);
const mapWidth = Number(mapWidthArg || 0);
const mapColumns = Math.max(
  1,
  Math.floor(mapWidth > 0 ? mapWidth / frameWidth : 1),
);

function toImageFrameNumber(imageRef) {
  if (typeof imageRef === "number") {
    return imageRef;
  }

  if (Array.isArray(imageRef) && imageRef.length >= 2) {
    const x = Number(imageRef[0]);
    const y = Number(imageRef[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return null;
    }

    if (x < 0 || y < 0 || x % frameWidth !== 0 || y % frameHeight !== 0) {
      return null;
    }

    const col = x / frameWidth;
    const row = Math.floor(y / frameHeight);
    return row * mapColumns + col;
  }

  return null;
}

const imageFrameToTimelineIndices = new Map();
if (animation.branchTargetMode === "imageFrame") {
  for (let i = 0; i < frames.length; i += 1) {
    const refs = frames[i]?.images || [];
    for (const imageRef of refs) {
      const imageFrame = toImageFrameNumber(imageRef);
      if (!Number.isFinite(imageFrame)) {
        continue;
      }

      const existing = imageFrameToTimelineIndices.get(imageFrame);
      if (!existing) {
        imageFrameToTimelineIndices.set(imageFrame, [i]);
        continue;
      }

      if (existing[existing.length - 1] !== i) {
        existing.push(i);
      }
    }
  }
}

function resolveTarget(target, currentIndex) {
  const numericTarget = Number(target);
  if (!Number.isFinite(numericTarget)) {
    return null;
  }

  if (animation.branchTargetMode !== "imageFrame") {
    return numericTarget;
  }

  const matches = imageFrameToTimelineIndices.get(numericTarget) || [];
  if (matches.length === 0) {
    return null;
  }

  const forward = matches.find((index) => index > currentIndex);
  return forward ?? matches[0];
}

function getTransitions(index) {
  const frame = frames[index];
  if (!frame) {
    return [];
  }

  const transitions = [];
  const branches = frame.branching?.branches || [];
  let cumulative = 0;

  let unresolvedProbability = 0;

  for (const branch of branches) {
    const weight = Number(branch.weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      continue;
    }

    const start = Math.max(0, Math.min(100, cumulative));
    cumulative += weight;
    const end = Math.max(0, Math.min(100, cumulative));
    const probability = (end - start) / 100;

    if (probability > 0) {
      const resolved = resolveTarget(branch.frameIndex, index);
      if (!Number.isFinite(resolved)) {
        unresolvedProbability += probability;
        continue;
      }

      transitions.push({
        to: resolved,
        probability,
      });
    }
  }

  const fallbackProbability =
    Math.max(0, 1 - Math.min(100, cumulative) / 100) + unresolvedProbability;
  if (fallbackProbability > 0) {
    const fallbackTarget =
      typeof frame.exitBranch === "number" ? frame.exitBranch : index + 1;
    const fallback = resolveTarget(fallbackTarget, index);
    if (!Number.isFinite(fallback)) {
      return transitions;
    }

    transitions.push({
      to: fallback,
      probability: fallbackProbability,
    });
  }

  return transitions.filter(
    (t) => Number.isFinite(t.to) && Number.isFinite(t.probability) && t.probability > 0,
  );
}

const reachable = new Set([0]);
const queue = [0];
while (queue.length > 0) {
  const current = queue.shift();
  for (const next of getTransitions(current)) {
    if (next.to >= 0 && next.to < frames.length && !reachable.has(next.to)) {
      reachable.add(next.to);
      queue.push(next.to);
    }
  }
}

const maxDepth = Math.max(10, frames.length + 5);
const paths = [];

function walk(index, probability, path, visits) {
  if (index < 0 || index >= frames.length) {
    paths.push({ indices: path, probability });
    return;
  }

  if (path.length >= maxDepth) {
    paths.push({ indices: path.concat([index]), probability, truncated: true });
    return;
  }

  const nextVisits = new Map(visits);
  const seen = (nextVisits.get(index) || 0) + 1;
  nextVisits.set(index, seen);
  if (seen > 3) {
    paths.push({ indices: path.concat([index]), probability, truncated: true });
    return;
  }

  const nextPath = path.concat([index]);
  const transitions = getTransitions(index);
  if (transitions.length === 0) {
    paths.push({ indices: nextPath, probability });
    return;
  }

  for (const transition of transitions) {
    walk(
      transition.to,
      probability * transition.probability,
      nextPath,
      nextVisits,
    );
  }
}

walk(0, 1, [], new Map());

const unreachable = [];
for (let i = 0; i < frames.length; i += 1) {
  if (!reachable.has(i)) {
    unreachable.push(i);
  }
}

paths.sort((a, b) => b.probability - a.probability);

console.log(
  JSON.stringify({
    frameSize: definition.framesize,
    frames,
    paths,
    reachable: Array.from(reachable).sort((a, b) => a - b),
    unreachable,
  }),
);
'@

$tempNodePath = Join-Path ([System.IO.Path]::GetTempPath()) ("animation-flow-" + [System.Guid]::NewGuid().ToString("N") + ".cjs")
Set-Content -Path $tempNodePath -Value $nodeScript -Encoding UTF8

$mapMetaImage = [System.Drawing.Image]::FromFile($mapPath)
$mapWidthForFlow = [int]$mapMetaImage.Width
$mapMetaImage.Dispose()

try {
  $json = & node $tempNodePath $agentScriptPath $Animation $mapWidthForFlow
}
finally {
  if (Test-Path $tempNodePath) {
    Remove-Item $tempNodePath -Force
  }
}

if (-not $json) {
  throw "Failed to compute animation flow data."
}

$data = $json | ConvertFrom-Json

$frameWidth = [int]$data.frameSize[0]
$frameHeight = [int]$data.frameSize[1]

$image = [System.Drawing.Image]::FromFile($mapPath)
try {
  $mapWidth = [int]$image.Width
  $mapHeight = [int]$image.Height
  $cols = [Math]::Max(1, [int][Math]::Floor($mapWidth / $frameWidth))
  $rows = [Math]::Max(1, [int][Math]::Floor($mapHeight / $frameHeight))

  $usedTimeline = New-Object 'System.Collections.Generic.HashSet[int]'
  $unusedTimeline = New-Object 'System.Collections.Generic.HashSet[int]'
  foreach ($i in $data.reachable) { [void]$usedTimeline.Add([int]$i) }
  foreach ($i in $data.unreachable) { [void]$unusedTimeline.Add([int]$i) }

  $usedCells = New-Object 'System.Collections.Generic.HashSet[int]'
  $unusedCells = New-Object 'System.Collections.Generic.HashSet[int]'

  for ($i = 0; $i -lt $data.frames.Count; $i++) {
    $frame = $data.frames[$i]
    $isReachable = $usedTimeline.Contains($i)
    $cellIndex = Get-TimelineCellIndex -Frame $frame -FrameWidth $frameWidth -FrameHeight $frameHeight -Cols $cols
    if ($null -eq $cellIndex) {
      continue
    }

    if ($isReachable) {
      [void]$usedCells.Add([int]$cellIndex)
    }
    else {
      [void]$unusedCells.Add([int]$cellIndex)
    }
  }

  $modes = @()
  if ($LabelMode -eq 'Both') {
    $modes = @('FrameIndex', 'Coordinates')
  }
  else {
    $modes = @($LabelMode)
  }

  foreach ($mode in $modes) {
    $panelWidth = if ($mode -eq 'Coordinates') { [int]1250 } else { [int]980 }
    $canvasWidth = [int]$mapWidth + [int]$panelWidth
    $canvasHeight = [int]$mapHeight
    $canvas = New-Object System.Drawing.Bitmap($canvasWidth, $canvasHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($canvas)
      try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.Clear([System.Drawing.Color]::FromArgb(18, 18, 18))
        $graphics.DrawImage($image, 0, 0, $mapWidth, $mapHeight)

        $usedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(88, 0, 184, 108))
        $unusedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(104, 194, 29, 52))
        $mixedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(110, 214, 153, 0))
        $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(44, 255, 255, 255), 1)
        $strongPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(170, 255, 255, 255), 1)
        $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 245, 245, 245))
        $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 190, 190, 190))
        $titleFont = New-Object System.Drawing.Font('Consolas', 20, [System.Drawing.FontStyle]::Bold)
        $bodyFont = New-Object System.Drawing.Font('Consolas', 12, [System.Drawing.FontStyle]::Regular)
        $smallFont = New-Object System.Drawing.Font('Consolas', 10, [System.Drawing.FontStyle]::Regular)
        $indexFontSize = [Math]::Max(8, [Math]::Floor([Math]::Min($frameWidth, $frameHeight) / 6))
        $indexFont = New-Object System.Drawing.Font('Consolas', [float]$indexFontSize, [System.Drawing.FontStyle]::Bold)
        $indexShadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 0, 0, 0))
        $indexUsedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 230, 255, 240))
        $indexUnusedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 220, 225))
        $indexMixedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 245, 205))
        $indexDefaultBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(155, 235, 235, 235))

        try {
          for ($row = 0; $row -lt $rows; $row++) {
            for ($col = 0; $col -lt $cols; $col++) {
              $cellIndex = ($row * $cols) + $col
              $x = $col * $frameWidth
              $y = $row * $frameHeight
              $rect = New-Object System.Drawing.Rectangle($x, $y, $frameWidth, $frameHeight)
              $isUsed = $usedCells.Contains($cellIndex)
              $isUnused = $unusedCells.Contains($cellIndex)

              if ($isUsed -and $isUnused) {
                $graphics.FillRectangle($mixedBrush, $rect)
                $graphics.DrawRectangle($strongPen, $x, $y, $frameWidth - 1, $frameHeight - 1)
              }
              elseif ($isUsed) {
                $graphics.FillRectangle($usedBrush, $rect)
                $graphics.DrawRectangle($strongPen, $x, $y, $frameWidth - 1, $frameHeight - 1)
              }
              elseif ($isUnused) {
                $graphics.FillRectangle($unusedBrush, $rect)
                $graphics.DrawRectangle($strongPen, $x, $y, $frameWidth - 1, $frameHeight - 1)
              }
              else {
                $graphics.DrawRectangle($gridPen, $x, $y, $frameWidth - 1, $frameHeight - 1)
              }

              $cellLabel = Get-GridLabel -CellIndex $cellIndex -Cols $cols -FrameWidth $frameWidth -FrameHeight $frameHeight -Mode $mode
              $tx = $x + 3
              $ty = $y + 3
              $indexBrush = $indexDefaultBrush
              if ($isUsed -and $isUnused) {
                $indexBrush = $indexMixedBrush
              }
              elseif ($isUsed) {
                $indexBrush = $indexUsedBrush
              }
              elseif ($isUnused) {
                $indexBrush = $indexUnusedBrush
              }

              $graphics.DrawString($cellLabel, $indexFont, $indexShadowBrush, [float]($tx + 1), [float]($ty + 1))
              $graphics.DrawString($cellLabel, $indexFont, $indexBrush, [float]$tx, [float]$ty)
            }
          }

          $modeTitle = if ($mode -eq 'FrameIndex') { 'Frame #' } else { 'Pixel coordinates' }
          $panelX = $mapWidth + 24
          $y = 20

          $graphics.DrawString("Animation Flow Overlay", $titleFont, $textBrush, [float]$panelX, [float]$y)
          $y += 34
          $graphics.DrawString("$Agent :: $Animation", $bodyFont, $textBrush, [float]$panelX, [float]$y)
          $y += 22
          $graphics.DrawString("Reference mode: $modeTitle", $smallFont, $mutedBrush, [float]$panelX, [float]$y)
          $y += 24

          $graphics.DrawString("Legend", $bodyFont, $textBrush, [float]$panelX, [float]$y)
          $y += 20
          $graphics.FillRectangle($usedBrush, $panelX, $y + 2, 16, 12)
          $graphics.DrawString("Used by reachable timeline frames", $smallFont, $mutedBrush, [float]($panelX + 24), [float]$y)
          $y += 18
          $graphics.FillRectangle($unusedBrush, $panelX, $y + 2, 16, 12)
          $graphics.DrawString("Only used by unreachable timeline frames", $smallFont, $mutedBrush, [float]($panelX + 24), [float]$y)
          $y += 18
          $graphics.FillRectangle($mixedBrush, $panelX, $y + 2, 16, 12)
          $graphics.DrawString("Shared by reachable + unreachable frames", $smallFont, $mutedBrush, [float]($panelX + 24), [float]$y)
          $y += 28

          $sequenceTitle = if ($mode -eq 'FrameIndex') {
            'Possible sequences (image frame#)'
          }
          else {
            'Possible sequences (first image pixel)'
          }
          $graphics.DrawString($sequenceTitle, $bodyFont, $textBrush, [float]$panelX, [float]$y)
          $y += 20

          $maxPathLines = 14
          $pathCount = 0
          foreach ($path in $data.paths) {
            if ($pathCount -ge $maxPathLines) { break }
            $probability = [double]$path.probability * 100.0
            $labels = @()
            foreach ($idx in $path.indices) {
              $labels += (Get-TimelineLabel -FrameIndex ([int]$idx) -Mode $mode -Frames $data.frames -FrameWidth $frameWidth -FrameHeight $frameHeight -Cols $cols)
            }
            $line = "{0,6:N2}%  {1}" -f $probability, ($labels -join ' -> ')
            $isTruncated = $false
            if ($path.PSObject.Properties.Name -contains 'truncated') {
              $isTruncated = [bool]$path.truncated
            }
            if ($isTruncated) {
              $line = "$line  ..."
            }
            $graphics.DrawString($line, $smallFont, $textBrush, [float]$panelX, [float]$y)
            $y += 16
            $pathCount += 1
          }

          $y += 14
          $graphics.DrawString("Reachable timeline frames", $bodyFont, $textBrush, [float]$panelX, [float]$y)
          $y += 18
          $reachableLabels = @()
          foreach ($idx in $data.reachable) {
            $reachableLabels += (Get-TimelineLabel -FrameIndex ([int]$idx) -Mode $mode -Frames $data.frames -FrameWidth $frameWidth -FrameHeight $frameHeight -Cols $cols)
          }
          $reachableLine = ($reachableLabels -join ', ')
          $graphics.DrawString($reachableLine, $smallFont, $mutedBrush, [float]$panelX, [float]$y)
          $y += 30

          $graphics.DrawString("Not used (unreachable) timeline frames", $bodyFont, $textBrush, [float]$panelX, [float]$y)
          $y += 18
          $unreachableLabels = @()
          foreach ($idx in $data.unreachable) {
            $unreachableLabels += (Get-TimelineLabel -FrameIndex ([int]$idx) -Mode $mode -Frames $data.frames -FrameWidth $frameWidth -FrameHeight $frameHeight -Cols $cols)
          }
          $unreachableLine = ($unreachableLabels -join ', ')
          if ([string]::IsNullOrWhiteSpace($unreachableLine)) {
            $unreachableLine = '(none)'
          }
          $graphics.DrawString($unreachableLine, $smallFont, $mutedBrush, [float]$panelX, [float]$y)
        }
        finally {
          $usedBrush.Dispose()
          $unusedBrush.Dispose()
          $mixedBrush.Dispose()
          $gridPen.Dispose()
          $strongPen.Dispose()
          $textBrush.Dispose()
          $mutedBrush.Dispose()
          $titleFont.Dispose()
          $bodyFont.Dispose()
          $smallFont.Dispose()
          $indexFont.Dispose()
          $indexShadowBrush.Dispose()
          $indexUsedBrush.Dispose()
          $indexUnusedBrush.Dispose()
          $indexMixedBrush.Dispose()
          $indexDefaultBrush.Dispose()
        }
      }
      finally {
        $graphics.Dispose()
      }

      $suffix = if ($mode -eq 'FrameIndex') { 'frame' } else { 'coordinates' }
      $outputPath = Join-Path $agentDir ("$($Animation.ToLowerInvariant())-flow-overlay-$suffix.png")
      $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Host "Generated: $outputPath"
    }
    finally {
      $canvas.Dispose()
    }
  }
}
finally {
  $image.Dispose()
}
