import { useEffect, useState } from 'react';

import { Chat } from './chat/Chat.tsx';

import './App.css';

interface SystemMetrics {
  gpuTemperature: string | number;
  temperature: number;
  cpuLoad: number;
  memoryUsed: number;
  memoryTotal: number;
}

function App() {
  const [data, setData] = useState<SystemMetrics>({
    gpuTemperature: 1,
    temperature: 2,
    cpuLoad: 3,
    memoryUsed: 4,
    memoryTotal: 5,
  });

  useEffect(() => {
    fetch('/api/metrics')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <>
      <div>GPU Temp: {data.gpuTemperature}</div>
      <Chat />
    </>
  );
}

export default App;
