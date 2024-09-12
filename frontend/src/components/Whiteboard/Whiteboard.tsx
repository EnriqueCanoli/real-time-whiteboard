import React, { useRef, useState, useEffect } from 'react';
import './Whiteboard.css'
import axiosInstance from '../../utils/axiosInstance';

const Canvas: React.FC = () => {
    //we use a useRef to reference the canvas HTML element, it is used to access DOM elements
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    //What we use to draw in the canvas, this we use to draw on the canvas(brush)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    //to track whether the user is currently drawing
    const [isDrawing, setIsDrawing] = useState(false);
    const [sessionId, setSessionId] = useState<string>('default')

    const [color, setColor] = useState<string>('#000000');
    const [lineWidth, setLineWidth] = useState<number>(5);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!; //this is like grabbing our brush to paint

        // Set canvas size
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;

        // Set default drawing style
        context.lineCap = 'round';
        context.lineWidth = lineWidth;
        contextRef.current = context;

        loadCanvas();
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [color, lineWidth])

    const startDrawing = (event: React.MouseEvent) => {
        const { offsetX, offsetY } = event.nativeEvent; //these are the spots on the paper where it is my mouse
        contextRef.current!.beginPath();//start a new line
        contextRef.current!.moveTo(offsetX, offsetY);//it moves the drawing pen to where you clicked
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current!.closePath();//finish the line
        setIsDrawing(false);
    };

    const draw = (event: React.MouseEvent) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = event.nativeEvent;
        contextRef.current!.lineTo(offsetX, offsetY);//draw a line form the last spot to the new spot
        contextRef.current!.stroke();//this actually dwas the line on the screen
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    const handleLineWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLineWidth(Number(event.target.value));
    };

    const saveCanvas = async () => {
        const canvas = canvasRef.current;
        const canvasData = canvas?.toDataURL(); // get the data as an image
        try {
            const response = await axiosInstance.post('/canvas/save-canvas', {sessionId,canvasData});
            alert('Canvas session saved successfully!');
        } catch (error) {
            console.error('Failed to save canvas');
        }
        

    }

    // Load the canvas session by fetching the canvas data from the API
    const loadCanvas = async () => {
        if (!sessionId.trim()) {
            alert('Session ID cannot be empty');
            return;
        }
        
        const response = await axiosInstance.get(`/canvas/load-canvas/${sessionId}`);
    
        if (response.status === 200) {
            const { canvasData } = response.data;
            const canvas = canvasRef.current!;
            const context = canvas.getContext('2d')!;
            const image = new Image();
    
            image.src = canvasData;
            image.onload = () => {
                context.drawImage(image, 0, 0);  // Draw the saved canvas image data
            };
        } else {
            alert('Failed to load the canvas session');
        }
    };
    
    //onMouseLeave={finishDrawing}: If the mouse leaves the drawing area, it stops drawing.
    return (
        <div style={{ display: 'flex'  }}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '50px', backgroundColor:'grey',}}>
                {/* Color picker */}
                <label>Color</label>
                <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    style={{ marginBottom: '10px' }}
                />
                {/* Line width picker */}
                <label>Line width</label>
                <input
                    type="number"
                    value={lineWidth}
                    onChange={handleLineWidthChange}
                    min="1"
                    max="100"
                    style={{ marginBottom: '10px' }}
                />
                <input
                    type="text"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    placeholder="Session ID"
                    style={{ marginBottom: '10px' }}
                />
                {/* Save Button */}
                <button onClick={saveCanvas}>Save Session</button>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                style={{ border: '2px solid black', cursor: 'crosshair' }}
            />
        </div>
    );
};

export default Canvas;
