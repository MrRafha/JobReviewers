$base='http://localhost:3000'
$results=@()
function Add-Result($name,$ok,$detail){ $global:results += [pscustomobject]@{Check=$name;Status=($(if($ok){'PASS'}else{'FAIL'}));Detail=$detail} }
$pages=@('/','/login','/register','/forgot-password','/reset-password/token-teste','/reviews/new')
foreach($p in $pages){
  try{ $r=Invoke-WebRequest -Uri ($base+$p) -UseBasicParsing -TimeoutSec 25; Add-Result "GET $p" ($r.StatusCode -eq 200) ("HTTP " + $r.StatusCode) }
  catch{ Add-Result "GET $p" $false $_.Exception.Message }
}
try{ $r=Invoke-WebRequest -Uri ($base+'/api/companies') -UseBasicParsing -TimeoutSec 25; $isJson=($r.Content.Trim().StartsWith('[') -or $r.Content.Trim().StartsWith('{')); Add-Result 'GET /api/companies' ($r.StatusCode -eq 200 -and $isJson) ("HTTP " + $r.StatusCode) }
catch{ Add-Result 'GET /api/companies' $false $_.Exception.Message }
try{ $r=Invoke-WebRequest -Uri ($base+'/api/reviews') -UseBasicParsing -TimeoutSec 25; $isJson=($r.Content.Trim().StartsWith('[') -or $r.Content.Trim().StartsWith('{')); Add-Result 'GET /api/reviews' ($r.StatusCode -eq 200 -and $isJson) ("HTTP " + $r.StatusCode) }
catch{ Add-Result 'GET /api/reviews' $false $_.Exception.Message }
try{ $body=@{email='qa-check@example.com'} | ConvertTo-Json; $r=Invoke-WebRequest -Uri ($base+'/api/auth/forgot-password') -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing -TimeoutSec 25; $ok=($r.StatusCode -eq 200 -and $r.Content -match 'success'); Add-Result 'POST /api/auth/forgot-password' $ok ("HTTP " + $r.StatusCode) }
catch{ Add-Result 'POST /api/auth/forgot-password' $false $_.Exception.Message }
try{ $body=@{token='token-invalido'; password='12345678'} | ConvertTo-Json; $r=Invoke-WebRequest -Uri ($base+'/api/auth/reset-password') -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing -TimeoutSec 25; $ok=($r.StatusCode -eq 200 -and $r.Content -match 'Senha redefinida com sucesso'); Add-Result 'POST /api/auth/reset-password' $ok ("HTTP " + $r.StatusCode) }
catch{ Add-Result 'POST /api/auth/reset-password' $false $_.Exception.Message }
$results | Format-Table -AutoSize | Out-String | Write-Output
