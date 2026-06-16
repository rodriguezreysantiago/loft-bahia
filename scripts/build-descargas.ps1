# Copia las piezas a site/public/descargas (servidas por el sitio) y arma el ZIP.
# Correr desde la raiz del repo:  & .\scripts\build-descargas.ps1
$root = Split-Path $PSScriptRoot -Parent
$src  = Join-Path $root 'pieces'
$dst  = Join-Path $root 'site\public\descargas'
$folders = 'historias', 'carrusel', 'posts', 'flyer', 'qr'

New-Item -ItemType Directory -Force -Path $dst | Out-Null
foreach ($f in $folders) {
  robocopy (Join-Path $src $f) (Join-Path $dst $f) /MIR /NJH /NJS /NFL /NDL | Out-Null
}

$zip = Join-Path $dst 'loft-bahia-redes.zip'
$paths = $folders | ForEach-Object { Join-Path $src $_ }
Compress-Archive -Path $paths -DestinationPath $zip -Force

Write-Output ("OK -> {0}" -f $dst)
exit 0
