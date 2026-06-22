# Unified Verification Runner for MatInformatics Platform

$ErrorActionPreference = "Stop"
$any_failure = $false

function Write-Header($msg) {
    Write-Host "`n==================================================" -ForegroundColor Cyan
    Write-Host ">>> $msg" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
}

function Write-SuccessMsg($msg) {
    Write-Host "[PASS] $msg" -ForegroundColor Green
}

function Write-ErrorMsg($msg) {
    Write-Host "[FAIL] $msg" -ForegroundColor Red
}

try {
    # ----------------------------------------------------
    # 1. Backend Verification
    # ----------------------------------------------------
    Write-Header "Verifying Backend Service"
    Push-Location backend
    try {
        Write-Host "Running npm install..."
        npm install
        Write-SuccessMsg "Dependencies installed."

        Write-Host "Compiling TypeScript..."
        npm run build
        Write-SuccessMsg "Build compilation succeeded."

        Write-Host "Running automated Jest tests..."
        npm test
        Write-SuccessMsg "Backend integration tests passed."
    } catch {
        Write-ErrorMsg "Backend verification failed: $_"
        $any_failure = $true
    } finally {
        Pop-Location
    }

    # ----------------------------------------------------
    # 2. ML Service Verification
    # ----------------------------------------------------
    Write-Header "Verifying ML Microservice"
    Push-Location ml-service
    try {
        if (-not (Test-Path .venv)) {
            Write-Host "Creating Python virtual environment..."
            python -m venv .venv
        }

        # Determine path to python and pip within the venv
        $venvPython = ".\.venv\Scripts\python.exe"
        $venvPip = ".\.venv\Scripts\pip.exe"
        $venvPytest = ".\.venv\Scripts\pytest.exe"

        Write-Host "Installing requirements inside venv..."
        & $venvPip install -r requirements.txt
        Write-SuccessMsg "Requirements installed."

        Write-Host "Running Python tests with pytest..."
        & $venvPytest test_main.py
        Write-SuccessMsg "ML-service tests passed."
    } catch {
        Write-ErrorMsg "ML Service verification failed: $_"
        $any_failure = $true
    } finally {
        Pop-Location
    }

    # ----------------------------------------------------
    # 3. Frontend Verification
    # ----------------------------------------------------
    Write-Header "Verifying Frontend Service"
    Push-Location frontend
    try {
        Write-Host "Running npm install..."
        npm install
        Write-SuccessMsg "Dependencies installed."

        Write-Host "Building Next.js application..."
        npm run build
        Write-SuccessMsg "Frontend Next.js build succeeded."
    } catch {
        Write-ErrorMsg "Frontend verification failed: $_"
        $any_failure = $true
    } finally {
        Pop-Location
    }

    # ----------------------------------------------------
    # Final Result
    # ----------------------------------------------------
    Write-Header "Verification Summary"
    if ($any_failure) {
        Write-ErrorMsg "One or more services failed verification checks."
        exit 1
    } else {
        Write-SuccessMsg "All services verified and passed tests successfully!"
        exit 0
    }
} catch {
    Write-ErrorMsg "An unexpected error occurred during runner execution: $_"
    exit 1
}
