export default (nodefony) => {

  'use strict';
  const mixSettings = {
    panner: true,
    analyser: true
  };

  class Mixer extends nodefony.Service {

    constructor(name = "Mixer", settings = {}, service = null) {
      if (service) {
        super(name, service.container);
      } else {
        super(name);
      }
      this.audioBus = {};
      this.nbBus = 0;
      this.settings = nodefony.extend({}, mixSettings, settings);
      this.createAudioBus("MASTER", {
        panner: this.settings.panner,
        analyser: this.settings.analyser
      });
      this.masterBus = this.audioBus.MASTER;
      this.tracks = this.masterBus.tracks;
      this.audioContext = this.masterBus.audioContext;
      this.muted = this.masterBus.muted;
      this.panner = this.masterBus.audioNodes.panner;
      this.analyserLeft = this.masterBus.audioNodes.analyserLeft;
      this.analyserRight = this.masterBus.audioNodes.analyserRight;
      this.gain = this.masterBus.audioNodes.gain;
      this.connect(this.audioContext.destination);
    }

    createAudioBus(name, settings) {
      let bus = null;
      try {
        bus = new nodefony.webAudio.AudioBus(name, this, settings);
      } catch (e) {
        throw e;
      }
      this.log(`Create audio Bus : ${bus.name}`, "DEBUG");
      this.audioBus[name] = bus;
      this.nbBus++;
      bus.listen(this, "onCreateTrack", function(track, bus) {
        this.fire("onCreateTrack", track, bus, this);
      });
      bus.listen(this, "onRemoveTrack", function(track, bus) {
        this.fire("onRemoveTrack", track, bus, this);
      });
      return bus;
    }

    removeAudioBus(bus) {
      var ele = null;
      switch (true) {
        case bus instanceof nodefony.webAudio.AudioBus:

          break;
        case typeof track === "number":
        case typeof track === "string":

          break;
      }
      if (!ele) {
        throw new Error("remove bus : this bus doesn't exist in  mixer  ");
      }
      return true;
    }

    connect(audioNode) {
      this.destination = audioNode;
      var ret = this.masterBus.connect(audioNode);
      this.fire("onConnect", audioNode, this);
      return ret;
    }

    disconnect() {
      this.masterBus.disconnect();
      this.destination = null;
      this.fire("onDisconnect", this);
    }

    setGain(value) {
      this.masterBus.setGain(value);
      return this;
    }

    getGain() {
      return this.masterBus.getGain();
    }

    mute() {
      this.masterBus.mute();
      this.muted = this.masterBus.muted;
      return this;
    }

    unmute() {
      this.masterBus.unmute();
      this.muted = this.masterBus.muted;
      return this;
    }

    createTrack(media, settings) {
      return this.masterBus.createTrack(media, settings);
    }

    removeTrack(track) {
      return this.masterBus.removeTrack(track);
    }

    playTracks(time, loop) {
      for (var i = 0; i < this.tracks.length; i++) {
        this.tracks[i].play(time, loop);
      }
    }

    createGain() {
      return this.audioContext.createGain();
    }

    createPanner() {
      return this.audioContext.createPanner();
    }

    createStereoPanner() {
      return this.audioContext.createStereoPanner();
    }

    createFilter() {
      return this.audioContext.createBiquadFilter();
    }

    createAnalyser() {
      return this.audioContext.createAnalyser();
    }

    createChannelSplitter(nbChannel) {
      return this.audioContext.createChannelSplitter(nbChannel);
    }

    createChannelMerger(nbChannel) {
      return this.audioContext.createChannelMerger(nbChannel);
    }

    createOscillator() {
      return this.audioContext.createOscillator();
    }
  }
  return Mixer;
};
