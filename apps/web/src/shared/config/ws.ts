const protocol = window.location.protocol === "https:" ? "wss" : "ws";

export const WS_URL: string =
  import.meta.env.VITE_WS_URL || `${protocol}://${window.location.host}`;
