@REM Maven Wrapper (somente script - baixa Maven e executa, sem JAR do wrapper)
@echo off
setlocal EnableDelayedExpansion

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "MAVEN_VERSION=3.9.6"
set "DISTRO_URL=https://repo1.maven.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip"
set "WRAPPER_DIR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper"
set "MAVEN_DIR=%WRAPPER_DIR%\apache-maven-%MAVEN_VERSION%"
set "MAVEN_ZIP=%WRAPPER_DIR%\apache-maven-%MAVEN_VERSION%-bin.zip"
set "MVN_CMD=%MAVEN_DIR%\bin\mvn.cmd"

if not exist "%MVN_CMD%" (
  echo Maven %MAVEN_VERSION% not found. Downloading...
  if not exist "%WRAPPER_DIR%" mkdir "%WRAPPER_DIR%"
  powershell -NoProfile -ExecutionPolicy Bypass -File "%WRAPPER_DIR%\download-maven.ps1" -DistroUrl "%DISTRO_URL%" -WrapperDir "%WRAPPER_DIR%" -MavenZip "%MAVEN_ZIP%"
  if errorlevel 1 (
    echo Failed to download Maven. Check your connection.
    exit /b 1
  )
  if not exist "%MVN_CMD%" (
    echo Failed to extract Maven.
    exit /b 1
  )
  echo Maven %MAVEN_VERSION% ready.
)

cd /d "%MAVEN_PROJECTBASEDIR%"
"%MVN_CMD%" %*
endlocal
