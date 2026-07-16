$dataPath = "F:\cloud study\course-data.js"
$content = Get-Content -Path $dataPath -Raw

# Load markdown files and convert to JSON object properties
$notesObj = @{}
$files = Get-ChildItem -Path "F:\cloud study" -Filter "module-*.md"
foreach ($file in $files) {
    # Extract ID from filename (e.g. module-01)
    if ($file.BaseName -match "^(module-\d+)") {
        $id = $Matches[1]
        $text = Get-Content -Path $file.FullName -Raw
        $notesObj[$id] = $text
        Write-Host "Read: $id"
    }
}

# Also add final-section-study-resources.md
$finalFile = "F:\cloud study\final-section-study-resources.md"
if (Test-Path $finalFile) {
    $text = Get-Content -Path $finalFile -Raw
    $notesObj["final-resources"] = $text
    Write-Host "Read: final-resources"
}

# Convert notes object to JSON format
$jsonNotes = $notesObj | ConvertTo-Json -Depth 10

# Write the final appended blocks
# Check if COURSE_DATA.notes is already in the file and remove it
$cleanContent = $content -replace "(?ms)\/\/ Precompiled Markdown Notes.*$", ""
$cleanContent = $cleanContent.Trim()

$finalOutput = $cleanContent + "`n`n// Precompiled Markdown Notes for Offline Use`nCOURSE_DATA.notes = " + $jsonNotes + ";"
Set-Content -Path $dataPath -Value $finalOutput -Encoding utf8
Write-Host "Successfully precompiled markdown notes into course-data.js!"
