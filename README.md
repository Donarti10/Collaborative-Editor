# Collaborative Real-time Text Editor

This is a collaborative real-time text editor, built with React and `draft-js`, using WebSockets to sync content between multiple users in real-time.

## Features

- **Real-time Collaboration:** Multiple users can edit the same document and see each other's changes in real-time.
- **Rich Text Editing:** Includes formatting options such as:
  - Bold
  - Italic
  - Underline
  - Strikethrough
  - Code block
  - Headers (H1, H2)
  - Lists (ordered, unordered)
  - Custom inline styles like highlighting and red text.
- **WebSocket-based Syncing:** Uses WebSockets for low-latency syncing across devices.
- **Collaborative Authors Tracking:** Keeps track of authors who made changes to the document.

## How to Run

### Frontend
1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Install the latest version of `react-scripts`:
    ```bash
    npm install react-scripts@latest
    ```
4. Start the development server:
    ```bash
    npm start
    ```
5. The app will be available at `http://localhost:3000`.

### Backend
1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the WebSocket server:
    ```bash
    node server.js
    ```
4. The WebSocket server will run on `ws://localhost:3001`.

## Project Structure

- **App.js:** Contains the main editor logic and WebSocket connection.
- **server.js:** WebSocket backend that syncs changes between clients.
- **/components:** Reusable components for toolbar and style controls.

## WebSocket Server (server.js)

The WebSocket server uses `yjs` for real-time syncing of document changes and handles multiple clients simultaneously.

- **Yjs:** Used to manage collaborative document state.
- **WebSockets:** Facilitates bi-directional real-time communication between clients and the server.

## Dependencies

### Frontend:
- React
- `draft-js` for rich text editor.
- WebSocket handling via browser's WebSocket API.

### Backend:
- `ws` for WebSocket server.
- `yjs` and `y-websocket` for syncing real-time document changes.
