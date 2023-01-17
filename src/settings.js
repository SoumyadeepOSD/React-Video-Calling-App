import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";


const appId = "8caf08d430ce4d80b4353431f231ab7d"
const token = "007eJxTYHDZ1vTs/Ldw48u/Xwn+nWxi0nDk175GxfvTNGTvR6lUPf6iwGCRnJhmYJFiYmyQnGqSYmGQZGJsamxibJhmZGyYmGSecmrp0eSGQEaGcKYvTIwMEAjiszDkJmbmMTAAAE9QIqA="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config); //hooks
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks(); //hooks
export const channelName = "main";
