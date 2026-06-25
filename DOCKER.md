Docker deployment notes

Build and run locally:

```bash
# Build image
docker build -t hausmeister-task-manager:latest .

# Run with environment (point to your Google credentials)
docker run -it -p 3000:3000 \
  -e GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
  -e GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
  -v $PWD/hausmeister-tasks.db:/root/hausmeister-tasks.db \
  hausmeister-task-manager:latest
```

Using docker-compose:

```bash
# Build and start
docker-compose up --build

# Stop
docker-compose down
```

Notes:
- The Electron binary cannot run inside typical Linux containers for GUI; this Docker setup runs the backend and serves the built React `build/` assets.
- Use the app in a browser at `http://localhost:3000`.
- Store your Google OAuth credentials in environment variables and follow `GOOGLE_CALENDAR_SETUP.md` to create OAuth client.
