@echo off
set "PATH=D:\Nodejs;%PATH%"
cd /d D:\MyWebsite04
start "随机人生补给站 API" cmd /k "D:\Nodejs\node.exe D:\MyWebsite04\server\index.js"
"D:\Nodejs\node.exe" "D:\MyWebsite04\node_modules\vite\bin\vite.js" --host 127.0.0.1
