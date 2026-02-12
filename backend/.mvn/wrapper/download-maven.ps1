# Download and extract Maven for mvnw.cmd (evita problemas de parsing do batch)
param([string]$DistroUrl, [string]$WrapperDir, [string]$MavenZip)

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'Maven-Wrapper/1.0')
$wc.DownloadFile($DistroUrl, $MavenZip)
Expand-Archive -Path $MavenZip -DestinationPath $WrapperDir -Force
Remove-Item $MavenZip -Force
