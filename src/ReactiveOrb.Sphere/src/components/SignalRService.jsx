import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";

// SignalRService component handles the SignalR connection and event handling
const SignalRService = ({ onEventReceived, onConnectionStatusChange }) => {
    const connectionRef = useRef(null); // Reference to store the SignalR connection

    useEffect(() => {
        // Create the SignalR connection
        const hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7159/ReactiveOrbHub", {
                skipNegotiation: true, // Skip negotiation to directly use WebSockets
                transport: HttpTransportType.WebSockets, // Use WebSockets for communication
            })
            .withAutomaticReconnect([0, 2000, 10000]) // Retry connection after 0, 2, and 10 seconds
            .configureLogging(LogLevel.Information) // Set the logging level to Information
            .build();

        connectionRef.current = hubConnection; // Store the connection in the reference

        // Function to start the connection
        const startConnection = () => {
            hubConnection
                .start()
                .then(() => {
                    console.log("SignalR connected!"); // Log successful connection
                    onConnectionStatusChange(true);  // Notify parent component that the connection is established
                })
                .catch((err) => {
                    console.error("Error connecting SignalR: ", err); // Log any connection errors
                    onConnectionStatusChange(false);  // Notify parent component that the connection failed
                });
        };

        // Function to stop the connection
        const stopConnection = () => {
            if (hubConnection.state === 'Connected') {
                hubConnection.stop(); // Stop the connection
                onConnectionStatusChange(false);  // Notify parent component that the connection has been stopped
            }
        };

        // Connection status event listeners
        hubConnection.onreconnecting(() => {
            onConnectionStatusChange(false); // Notify parent component of reconnecting state
        });

        hubConnection.onreconnected(() => {
            onConnectionStatusChange(true); // Notify parent component of successfully reconnected state
        });

        hubConnection.onclose(() => {
            onConnectionStatusChange(false); // Notify parent component of closed connection
        });

        // Listen for custom events sent from the server
        hubConnection.on("Send", (event) => {
            onEventReceived(event); // Pass the event to the parent component
        });

        // Start the connection when the component is mounted
        startConnection();

        // Clean up the connection when the component is unmounted
        return () => {
            stopConnection(); // Ensure the connection is stopped when the component is unmounted
        };
    }, [onEventReceived, onConnectionStatusChange]);

    // Render nothing, as this component only manages the SignalR connection
    return <div>{/* No visible rendering needed */}</div>;
};

// Prop validation for the component
SignalRService.propTypes = {
    onEventReceived: PropTypes.func.isRequired, // Function to handle incoming events
    onConnectionStatusChange: PropTypes.func.isRequired, // Function to track the connection status
};

export default SignalRService; // Export SignalRService as the default component