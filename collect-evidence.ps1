$ErrorActionPreference = 'Stop'
$baseUrl = 'http://localhost:3000'

if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
    throw 'curl.exe was not found. Install/use the Windows cURL executable, then run this script again.'
}

$tests = @(
    [pscustomobject]@{ Title = '1. Successful JSON response - GET /api/courses'; Args = @('-i', "$baseUrl/api/courses") },
    [pscustomobject]@{ Title = '2. Created response - POST /api/subscribe'; Args = @('-i', '-X', 'POST', "$baseUrl/api/subscribe") },
    [pscustomobject]@{ Title = '3. Forbidden response - GET /api/admin'; Args = @('-i', "$baseUrl/api/admin") },
    [pscustomobject]@{ Title = '4. Redirect response - GET /old-page'; Args = @('-i', "$baseUrl/old-page") },
    [pscustomobject]@{ Title = '5. API 404 response'; Args = @('-i', "$baseUrl/api/does-not-exist") },
    [pscustomobject]@{ Title = '6. Non-API 404 response'; Args = @('-i', "$baseUrl/does-not-exist") }
)

$evidence = foreach ($test in $tests) {
    "===== $($test.Title) ====="
    $curlArguments = $test.Args
    & curl.exe @curlArguments 2>&1
    ''
}

$evidence | Set-Content -Path 'CURL_EVIDENCE.txt' -Encoding utf8
Write-Host 'Evidence saved to CURL_EVIDENCE.txt. Copy each actual output block into the matching README section.' -ForegroundColor Green
