import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Alert {
  alerts: { annotations: { description: string } }[];
}

const socket = io("http://localhost:5000");

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    socket.on("new_alert", (alert: Alert) => {
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
    });

    return () => {
      socket.off("new_alert");
    };
  }, []);

  return (
    <div>
      <h2>Alerts</h2>
      {alerts.map((alert, index) => (
        <div key={index} className="alert-box">
          {alert.alerts[0]?.annotations?.description || "No description"}
        </div>
      ))}
    </div>
  );
};

export default Alerts;