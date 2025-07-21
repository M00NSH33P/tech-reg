# Tech Registration Web Application

A React + Vite web application for managing technology registration and loans using Notion as a backend database. This application runs on Raspberry Pi and provides an interface for tracking IT equipment loans.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [System Service Setup](#system-service-setup)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Updates](#updates)

## Features

- **Equipment Tracking**: Manage loanable IT inventory items
- **People Management**: Track who has borrowed equipment
- **Loan Register**: Record sign-out and sign-in events
- **Notion Integration**: Uses Notion databases as backend storage
- **Responsive UI**: Built with React and Tailwind CSS
- **Raspberry Pi Optimized**: Designed to run efficiently on Raspberry Pi

## Prerequisites

- Raspberry Pi (or any Linux system)
- Node.js and npm
- Notion account with API access
- Git

## Installation

### 1. Install Node.js and npm

```bash
sudo apt update
sudo apt install nodejs npm
```

### 2. Clone the Repository

```bash
git clone https://github.com/M00NSH33P/tech-reg.git
cd tech-reg
```

### 3. Install Dependencies

```bash
npm install
npm run build
```

## Configuration

### Environment Setup

1. Copy the environment example file:
   ```bash
   cp .envexample .env
   ```

2. Edit the `.env` file with your Notion configuration:
   ```bash
   nano .env
   ```

3. Add your Notion API key and database IDs:
   ```
   NOTION_API_KEY=your_notion_api_key
   NOTION_INVENTORY_DB_ID=your_inventory_database_id
   NOTION_PEOPLE_DB_ID=your_people_database_id
   NOTION_LOAN_REGISTER_DB_ID=your_loan_register_database_id
   IP=http://ip:port
   PORT=3001
   ```

### Notion Database Setup

You need to create and expose three Notion databases:

1. **Inventory Database**: Contains IT equipment with a "Loanable" checkbox property
2. **People Database**: Contains user information with a "Name" title property
3. **Loan Register Database**: Records loan transactions with relations to both above databases

Make sure all three databases are shared with your Notion integration.

## Running the Application

### Development Mode

```bash
npm run start
```

This command runs both the frontend (Vite dev server) and backend (Express server) concurrently.

### Production Mode

```bash
npm run build
npm run server
```

The application will be available at `http://[your-device-ip]:3001`

## System Service Setup

To run the application automatically on system startup:

### 1. Create Service File

```bash
sudo nano /etc/systemd/system/webapp.service
```

### 2. Add Service Configuration

```ini
[Unit]
Description=Vite and Node Web Application
After=network.target

[Service]
# Change to device user
User=admin
# Change to file dir
WorkingDirectory=/home/admin/tech-reg
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=webapp

[Install]
WantedBy=multi-user.target
```

**Note**: Replace `admin` with your actual username and adjust the `WorkingDirectory` path accordingly.

### 3. Enable and Start Service

```bash
# Reload systemd daemon
sudo systemctl daemon-reload

# Enable service for startup
sudo systemctl enable webapp.service

# Start service immediately
sudo systemctl start webapp.service

# Check service status
sudo systemctl status webapp.service
```

### Service Management Commands

```bash
# Start the service
sudo systemctl start webapp.service

# Stop the service
sudo systemctl stop webapp.service

# Restart the service
sudo systemctl restart webapp.service

# View service logs
sudo journalctl -u webapp.service -f
```

## Development

This project uses:

- **React 19**: Frontend framework
- **Vite**: Build tool and development server
- **Express.js**: Backend server
- **Notion API**: Database operations
- **Tailwind CSS**: Styling

### Available Scripts

- `npm run dev`: Start Vite development server
- `npm run server`: Start Express backend server
- `npm run build`: Build for production
- `npm run start`: Run both frontend and backend concurrently
- `npm run lint`: Run ESLint

### Vite Configuration

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### TypeScript Integration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Troubleshooting

### Common Issues

1. **Service won't start**: Check that all environment variables are set correctly
2. **Notion connection failed**: Verify API key and database IDs
3. **Port already in use**: Change the PORT in your `.env` file
4. **Permission denied**: Ensure the service user has proper permissions

### Checking Logs

```bash
# View application logs
sudo journalctl -u webapp.service -n 50

# Follow logs in real-time
sudo journalctl -u webapp.service -f
```

### Testing Notion Connection

The application automatically tests connections to all three Notion databases on startup. Check the logs for connection status.

## Updates

An update script is included for easy deployment of new versions from GitHub. This is particularly useful for in-house deployments where you need to quickly pull and deploy updates.

To update the application:
1. Stop the service: `sudo systemctl stop webapp.service`
2. Run the update script (if available)
3. Start the service: `sudo systemctl start webapp.service`


### features to come 

1. name search
2. notion database template
3. fix item search
4. image support 
5. sorting 


## License

This project is licensed under the MIT License.

## Author

M00NSH33P
