# Configuración
$port = 4200
$serverPort = 5000

try {
    # Verifica si ngrok está instalado
    if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
        throw "Ngrok no está instalado. Por favor, instálalo primero."
    }

    Write-Host "Iniciando ngrok para el puerto $port..."

    # Inicia ngrok y captura su salida
    $ngrokProcess = Start-Process ngrok -ArgumentList "http", $port, "--log=stdout" -NoNewWindow -PassThru -RedirectStandardOutput "ngrok.log"

    # Espera un momento para que ngrok se inicie
    Start-Sleep -Seconds 2

    # Obtiene la URL de la API de ngrok
    $tunnels = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
    $ngrokUrl = $tunnels.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -ExpandProperty public_url

    if (-not $ngrokUrl) {
        throw "No se pudo obtener la URL de ngrok"
    }

    Write-Host "Ngrok URL: $ngrokUrl"

    # Configura el servidor HTTP
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$serverPort/")
    $listener.Start()

    Write-Host "Servidor escuchando en http://localhost:$serverPort/"

    # Variable para controlar el bucle
    $running = $true

    # Registra el handler para Ctrl+C
    $handler = {
        $script:running = $false
        Write-Host "`nDeteniendo el servidor..."
    }
    Register-ObjectEvent -InputObject ([Console]) -EventName CancelKeyPress -Action $handler | Out-Null

    while ($running -and $listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response

        try {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.ContentType = "application/json"
            $response.StatusCode = 200

            $responseJson = @{
                ngrokUrl = $ngrokUrl
                timestamp = Get-Date -Format "o"
            } | ConvertTo-Json

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($responseJson)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        catch {
            Write-Host "Error al procesar la solicitud: $_"
        }
        finally {
            $response.Close()
        }
    }
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
finally {
    # Limpieza
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }

    if ($ngrokProcess -and -not $ngrokProcess.HasExited) {
        Stop-Process -Id $ngrokProcess.Id -Force
    }

    # Elimina el archivo de log temporal
    if (Test-Path "ngrok.log") {
        Remove-Item "ngrok.log"
    }

    Write-Host "Servidor detenido y recursos liberados."
}
