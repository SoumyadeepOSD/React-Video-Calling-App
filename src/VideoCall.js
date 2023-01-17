import { useState, useEffect } from "react";
import {
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
  config,
} from "./settings.js";
import { Grid } from "@material-ui/core";
import Controls from "./Controls.js";
import Video from "./Video.js";

export default function VideoCall(props) {
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient(); //client object
  const { ready, tracks } = useMicrophoneAndCameraTracks(); //microphone along with camera object

  useEffect(() => {
    let init = async (name) => {
      //user published
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        } if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });
      //user unpublished
      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) {
            user.audioTrack.stop();
          }
        } if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });
      //user left the room
      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });
      try {
        await client.join(config.appId, name, config.token, null);
      } catch (error) {
        console.log(error);
      }

      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(channelName);
      } catch (error) {
        console.log(error);
      }
    }
  }, [channelName, client, ready, tracks]);

  return (
    <Grid container direction="column" style={{ height: "100%" }}>
      <Grid item style={{ height: "5%" }}>
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </Grid>
      <Grid item style={{ height: "95%" }}>
        {ready && tracks && <Video tracks={tracks} users={users} />}
      </Grid>
    </Grid>
  );
}
