import React from 'react';
import './Home.css'

//this line defines a functional component named Home using typescript
const Home: React.FC = () => {
    return (
        <div className='home-container'>
            <header className='header'>
                <h1>Real-time collaborative whiteboard</h1>
            </header>
            {/* mian element represetns the main content of the document */}
            <main className='main-content'>
                <div className='whiteboard-placeholder'>
                    <p>whiteboard area</p>
                </div>
            </main>
        </div>
    )
}

export default Home;
