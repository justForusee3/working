import { Lightning, Utils, Log } from "@lightningjs/sdk";
import { Device, Localization,Metrics } from "@firebolt-js/sdk";
//import { Wifi } from '@firebolt-js/manage-sdk';
//import {Button} from './button.js';
import { MyButton } from "./MyButton";


const videoUrlList = ['https://amssamples.streaming.mediaservices.windows.net/683f7e47-bd83-4427-b0a3-26a6c4547782/BigBuckBunny.ism/manifest(format=mpd-time-csf)',
'https://livesim.dashif.org/livesim/mup_300/tsbd_500/testpic_2s/Manifest.mpd',
'https://livesim.dashif.org/livesim/mup_300/tsbd_500/testpic_3s/Manifest.mpd']

// const LifecycleColors = {
//   // BLUE
//   BOOT: "0xff0000ff",
//   // RED
//   INACTIVE: "0xffff0000",
//   // ORANGE
//   BACKGROUND: "0xffE69738",
//   // GREEN
//   FOREGROUND: "0xff00aa00",
// };

export  class App extends Lightning.Component {
  static getFonts() {
    return [
      { family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
    ];
  }

  static _template() {
    return {
      HelloWorld: {
        w: 1920,
        h: 1080,
        y: 0,
        rect: true,
        color: 0xffffffff,
        src: Utils.asset('images/background.png'),
        FireboltStatus: {
          // Lifecycle: {
          //   mountX: 0.5,
          //   x: 960,
          //   y: 100,
          //   text: {
          //     text: "Lifecycle not Ready!",
          //     fontFace: "Regular",
          //     fontSize: 50,
          //   },
          // },
          Rdklogo: {
            x: 30,
            y: 40,
            w: 300,
            h: 80,
            shadowColor: 0xffff00ff,
            src: Utils.asset("images/rdklogo.png"),
          },
          Alexalogo: {
            x: 1200,
            y: 5,
            w: 150,
            h: 150,
            src: Utils.asset("images/alexa.png"),
          },
         
          Belllogo: {
            x: 1400,
            y: 20,
            w: 100,
            h: 100,
            src: Utils.asset("images/sett.png"),
          },
          Notifilogo: {
            x: 1600,
            y: 20,
            w: 100,
            h: 100,
            src: Utils.asset("images/noti.png"),
          },
          Device: {
            mountX: 0.5,
            x: 960,
            y: 900,
            text: {
              text: "Device not Ready!",

              fontFace: "Regular",
              fontSize: 35,
              textColor: 0xff09f676,
            },
          },
          Localization: {
            mountX: 0.5,
            x: 960,
            y: 950,
            text: {
              text: "loaclization API ==> ",
              fontFace: "Regular",
              fontSize: 35,
              textColor: 0xff09f676,
          }
        },
        Metrics:{
          mountX: 0.5,
          x: 960,
          y: 1000,
          text: {
            text: "Metrics API ==> ",
            fontFace: "Regular",
            fontSize: 35,
            textColor: 0xff09f676,

        },
        },
      },
        Playbutton: {
          type: MyButton,
          mount: 0.5,
          x: 150,
          y: 130,
          text: {
            text: "Explore",
            fontFace: 'Regular',
            fontSize: 25,
            textColor: 0xffffffff,
          },
          signals: {
            onClick: "$onItemSelect(obj)",
          },
        },
      },
      Slider: {
        w: 800,
        h: 350,
        x: 480,
        y: 350,
        mount: 0.5,
        Wrapper: {
          
        },
        
      },
      VideoSection: {
        alpha: 1,
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        color: "0xff000000",
        rect: true,
        visible: false,
        HelpMsg: {
          x: 80,
          y: 50,
          w: 1920,
          text: {
            text: "Play the Video using AAMP Player",
            fontSize: 40,
            fontFace: "Regular",
            textAlign: "center",
            lineHeight: 50,
          },
          color: "0xffffffff",
          alpha: 1,
        },
        Video: {
          x: 0,
          y: 0,
          w: 1920, // Set to your desired width
          h: 1080, // Set to your desired height
          type: Lightning.components.VideoItem, // Use the appropriate Lightning video
        },
      },
    };
  }
  _getFocused() {
    return this.tag("Playbutton");
  }

  _init() {
    this.index = 0;
    this.dataLength = 3;
    const buttons = [];
    // this._player = new AAMPMediaPlayer();

    for (let i = 0; i < this.dataLength; i++) {
      buttons.push(
        { type: MyButton, x: i * (300 + 30), item: { label: `Train`, src: Utils.asset(`images/cardImage${i + 1}.jpg`),
      videoUrl: videoUrlList[i]} }, 
      );
    }

    this.tag('Wrapper').children = buttons;
    
  }

  $onItemSelect(obj) {
   
    const url = obj.videoUrl;
    this._player = new AAMPMediaPlayer();
    this._player.load(url);
    this._setState("VideoPlay");


  }
  

  
  repositionWrapper() {
    const wrapper = this.tag('Wrapper');
    const sliderW = this.tag('Slider').w;
    const currentWrapperX = wrapper.transition('x').targetvalue || wrapper.x;
    const currentFocus = wrapper.children[this.index];
    const currentFocusX = currentFocus.x + currentWrapperX;
    const currentFocusOuterWidth = currentFocus.x + currentFocus.w;

    if (currentFocusX < 0) {
      wrapper.setSmooth('x', - currentFocus.x);
    }
    else if (currentFocusOuterWidth > sliderW) {
      wrapper.setSmooth('x', sliderW - (currentFocusOuterWidth));
    }
  }

  _handleLeft() {
    if (this.index === 0) {
      this.index = this.dataLength - 1;
    }
    else {
      this.index -= 1;
    }
    this.repositionWrapper();
  }

  _handleRight() {
    if (this.index === this.dataLength - 1) {
      this.index = 0;
    }
    else {
      this.index += 1;
    }
    this.repositionWrapper();
  }


  _getSliderFocused() {
    return this.tag('Slider.Wrapper').children[this.index];
    }
  

  // initiatePlayer() {
  //   const url =
  //     "https://amssamples.streaming.mediaservices.windows.net/683f7e47-bd83-4427-b0a3-26a6c4547782/BigBuckBunny.ism/manifest(format=mpd-time-csf)";
  //   this._player = new AAMPMediaPlayer();
  //   this._player.load(url);
  // }

  static _states() {
    return [
      class LaunchView extends this {
        _getFocused() {
          return this.tag("Playbutton");
        }
        // handleButtonEnter() {
        //   console.log("Enter fired");
        //   this.initiatePlayer();
        //   this._setState("VideoPlay");
        // }
        _getFocused() {
          return this._getSliderFocused();
          }
      },
      class VideoPlay extends this {
        _getFocused() {
          return this.tag("Video");
        }
        $enter() {
          this.tag("Video").visible = true;
          this.tag("HelloWorld").visible = false;
          this.tag("Slider").visible = false;
        }
        _handleBack() {
          console.log("back to launchView");
          this.tag("Video").visible = false;
         
          this.tag("HelloWorld").visible = true;
          this.tag("Slider").visible = true;
          
          this._setState("LaunchView");
          if (this._player) {

            this._player.stop();

            this._player = null;

          }
        }
      },
    ];
  }

  _active() {
    console.log("active set state to launchView");
    this._setState("LaunchView");

    Device.audio().then((supportedAudioProfiles) => {
      const newAudio = "audio profile **" + supportedAudioProfiles.stereo;
      //Log.info(supportedAudioProfiles.stereo);
      Log.info("Device", newAudio);
      //this.tag('Device').text.text = newAudio + ' :: ';
      this.tag("Device").text.text = supportedAudioProfiles + " :: ";
      //console.log("Is stereo supported",supportedAudioProfiles.stereo);
      console.log("Is stereo supported", supportedAudioProfiles.stereo);
    });
   
    Device.distributor().then((distributor) => {
      const deviceDistributor = "distributor:" + distributor;
      Log.info(deviceDistributor);
      this.tag("Device").text.text = deviceDistributor + " :: ";
    });

    Device.platform().then((platform) => {
      const devicePlatform = "platform:" + platform;
      Log.info(devicePlatform);
      this.tag("Device").text.text += devicePlatform + " :: ";
    });

    Device.version().then((version) => {
      const deviceVersion =
        "version:" +
        version.sdk.readable +
        " : v" +
        version.sdk.major +
        "." +
        version.sdk.minor +
        "." +
        version.sdk.patch;
      Log.info(deviceVersion);
      this.tag("Device").text.text += deviceVersion;
    });
    Localization.language().then(lang => {
      const langu = "language:" + lang;
      Log.info(langu);
      this.tag("Localization").text.text += langu + " ::";
       
    })
    Localization.countryCode().then(code => {
      const C_Code = " Country_Code:" + code;
      Log.info(C_Code);
      this.tag("Localization").text.text += C_Code + " ";
        console.log(code)
    })

    Metrics.action("user", "The user did foo", null).then(success => {
      const met_act = " action : " + success;
      Log.info(met_act);
      this.tag("Metrics").text.text += met_act + " ";
       
    })
  }
}