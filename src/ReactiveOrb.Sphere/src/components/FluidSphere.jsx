import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from 'three';

// FluidSphere component handles the dynamic sphere animation and interaction
const FluidSphere = ({ isConnected, eventType, eventCount }) => {
    const materialRef = useRef(); // Reference to the material of the sphere
    const sphereRef = useRef(); // Reference to the sphere object
    const [currentColor, setCurrentColor] = useState(new THREE.Color("#007bff")); // Initial color (blue)
    const [intensity, setIntensity] = useState(0.4); // Initial distortion intensity
    const [lastEventTime, setLastEventTime] = useState(Date.now()); // Timestamp of the last event

    // Function to determine the color based on the event type
    const getColorForEvent = useCallback((eventType) => {
        switch (eventType) {
            case "POST":
                return new THREE.Color("#17a2b8"); // Blue for POST
            case "DELETE":
                return new THREE.Color("#dc3545"); // Red for DELETE
            case "PUT":
                return new THREE.Color("#ffc107"); // Yellow for PUT
            case "GET":
                return new THREE.Color("#28a745"); // Green for GET
            default:
                return new THREE.Color(isConnected ? "#007bff" : "#6c757d"); // Blue if connected, gray if disconnected
        }
    }, [isConnected]);

    // Change the color of the sphere based on the event type
    const changeColor = useCallback(() => {
        const newColor = getColorForEvent(eventType);
        setCurrentColor(newColor); // Update the current color
    }, [eventType, getColorForEvent]);

    // Effect to transition the color on event type change
    useEffect(() => {
        if (eventType) {
            changeColor(); // Change color when a new event occurs
            setIntensity(Math.min(0.5 + eventCount * 0.1, 0.8)); // Adjust intensity with event count, but cap at 0.8
            setLastEventTime(Date.now()); // Update the timestamp of the last event
        }
    }, [eventType, eventCount, changeColor]);

    // Reset sphere state if no events have occurred for a while
    useEffect(() => {
        const interval = setInterval(() => {
            const timeElapsed = Date.now() - lastEventTime;
            if (timeElapsed > 5000) { // If more than 5 seconds without events
                setCurrentColor(new THREE.Color("#007bff")); // Reset color to blue
                setIntensity(0.4); // Reset intensity to initial value
            }
        }, 1000); // Check every second
        return () => clearInterval(interval); // Cleanup on unmount
    }, [lastEventTime]);

    // Dynamic animation for the sphere using `useFrame`
    useFrame(({ clock }) => {
        if (materialRef.current) {
            const time = clock.getElapsedTime(); // Get elapsed time
            materialRef.current.distort = intensity + Math.sin(time * 2) * 0.2; // Add variability to distortion
            materialRef.current.speed = isConnected ? 2 + eventCount * 0.5 : 0.5; // Adjust speed based on event count and connection status
            sphereRef.current.rotation.y += 0.01; // Slowly rotate the sphere
        }
    });

    return (
        <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.5}>
            <MeshDistortMaterial
                ref={materialRef}
                color={currentColor} // Set the dynamically animated color
                attach="material"
                distort={intensity} // Set distortion intensity
                speed={2}     // Set animation speed
                roughness={0.2} // Set the roughness of the material
                metalness={0.5} // Set the metallic appearance of the material
                transparent={true} // Make the material transparent for blending
                opacity={0.7} // Set opacity to allow color layering
            />
        </Sphere>
    );
};

FluidSphere.propTypes = {
    isConnected: PropTypes.bool.isRequired, // Boolean indicating connection status
    eventType: PropTypes.string, // The type of the event (POST, GET, PUT, DELETE)
    eventCount: PropTypes.number.isRequired, // Number of events received
};

// BlobScene component renders the 3D scene containing the animated sphere
const BlobScene = ({ isConnected, eventType, eventCount }) => {
    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 50 }} // Camera position and field of view
            style={{
                width: "100vw", // Full screen width
                height: "100vh", // Full screen height
                backgroundColor: "#111", // Dark background color
            }}
        >
            <ambientLight intensity={0.5} /> // Ambient light to illuminate the scene
            <directionalLight position={[5, 5, 5]} intensity={1} /> // Directional light with specific position and intensity
            <FluidSphere isConnected={isConnected} eventType={eventType} eventCount={eventCount} /> {/* Render the FluidSphere component */}
        </Canvas>
    );
};

BlobScene.propTypes = {
    isConnected: PropTypes.bool.isRequired, // Boolean indicating connection status
    eventType: PropTypes.string, // Event type to pass to FluidSphere
    eventCount: PropTypes.number.isRequired, // Event count to pass to FluidSphere
};

export default BlobScene; // Export BlobScene as the default component