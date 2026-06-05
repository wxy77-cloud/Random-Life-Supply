$env:Path = "D:\Nodejs;$env:Path"
Set-Location "D:\MyWebsite04"
Start-Process -FilePath "D:\Nodejs\node.exe" -ArgumentList "D:\MyWebsite04\server\index.js" -WorkingDirectory "D:\MyWebsite04"
& "D:\Nodejs\node.exe" "D:\MyWebsite04\node_modules\vite\bin\vite.js" --host 127.0.0.1
