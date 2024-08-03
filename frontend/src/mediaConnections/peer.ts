import Peer, { MediaConnection } from "peerjs";
import { UUID } from "../types";
import { socket } from "../sockets";
import { getUserMedia } from "../utils/getUserMedia";

export class PeerService {
  private myPeer: Peer | null = null;
  private connections: Record<string, MediaConnection> = {};
  private audioContext: AudioContext;
  private audioDestination: MediaStreamAudioDestinationNode;
  private stream: MediaStream | null = null;

  constructor() {
    this.audioContext = new window.AudioContext();
    this.audioDestination = this.audioContext.createMediaStreamDestination();
  }

  initializePeer(id: UUID): void {
    this.myPeer = new Peer(id, {
      host: "localhost",
      port: 8000,
      path: "/peerjs",
      config: {
        iceServers: [{ url: "stun:stun.l.google.com:19302" }],
      },
    });

    this.myPeer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      socket.emit("register-peer-id", id);
    });

    this.myPeer.on("call", this.handleIncomingCall.bind(this));
  }

  async setupAudioStream(): Promise<void> {
    try {
      this.stream = (await getUserMedia()) || null;
      this.addAudioStream(this.stream, "me");
    } catch (error) {
      console.error("Failed to get local stream", error);
    }
  }

  public establishPeerConnections(users: any[]): void {
    users.forEach((user) => {
      if (
        user.userId !== this.myPeer?.id &&
        !this.connections[user.userId] &&
        this.stream
      ) {
        const call = this.myPeer?.call(user.userId, this.stream);
        if (call) {
          this.handleConnection(call, user.userId);
        }
      }
    });
  }

  public endPeerConnection(userId: UUID) {
    if (this.connections[userId]) {
      this.connections[userId].close();
    }
  }

  private handleIncomingCall(call: MediaConnection): void {
    if (this.stream) {
      call.answer(this.stream);
      this.handleConnection(call, call.peer);
    }
  }

  private handleConnection(call: MediaConnection, userId: string): void {
    call.on("stream", (userAudioStream) => {
      this.addAudioStream(userAudioStream, userId);
    });

    call.on("close", () => {
      this.removeAudioStream(userId);
    });

    this.connections[userId] = call;
  }

  private addAudioStream(stream: MediaStream | null, _: string): void {
    if (!stream) return;
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.audioDestination);

    if (!document.getElementById("combined-audio")) {
      const audioElement = document.createElement("audio");
      audioElement.id = "combined-audio";
      audioElement.autoplay = true;
      document.body.appendChild(audioElement);
    }

    const combinedAudio = document.getElementById(
      "combined-audio",
    ) as HTMLAudioElement;
    combinedAudio.srcObject = this.audioDestination.stream;
  }

  public removeAudioStream(userId: string): void {
    console.log(`User ${userId} disconnected`);
    this.audioContext.close();
    // Additional cleanup if needed
  }
}
