Add-Type -AssemblyName System.Windows.Forms

$dialog = New-Object System.Windows.Forms.OpenFileDialog

$dialog.Filter = "Executable Files (*.exe)|*.exe"
$dialog.Title = "Select an executable"

if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    $dialog.FileName
}