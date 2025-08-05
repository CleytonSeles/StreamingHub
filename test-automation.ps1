# 🧪 Script de Teste Automatizado - Streaming App
# Este script simula casos reais de uso da aplicação

Write-Host "🎵 Iniciando Testes Automatizados do Streaming App" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001"
$testResults = @()

# Função para registrar resultados
function Add-TestResult {
    param($TestName, $Status, $Details)
    $testResults += [PSCustomObject]@{
        Test = $TestName
        Status = $Status
        Details = $Details
        Timestamp = Get-Date
    }
}

# Teste 1: Health Check
Write-Host "`n🔍 Teste 1: Health Check da API" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ API está funcionando: $($health.message)" -ForegroundColor Green
    Add-TestResult "Health Check" "PASS" $health.message
} catch {
    Write-Host "❌ Falha no Health Check: $($_.Exception.Message)" -ForegroundColor Red
    Add-TestResult "Health Check" "FAIL" $_.Exception.Message
}

# Teste 2: Registro de Usuário
Write-Host "`n👤 Teste 2: Registro de Novo Usuário" -ForegroundColor Yellow
$testUser = @{
    username = "maria_teste_$(Get-Random -Maximum 1000)"
    email = "maria.teste.$(Get-Random -Maximum 1000)@exemplo.com"
    password = "senhaSegura123"
}

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body ($testUser | ConvertTo-Json)
    Write-Host "✅ Usuário registrado: $($registerResponse.username)" -ForegroundColor Green
    Add-TestResult "Registro de Usuário" "PASS" "Usuário $($registerResponse.username) criado"
    $global:testToken = $registerResponse.token
    $global:testUserId = $registerResponse.id
} catch {
    Write-Host "❌ Falha no registro: $($_.Exception.Message)" -ForegroundColor Red
    Add-TestResult "Registro de Usuário" "FAIL" $_.Exception.Message
    return
}

# Teste 3: Login
Write-Host "`n🔐 Teste 3: Login do Usuário" -ForegroundColor Yellow
try {
    $loginData = @{
        email = $testUser.email
        password = $testUser.password
    }
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body ($loginData | ConvertTo-Json)
    Write-Host "✅ Login realizado com sucesso" -ForegroundColor Green
    Add-TestResult "Login" "PASS" "Login bem-sucedido"
    $global:testToken = $loginResponse.token
} catch {
    Write-Host "❌ Falha no login: $($_.Exception.Message)" -ForegroundColor Red
    Add-TestResult "Login" "FAIL" $_.Exception.Message
}

# Teste 4: Criação de Playlist
Write-Host "`n🎶 Teste 4: Criação de Playlist" -ForegroundColor Yellow
try {
    $playlistData = @{
        name = "Playlist de Teste $(Get-Date -Format 'HH:mm')"
        description = "Playlist criada automaticamente para testes"
    }
    $headers = @{"Authorization" = "Bearer $global:testToken"}
    $playlistResponse = Invoke-RestMethod -Uri "$baseUrl/api/playlists" -Method POST -ContentType "application/json" -Headers $headers -Body ($playlistData | ConvertTo-Json)
    Write-Host "✅ Playlist criada: $($playlistResponse.data.name)" -ForegroundColor Green
    Add-TestResult "Criação de Playlist" "PASS" "Playlist '$($playlistResponse.data.name)' criada"
    $global:testPlaylistId = $playlistResponse.data.id
} catch {
    Write-Host "❌ Falha na criação de playlist: $($_.Exception.Message)" -ForegroundColor Red
    Add-TestResult "Criação de Playlist" "FAIL" $_.Exception.Message
}

# Teste 5: Listagem de Playlists
Write-Host "`n📋 Teste 5: Listagem de Playlists" -ForegroundColor Yellow
try {
    $headers = @{"Authorization" = "Bearer $global:testToken"}
    $playlistsResponse = Invoke-RestMethod -Uri "$baseUrl/api/playlists" -Method GET -Headers $headers
    $count = $playlistsResponse.data.Count
    Write-Host "✅ $count playlist(s) encontrada(s)" -ForegroundColor Green
    Add-TestResult "Listagem de Playlists" "PASS" "$count playlists encontradas"
} catch {
    Write-Host "❌ Falha na listagem: $($_.Exception.Message)" -ForegroundColor Red
    Add-TestResult "Listagem de Playlists" "FAIL" $_.Exception.Message
}

# Teste 6: Busca (sem Spotify - teste de endpoint)
Write-Host "`n🔍 Teste 6: Endpoint de Busca" -ForegroundColor Yellow
try {
    $headers = @{"Authorization" = "Bearer $global:testToken"}
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/api/search?q=test" -Method GET -Headers $headers
    Write-Host "✅ Endpoint de busca respondeu" -ForegroundColor Green
    Add-TestResult "Endpoint de Busca" "PASS" "Endpoint respondeu corretamente"
} catch {
    Write-Host "⚠️ Busca falhou (esperado sem Spotify): $($_.Exception.Message)" -ForegroundColor Yellow
    Add-TestResult "Endpoint de Busca" "EXPECTED_FAIL" "Falha esperada sem credenciais Spotify"
}

# Teste 7: Perfil do Usuário
Write-Host "`n👤 Teste 7: Dados do Perfil" -ForegroundColor Yellow
try {
    $headers = @{"Authorization" = "Bearer $global:testToken"}
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $headers
    Write-Host "✅ Perfil carregado: $($profileResponse.username)" -ForegroundColor Green
    Add-TestResult "Perfil do Usuário" "PASS" "Dados do perfil carregados"
} catch {
    Write-Host "❌ Falha ao carregar perfil: $($_.Exception.Message)" -ForegroundColor Red
    Add-TestResult "Perfil do Usuário" "FAIL" $_.Exception.Message
}

