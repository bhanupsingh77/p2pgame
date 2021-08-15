const pipe = require("it-pipe");

// Define the codec of our game protocol
export const PROTOCOL = "/x11y12/p2pgame/1.0.0";

/**
 * A simple handler to print incoming messages to the console
 * @param {Object} params
 * @param {Connection} params.connection The connection the stream belongs to
 * @param {Stream} params.stream A pull-stream based stream to the peer
 */
export async function handler({ connection, stream }) {
  try {
    await pipe(stream, async function (source) {
      for await (const message of source) {
        console.info(
          `${connection.remotePeer.toB58String().slice(0, 8)}: ${String(
            message
          )}`
        );
      }
    });

    // Replies are done on new streams, so let's close this stream so we don't leak it
    await pipe([], stream);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Writes the `message` over the given `stream`. Any direct replies
 * will be written to the console.
 *
 * @param {Buffer|String} message The message to send over `stream`
 * @param {PullStream} stream A stream over the muxed Connection to our peer
 */
export async function send(message, stream) {
  try {
    await pipe([message], stream, async function (source) {
      for await (const message of source) {
        console.info(String(message));
      }
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Returns the game protocol handler that will use the provided
 * `setMessages` useEffect function to update the UI
 *
 * @param {function(func)} setMessages The react state update function for messages
 * @returns {function} The protocol handler
 */
export function messageReceivedHandler(setMessages) {
  /**
   * A simple handler to print incoming messages to the console
   * @param {Object} params
   * @param {Stream} params.stream A pull-stream based stream to the peer
   */
  return async ({ stream }) => {
    try {
      await pipe(stream, async function (source) {
        for await (const message of source) {
          // setMessages((messages) => [...messages, message]);
          // console.log("?", message.toB58String());
          let gameData = JSON.parse(message.toString());
          setMessages(gameData);
        }
      });

      // Replies are done on new streams, so let's close this stream so we don't leak it
      await pipe([], stream);
    } catch (err) {
      console.error(err);
    }
  };
}

/**
 * Writes the `message` over the given `stream`
 *
 * @param {Buffer|String} message The message to send over `stream`
 * @param {PullStream} stream A stream over the muxed Connection to our peer
 * @param {function(func)} setMessages The react state update function for messages
 */
export async function sendMessage2Peer(message, stream, setMessages) {
  try {
    await pipe([message], stream, async function (source) {
      for await (const message of source) {
        setMessages((messages) => [...messages, String(message)]);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
