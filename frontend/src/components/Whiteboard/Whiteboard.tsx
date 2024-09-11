import React, { useRef, useState, useEffect } from 'react';
import './Whiteboard.css'

const Canvas: React.FC = () => {
    //we use a useRef to reference the canvas HTML element, it is used to access DOM elements
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    //What we use to draw in the canvas, this we use to draw on the canvas(brush)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    //to track whether the user is currently drawing
    const [isDrawing, setIsDrawing] = useState(false);

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