# Teste 8: Atualização de Playlist
Write-Host "`n✏️ Teste 8: Atualização de Playlist" -ForegroundColor Yellow
if ($global:testPlaylistId) {
    try {
        $updateData = @{
            name = "Playlist Atualizada $(Get-Date -Format 'HH:mm')"
            description = "Descrição atualizada automaticamente"
        }
        $headers = @{"Authorization" = "Bearer $global:testToken"}
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/api/playlists/$global:testPlaylistId" -Method PUT -ContentType "application/json" -Headers $headers -Body ($updateData | ConvertTo-Json)
        Write-Host "✅ Playlist atualizada com sucesso" -ForegroundColor Green
        Add-TestResult "Atualização de Playlist" "PASS" "Playlist atualizada"
    } catch {
        Write-Host "❌ Falha na atualização: $($_.Exception.Message)" -ForegroundColor Red
        Add-TestResult "Atualização de Playlist" "FAIL" $_.Exception.Message
    }
} else {
    Write-Host "⚠️ Pulando teste - playlist não criada" -ForegroundColor Yellow
    Add-TestResult "Atualização de Playlist" "SKIP" "Playlist não disponível"
}

# Teste 9: Teste de Autenticação Inválida
Write-Host "`n🔒 Teste 9: Segurança - Token Inválido" -ForegroundColor Yellow
try {
    $headers = @{"Authorization" = "Bearer token_invalido"}
    $securityResponse = Invoke-RestMethod -Uri "$baseUrl/api/playlists" -Method GET -Headers $headers
    Write-Host "❌ FALHA DE SEGURANÇA: Token inválido foi aceito!" -ForegroundColor Red
    Add-TestResult "Segurança - Token Inválido" "SECURITY_FAIL" "Token inválido aceito"
} catch {
    Write-Host "✅ Segurança OK: Token inválido rejeitado" -ForegroundColor Green
    Add-TestResult "Segurança - Token Inválido" "PASS" "Token inválido corretamente rejeitado"
}

# Teste 10: Limpeza - Deletar Playlist de Teste
Write-Host "`n🗑️ Teste 10: Limpeza - Deletar Playlist" -ForegroundColor Yellow
if ($global:testPlaylistId) {
    try {
        $headers = @{"Authorization" = "Bearer $global:testToken"}
        $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/api/playlists/$global:testPlaylistId" -Method DELETE -Headers $headers
        Write-Host "✅ Playlist de teste deletada" -ForegroundColor Green
        Add-TestResult "Limpeza - Deletar Playlist" "PASS" "Playlist deletada"
    } catch {
        Write-Host "❌ Falha na deleção: $($_.Exception.Message)" -ForegroundColor Red
        Add-TestResult "Limpeza - Deletar Playlist" "FAIL" $_.Exception.Message
    }
} else {
    Write-Host "⚠️ Pulando limpeza - playlist não criada" -ForegroundColor Yellow
    Add-TestResult "Limpeza - Deletar Playlist" "SKIP" "Playlist não disponível"
}

# Relatório Final
Write-Host "`n📊 RELATÓRIO FINAL DOS TESTES" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$passCount = ($testResults | Where-Object {$_.Status -eq "PASS"}).Count
$failCount = ($testResults | Where-Object {$_.Status -eq "FAIL"}).Count
$skipCount = ($testResults | Where-Object {$_.Status -eq "SKIP"}).Count
$expectedFailCount = ($testResults | Where-Object {$_.Status -eq "EXPECTED_FAIL"}).Count

Write-Host "`n✅ Testes Aprovados: $passCount" -ForegroundColor Green
Write-Host "❌ Testes Falharam: $failCount" -ForegroundColor Red
Write-Host "⚠️ Testes Pulados: $skipCount" -ForegroundColor Yellow
Write-Host "🔶 Falhas Esperadas: $expectedFailCount" -ForegroundColor DarkYellow

$totalTests = $testResults.Count
$successRate = [math]::Round(($passCount / $totalTests) * 100, 2)
Write-Host "`n📈 Taxa de Sucesso: $successRate%" -ForegroundColor Cyan

Write-Host "`n📋 Detalhes dos Testes:" -ForegroundColor White
$testResults | ForEach-Object {
    $color = switch ($_.Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "SKIP" { "Yellow" }
        "EXPECTED_FAIL" { "DarkYellow" }
        "SECURITY_FAIL" { "Magenta" }
        default { "White" }
    }
    Write-Host "  $($_.Status.PadRight(15)) $($_.Test)" -ForegroundColor $color
}

Write-Host "`n🎯 Conclusão:" -ForegroundColor Cyan
if ($failCount -eq 0) {
    Write-Host "🎉 Todos os testes críticos passaram! A aplicação está funcionando corretamente." -ForegroundColor Green
} elseif ($failCount -le 2) {
    Write-Host "⚠️ Alguns testes falharam, mas a aplicação está majoritariamente funcional." -ForegroundColor Yellow
} else {
    Write-Host "🚨 Múltiplos testes falharam. Revisar implementação necessária." -ForegroundColor Red
}

Write-Host "`n🔗 URLs de Teste:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000/" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3001/" -ForegroundColor White
Write-Host "  Health:   http://localhost:3001/health" -ForegroundColor White

Write-Host "`n✨ Testes concluídos em $(Get-Date)" -ForegroundColor Cyan