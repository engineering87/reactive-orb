# ReactiveOrb: An Interactive Orb Animation for REST API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![issues - reactive-orb](https://img.shields.io/github/issues/engineering87/reactive-orb)](https://github.com/engineering87/reactive-orb/issues)
[![stars - reactive-orb](https://img.shields.io/github/stars/engineering87/reactive-orb?style=social)](https://github.com/engineering87/reactive-orb)

## Overview

This project is an experimental implementation that explores the interaction between **REST APIs** and **advanced graphical animations** using a dynamic **orb (sphere)**. The sphere changes its appearance and behavior in real-time based on **SignalR events** received from the API, and responds to different **HTTP methods** invoked on the API (such as `GET`, `POST`, `PUT`, and `DELETE`).

The project uses **WART** (Web API Request Tool) to send **SignalR** messages from the backend REST API to the frontend, allowing the sphere to visually react to the API's state and the type of HTTP requests being processed.

![Alt text](https://github.com/engineering87/reactive-orb/blob/main/ReactiveOrbDemo.gif)

## Features

- **Real-Time Animation**: The orb changes color and undergoes distortion effects based on incoming events.
- **SignalR Integration**: Real-time communication between the backend REST API and the frontend is powered by SignalR.
- **Dynamic Color Change**: Different HTTP methods (`POST`, `GET`, `PUT`, `DELETE`) are mapped to specific colors, which are displayed on the orb.
- **Interactive Visualization**: The sphere responds to the frequency and type of events, creating an engaging visualization that simulates the backend activity.
- **Event-Driven Animation**: The orb adapts its appearance as a reaction to changes in the API's state, with smooth transitions and a multi-color effect when multiple event types occur.

## How It Works

1. **SignalR Communication**: The project leverages the **SignalR** library for real-time communication between the backend (REST API) and the frontend (React.js).
   
2. **Backend - WART Integration**: The backend REST API is configured to send **SignalR messages** using the **[WART library](https://github.com/engineering87/WART)**. Each HTTP request (`POST`, `GET`, `PUT`, `DELETE`) triggers a SignalR event that informs the frontend of the method type.

3. **Frontend - React.js + Three.js**: The frontend is built using **React.js** and **Three.js**. A 3D sphere (orb) is rendered and animated in the canvas, where:
   - The **color** of the sphere changes based on the HTTP method used.
   - **Distortion** and **speed** of the animation are adjusted dynamically, based on the frequency and type of events received.

4. **Event-driven Animation**: The orb reacts in real-time to events:
   - Each event changes the sphere's **color** (e.g., `POST` turns it green, `PUT` turns it yellow, etc.).
   - The **distortion effect** becomes more intense as more events are received, but is capped to prevent excessive distortion.
   - If no events are received for a certain period (e.g., 5 seconds), the sphere returns to its original state.

## Setup

### Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (v16 or later)
- **npm** or **yarn**
- **WART library** (for backend integration)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/interactive-orb.git
    cd interactive-orb
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    # or if you're using yarn
    yarn install
    ```

3. Set up the backend REST API to use **WART** for sending SignalR messages:
   - Integrate WART into your backend application. Follow the instructions on the [WART repository](https://github.com/engineering87/WART) to configure SignalR communication.

4. Start the development server:

    ```bash
    npm start
    # or if you're using yarn
    yarn start
    ```

   The frontend will be available at `http://localhost:3000`.

### Running the Backend (SignalR)

1. Set up and run the backend that emits SignalR messages (using the WART library) based on HTTP requests:
   - Send events via SignalR for `POST`, `GET`, `PUT`, and `DELETE` requests.
   - The frontend will react to these events, updating the orb accordingly.
     
## Libraries Used

- **React.js**: Frontend library for building the user interface.
- **Three.js**: 3D rendering library used to create the animated sphere.
- **SignalR**: Real-time web functionality for pushing events from the backend to the frontend.
- **WART**: Library for sending SignalR messages from the REST API (backend).

## Example Usage

1. Send a `POST` request to the backend:

   - The sphere will turn **green** (associated with `POST`).
   - Distortion and intensity increase, depending on the frequency of events.

2. Send a `PUT` request to the backend:

   - The sphere will turn **yellow** (associated with `PUT`).
   - The distortion effect changes accordingly.

3. The sphere will dynamically adjust as different events are sent.

### Contributing
Thank you for considering to help out with the source code!
If you'd like to contribute, please fork, fix, commit and send a pull request for the maintainers to review and merge into the main code base.

**Getting started with Git and GitHub**

 * [Setting up Git](https://docs.github.com/en/get-started/getting-started-with-git/set-up-git)
 * [Fork the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
 * [Open an issue](https://github.com/engineering87/reactive-orb/issues) if you encounter a bug or have a suggestion for improvements/features

### Licensee
ReactiveOrb source code is available under MIT License, see license in the source.

### Contact
Please contact at francesco.delre[at]protonmail.com for any details.
