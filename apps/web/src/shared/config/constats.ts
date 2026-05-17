export const API_URL: string =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}://${window.location.host}/api`;

const wspProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
export const WS_URL: string =
  API_URL.replace(window.location.protocol, wspProtocol) ||
  `${wspProtocol}//${window.location.host}`;
