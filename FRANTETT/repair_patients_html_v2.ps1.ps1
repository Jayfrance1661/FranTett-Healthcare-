$ErrorActionPreference = "Stop"

$source = ".\pages\patients.html"
$backup = ".\pages\patients_BEFORE_REPAIR_2026-08-31.html"
$output = ".\pages\patients_REPAIRED.html"

if (!(Test-Path $source)) {
    throw "Could not find $source"
}

$html = Get-Content $source -Raw

# Safety backup
Copy-Item $source $backup -Force

# ------------------------------------------------------------
# 1. Remove duplicate setText() declarations robustly.
#    This version locates the complete function by brace counting,
#    so whitespace differences do not matter.
# ------------------------------------------------------------
function Remove-ExtraSetTextFunctions {
    param([string]$Text)

    $pattern = 'function\s+setText\s*\(\s*id\s*,\s*value\s*\)\s*\{'
    $matches = [regex]::Matches($Text, $pattern)

    if ($matches.Count -le 1) {
        return $Text
    }

    # Keep the first; remove every subsequent complete function.
    for ($m = $matches.Count - 1; $m -ge 1; $m--) {
        $start = $matches[$m].Index
        $openBrace = $Text.IndexOf('{', $start)

        if ($openBrace -lt 0) {
            throw "Could not locate opening brace for duplicate setText()."
        }

        $depth = 0
        $inSingle = $false
        $inDouble = $false
        $escaped = $false
        $end = -1

        for ($i = $openBrace; $i -lt $Text.Length; $i++) {
            $c = $Text[$i]

            if ($escaped) {
                $escaped = $false
                continue
            }

            if ($c -eq '\' -and ($inSingle -or $inDouble)) {
                $escaped = $true
                continue
            }

            if ($c -eq "'" -and !$inDouble) {
                $inSingle = !$inSingle
                continue
            }

            if ($c -eq '"' -and !$inSingle) {
                $inDouble = !$inDouble
                continue
            }

            if ($inSingle -or $inDouble) {
                continue
            }

            if ($c -eq '{') {
                $depth++
            }
            elseif ($c -eq '}') {
                $depth--
                if ($depth -eq 0) {
                    $end = $i + 1
                    break
                }
            }
        }

        if ($end -lt 0) {
            throw "Could not locate closing brace for duplicate setText()."
        }

        # Also consume surrounding blank lines.
        while ($end -lt $Text.Length -and
               ($Text[$end] -eq "`r" -or $Text[$end] -eq "`n" -or $Text[$end] -eq ' ' -or $Text[$end] -eq "`t")) {
            $end++
        }

        $Text = $Text.Remove($start, $end - $start)
    }

    return $Text
}

$html = Remove-ExtraSetTextFunctions $html

# ------------------------------------------------------------
# 2. Fix editConsultation(): consultationId is not defined there.
# ------------------------------------------------------------
$html = $html.Replace(
@'
setActiveConsultationId(
    consultationId
);
'@,
@'
setActiveConsultationId(
    consultation.id
);
'@
)

# Also handle compact formatting if present.
$html = [regex]::Replace(
    $html,
    'setActiveConsultationId\s*\(\s*consultationId\s*\)\s*;',
    'setActiveConsultationId(consultation.id);'
)

# ------------------------------------------------------------
# 3. Make editConsultation() safely synchronize the hidden field.
# ------------------------------------------------------------
$old = @'
document.getElementById(
    "consultationId"
).value =
    consultation.id;
'@

$new = @'
const consultationIdField =
    document.getElementById(
        "consultationId"
    );

if (consultationIdField) {
    consultationIdField.value =
        consultation.id;
}
'@

if ($html.Contains($old)) {
    $html = $html.Replace($old, $new)
}

# ------------------------------------------------------------
# 4. Make saveLabRequest() use the actual hidden/active
#    consultation ID and reject null before POST.
# ------------------------------------------------------------
$oldLab = @'
const consultationId =
    currentConsultationId || null;

const labRequestData = {

    consultation_id:
    currentConsultationId || null,
'@

$newLab = @'
const consultationId =
    getActiveConsultationId(
        document.getElementById(
            "labRequestConsultationId"
        )?.value
    );

if (!consultationId) {
    alert(
        "Please open a consultation before saving the laboratory request."
    );
    return;
}

const labRequestData = {

    consultation_id:
        consultationId,
'@

if ($html.Contains($oldLab)) {
    $html = $html.Replace($oldLab, $newLab)
}

# ------------------------------------------------------------
# 5. Replace corrupted question-mark UI placeholders in the
#    laboratory-request section only.
# ------------------------------------------------------------
$html = $html.Replace(
    '<div class="lab-request-empty-icon">??</div>',
    '<div class="lab-request-empty-icon">LAB</div>'
)
$html = $html.Replace(
    '<div class="lab-request-icon">??</div>',
    '<div class="lab-request-icon">LAB</div>'
)
$html = $html.Replace(
    '<span class="field-icon">?????</span>',
    '<span class="field-icon">•</span>'
)
$html = $html.Replace(
    '<span class="field-icon">??</span>',
    '<span class="field-icon">•</span>'
)

# Printed checkbox symbols
$html = [regex]::Replace(
    $html,
    'printedCheckbox\.textContent\s*=\s*originalCheckbox\.checked\s*\?\s*"\?\s*"\s*:\s*"\?\s*";',
    'printedCheckbox.textContent = originalCheckbox.checked ? "[X] " : "[ ] ";'
)

# ------------------------------------------------------------
# 6. Sanity checks.
# ------------------------------------------------------------
if (!$html.StartsWith("<!DOCTYPE html>", [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Sanity check failed: missing <!DOCTYPE html>."
}

if (!$html.Contains("</html>")) {
    throw "Sanity check failed: missing </html>."
}

$setTextCount = ([regex]::Matches(
    $html,
    'function\s+setText\s*\(\s*id\s*,\s*value\s*\)\s*\{'
)).Count

if ($setTextCount -ne 1) {
    throw "Sanity check failed: expected exactly 1 setText() function, found $setTextCount."
}

# The old undefined call must not remain.
$badCallCount = ([regex]::Matches(
    $html,
    'setActiveConsultationId\s*\(\s*consultationId\s*\)'
)).Count

if ($badCallCount -gt 0) {
    throw "Sanity check failed: undefined consultationId call remains."
}

# ------------------------------------------------------------
# 7. Write repaired complete file without touching original.
# ------------------------------------------------------------
Set-Content -Path $output -Value $html -Encoding UTF8

$lineCount = (Get-Content $output).Count
$fileSize = (Get-Item $output).Length

Write-Host ""
Write-Host "=============================================="
Write-Host "FranTett patients.html repair completed"
Write-Host "=============================================="
Write-Host "Original : $source"
Write-Host "Backup   : $backup"
Write-Host "Repaired : $output"
Write-Host "Lines    : $lineCount"
Write-Host "Bytes    : $fileSize"
Write-Host ""
Write-Host "Original patients.html was NOT overwritten."
