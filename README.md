# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




## set up and running, this is done from start to end no need to restart
I am running this on a Raspberry pi. and using node in bult to run it. 

Installing node and npm. 

sudo apt update
sudo apt install nodejs npm

THen get the git file

git clone https://github.com/M00NSH33P/tech-reg.git

cd tech-reg

npm install
npm run build


## running the service 

get the ip address of the device. 

and the 3 notion databased id and add them to the env file. 

i have add a env exmaple file .envexample add them in and change the name to env.

you will need to expose the 3 notion database / pages. 

## making run on start up 

sudo nano /etc/systemd/system/webapp.service

copy the webapp.service if you want. 

[Unit]
Description=Vite and Node Web Application
# This makes sure the service starts after the network is available
After=network.target

[Service]
# Replace 'admin' with your username if it's different
User=admin
# The full path to your project directory
WorkingDirectory=/home/admin/tech-reg
# The command to start your application (using the full path to npm)
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=webapp

[Install]
WantedBy=multi-user.target


Reload the systemd daemon to make it aware of the new file:

Bash
sudo systemctl daemon-reload
Enable the service to start on every boot:

Bash
sudo systemctl enable webapp.service
Start the service right now to test it:

Bash
sudo systemctl start webapp.service
Check the status to see if it's running correctly:

Bash
sudo systemctl status webapp.service


there is a update script for easly updating the app from github. i have done this as i am using the app as i use the app in house. 
