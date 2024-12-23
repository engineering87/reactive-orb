import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from "three";

const FluidSphere = ({ isConnected, eventType, eventCount }) => {
    const materialRef = useRef();
    const sphereRef = useRef();
    const [currentColor, setCurrentColor] = useState(new THREE.Color("#007bff"));
    const [intensity, setIntensity] = useState(0.4);
    const [targetIntensity, setTargetIntensity] = useState(0.4); // Target intensity for gradual transition
    const [lastEventTime, setLastEventTime] = useState(Date.now());

    const getColorForEvent = useCallback((eventType) => {
        switch (eventType) {
            case "POST":
                return new THREE.Color("#17a2b8");
            case "DELETE":
                return new THREE.Color("#dc3545");
            case "PUT":
                return new THREE.Color("#ffc107");
            case "GET":
                return new THREE.Color("#28a745");
            default:
                return new THREE.Color(isConnected ? "#007bff" : "#6c757d");
        }
    }, [isConnected]);

    const changeColor = useCallback(() => {
        const newColor = getColorForEvent(eventType);
        setCurrentColor(newColor);
    }, [eventType, getColorForEvent]);

    useEffect(() => {
        if (eventType) {
            changeColor();
            const newIntensity = Math.min(0.5 + eventCount * 0.1, 0.8);
            setTargetIntensity(newIntensity); // Set target intensity for transition
            setLastEventTime(Date.now());
        }
    }, [eventType, eventCount, changeColor]);

    useEffect(() => {
        const interval = setInterval(() => {
            const timeElapsed = Date.now() - lastEventTime;
            if (timeElapsed > 5000) {
                setCurrentColor(new THREE.Color("#007bff")); // Reset color
                setTargetIntensity(0.4); // Reset intensity
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastEventTime]);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            const time = clock.getElapsedTime();

            // Gradually interpolate the intensity towards the target value
            setIntensity((prev) => THREE.MathUtils.lerp(prev, targetIntensity, 0.02));

            // Update distort and speed
            materialRef.current.distort = intensity + Math.sin(time * 2) * 0.2;
            materialRef.current.speed = isConnected ? 2 + eventCount * 0.5 : 0.5;

            // Gradual color transition
            const targetColor = new THREE.Color(isConnected ? "#007bff" : "#6c757d");
            currentColor.lerp(targetColor, 0.005); // Gradually interpolate towards the target color
            materialRef.current.color = currentColor;

            // Sphere rotation
            sphereRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.5}>
            <MeshDistortMaterial
                ref={materialRef}
                color={currentColor}
                attach="material"
                distort={intensity}
                speed={2}
                roughness={0.2}
                metalness={0.5}
                transparent={true}
                opacity={0.7}
            />
        </Sphere>
    );
};

FluidSphere.propTypes = {
    isConnected: PropTypes.bool.isRequired,
    eventType: PropTypes.string,
    eventCount: PropTypes.number.isRequired,
};

const BlobScene = ({ isConnected, eventType, eventCount, eventCountsByType }) => {
    return (
        <div style={{ position: "relative" }}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 50 }}
                style={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#111",
                }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <FluidSphere isConnected={isConnected} eventType={eventType} eventCount={eventCount} />
            </Canvas>
            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "10px",
                    borderRadius: "5px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                }}
            >
                <p>Total Events: {eventCount}</p>
                {Object.keys(eventCountsByType).map((type) => (
                    <p key={type}>
                        {type}: {eventCountsByType[type]}
                    </p>
                ))}
            </div>
        </div>
    );
};

BlobScene.propTypes = {
    isConnected: PropTypes.bool.isRequired,
    eventType: PropTypes.string,
    eventCount: PropTypes.number.isRequired,
    eventCountsByType: PropTypes.object.isRequired, // Object with event types and counts
};

export default BlobScene;