import { useState } from "react";
import BlobScene from "./components/FluidSphere"; // Import the animated 3D sphere component
import SignalRService from "./components/SignalRService"; // Import the SignalR connection service

const App = () => {
    // State for tracking SignalR connection status
    const [isConnected, setIsConnected] = useState(false);

    // State for tracking the type of event received and event count
    const [eventType, setEventType] = useState(null);
    const [eventCount, setEventCount] = useState(0);

    // State for tracking counts of events by type
    const [eventCountsByType, setEventCountsByType] = useState({
        GET: 0,
        POST: 0,
        PUT: 0,
        DELETE: 0,
    });

    // Function to handle events received from SignalR
    const handleEventReceived = (event) => {
        try {
            // Parse the incoming event data from JSON format
            const parsedEvent = JSON.parse(event);
            console.log("Event received:", parsedEvent); // Log the event data
            const { HttpMethod } = parsedEvent;

            setEventType(HttpMethod); // Set the event type (HTTP method)
            setEventCount((prevCount) => prevCount + 1); // Increment the event count

            // Increment the count for the specific event type
            setEventCountsByType((prevCounts) => ({
                ...prevCounts,
                [HttpMethod]: (prevCounts[HttpMethod] || 0) + 1, // Update the count for the event type
            }));
        } catch (error) {
            console.error("Error parsing the event:", error); // Log any errors that occur during event parsing
        }
    };

    // Function to handle changes in the SignalR connection status
    const handleConnectionStatusChange = (status) => {
        // Optionally log the connection status (e.g., "Connected" or "Disconnected")
        setIsConnected(status); // Update the connection status in state
    };

    return (
        <div>
            {/* SignalRService component manages the SignalR connection and event handling */}
            <SignalRService
                onEventReceived={handleEventReceived} // Pass the function to handle events
                onConnectionStatusChange={handleConnectionStatusChange} // Pass the function to handle connection status changes
            />

            {/* BlobScene component renders the animated 3D sphere that reacts to the events */}
            <BlobScene
                isConnected={isConnected} // Pass the connection status
                eventType={eventType} // Pass the current event type
                eventCount={eventCount} // Pass the event count
                eventCountsByType={eventCountsByType} // Pass the counts by event type
            />
        </div>
    );
};

export default App; // Export the App component as the default export