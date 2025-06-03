// /public/pcm-processor.js

class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.bufferSize = 4800; // 0.2 seconds of 24kHz audio (smaller chunks for better responsiveness)
    this.isRecording = true;
    this.chunkCount = 0;

    this.port.onmessage = (event) => {
      if (event.data === "STOP") {
        console.log("PCM Processor: Stop signal received");
        this.isRecording = false;
        this.flush();
      }
    };

    console.log("PCM Processor initialized");
  }

  flush() {
    if (this.buffer.length > 0) {
      const output = new Uint8Array(this.buffer);
      this.chunkCount++;
      console.log(
        `PCM Processor: Flushing chunk #${this.chunkCount}, size: ${output.length}`
      );

      // Transfer the buffer ownership to avoid copying
      this.port.postMessage(output.buffer, [output.buffer]);
      this.buffer = [];
    }
  }

  process(inputs) {
    if (!this.isRecording) {
      return false; // Stops the processor
    }

    const input = inputs[0];
    if (input && input[0] && input[0].length > 0) {
      const channel = input[0];

      for (let i = 0; i < channel.length; i++) {
        // Convert [-1, 1] float32 to 16-bit PCM (little endian)
        let sample = Math.max(-1, Math.min(1, channel[i]));
        let s = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        s = Math.round(s);

        // Little endian 16-bit
        this.buffer.push(s & 0xff, (s >> 8) & 0xff);
      }

      // Flush when buffer reaches target size
      if (this.buffer.length >= this.bufferSize) {
        this.flush();
      }
    }

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
