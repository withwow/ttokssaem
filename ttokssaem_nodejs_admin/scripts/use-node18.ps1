$node18Directory = Join-Path $PSScriptRoot '../.tools/node-v18.20.8-win-x64'
$node18Directory = [System.IO.Path]::GetFullPath($node18Directory)
if (-not (Test-Path -LiteralPath (Join-Path $node18Directory 'node.exe'))) {
    throw 'Project Node 18 runtime is missing. See README.md for installation instructions.'
}
$env:Path = "$node18Directory;$env:Path"
node --version
npm.cmd --version
