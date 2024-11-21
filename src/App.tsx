import { useEffect } from 'react';
import { PropsWithChildren } from 'react';

function App({ children }: PropsWithChildren) {
    useEffect(() => {
        // Meminta browser untuk masuk ke mode fullscreen saat komponen di-render
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error("Error attempting to enable full-screen mode:", err);
            });
        }
    }, []);

    return (
        <div
            className={`main-section antialiased relative font-nunito text-sm font-normal`}>
            {children}
        </div>
    );
}

export default App;
