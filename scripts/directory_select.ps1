Add-Type -AssemblyName System.Windows.Forms

$dialog = New-Object System.Windows.Forms.OpenFileDialog

$dialog.Filter = "Folders|."
$dialog.CheckFileExists = $false
$dialog.CheckPathExists = $true
$dialog.FileName = "Select Folder"

if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    Split-Path $dialog.FileName
}else {
    exit 0
}