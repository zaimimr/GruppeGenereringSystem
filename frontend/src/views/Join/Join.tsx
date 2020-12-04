import { Typography } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
/**
 * Join
 * @category Views
 * @subcategory Join
 * @return {React.Component} <Join /> component
 * ""
 * @example
 *
 * return (
 *   <Join />
 * )
 */
function Join() {
  const { eventId, participantId }: { eventId: string; participantId: string } = useParams();
  const SocketURL = `${process.env.REACT_APP_SOCKET_URL}/connect/${eventId}/${participantId}`;
  const { lastMessage } = useWebSocket(SocketURL);
  const [message, setMessage] = React.useState<string>('Registrerer...');

  React.useEffect(() => {
    if (lastMessage?.data) {
      setMessage(lastMessage.data);
    }
  }, [lastMessage]);

  return (
    <>
      <Typography gutterBottom variant='h4'>
        {message}
      </Typography>
    </>
  );
}

export default Join;
