import { Howl } from 'howler';
import { IonicModule, IonRange, Platform } from '@ionic/angular';
import { NgModule, Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { AudioService } from '../services/audio.service';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
export interface AudioTrack {
  ID: number;
  Name: string;
  Titile: string;
  Path: string;
  Album: string;
  Artist: string;
  DateAddedd: string;
}
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule implements OnInit, OnDestroy, AfterViewInit {
  backButtonSubscription;
  activeTrack: AudioTrack = null;
  player: Howl = null;
  isPlaying = false;
  progress = 0;
  seeList = true;
  playerImage = false;
  hideGrid = false;
  durationTrack = 0;
  progressTime = null;
  timeDuration = null;
  repeat = false;
  random = false;
  trackArt = null;
  results: Observable<AudioTrack>;
  @ViewChild('range', {static: false}) range: IonRange;
  playlist: AudioTrack[];
//   playlist: Track[] = [
//     {
//   name: 'Outfit',
//   path: 'https://localhost:44375/api/Audio/mp3/Outfit',
//   art: './assets/img/Outfit.jpg'
// }
// ];

keepPlayList = null;
songByArtist(artist: string) {
  if (artist === 'mix') {
    this.playlist = null;
    //this.playlist = this.playlist1;
  } else {
  // this.playlist = null;
//   this.playlist = [{
//   name: 'Fawa Baga Re',
//   path: './assets/mp3/FwaBaghaRe.mp3',
//   art: './assets/mp3/Fawa Baga Re.png'
// }];
  }
  this.seeList = true;
  this.hideGrid = false;
}
  constructor(private platform: Platform, private audioService: AudioService) {}
  ngOnInit() { this.GetSongList(); }

  // GetSongList() {
  //   console.log('api hit');
  //   this.results = this.audioService.seachData(1, 5);
  // }

  GetSongList(): void {
    this.audioService.seachData(1, 5)
  .subscribe(response => {
    this.playlist = response as AudioTrack[];
    console.log(this.results);
 }, er => {
   console.log(er);
   console.log(er.message);
 });
 }

 TrackListByArtist(aTrack: string): void {
   this.hideGrid = false;
   this.playerImage = false;
   this.seeList = true;
  this.audioService.TrackListByArtist(aTrack)
.subscribe(response => {
  this.playlist = response as AudioTrack[];
  console.log(this.results);
}, er => {
 console.log(er);
 console.log(er.message);
});
}

SearchTrack(sTrack: string): void {
  this.audioService.SearchTrack(sTrack)
.subscribe(response => {
  this.playlist = response as AudioTrack[];
  console.log(this.results);
}, er => {
 console.log(er);
 console.log(er.message);
});
}

  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }

  start(track: AudioTrack) {
    this.seeList = false;
    this.playerImage = true;
    this.trackArt = track;
    console.log(track.Titile);
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl ({
      src: ['http://localhost:8080/api/Audio/mp3/' + track.Name],
      format: ['dolby', 'webm', 'mp3'],
      // loop: true,
      pool: 5,
      // autoplay: true,
      buffer: true,
      html5: true,
      onplay: () => {
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
        this.formatTime(this.player.duration(track));
        console.log(this.formatTime(this.player.duration(track)));
      },
      onend: () => {
        if (this.repeat) {
          this.player.play();
        } else if (this.random) {
          this.randomSong();
        } else {
          this.next();
        }
        // console.log('Finished!');
      }
    });
    this.player.play();
  }

  togglePlayer(pause) {
this.isPlaying = !pause;
if (pause) {
  this.player.pause();
} else {
  this.player.play();
}
  }

  next() {
    const index = this.playlist.indexOf(this.activeTrack);
    if (index !== this.playlist.length - 1)
    {
      this.start(this.playlist[index + 1]);
    } else {
      this.togglePlayer(true);
      // this.start(this.playlist[0]);
    }
  }

  prev() {
    const index = this.playlist.indexOf(this.activeTrack);
    if (index > 0) {
      this.start(this.playlist[index - 1]);
    } else {
      this.start(this.playlist[this.playlist.length - 1]);
    }
  }

  seek() {
    const newValue = +this.range.value;
    const duration = this.player.duration();
    this.durationTrack = duration;
    this.player.seek(duration * (newValue / 100));
  }

  updateProgress() {
    const seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    this.timeDuration = this.formatTime(this.player.duration());
    if (this.formatTime(this.player.duration()) !== this.formatTime(seek)) {
    this.progressTime = this.formatTime(seek);
    }
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }

  seeTrackList() {
    if (this.seeList) {
    this.seeList = false;
    this.playerImage = true;
    } else {
      this.seeList = true;
      this.playerImage = false;
    }
  }

  repeatSong() {
    if (!this.repeat) {
   return this.repeat = true;
    } else {
    return  this.repeat = false;
    }
  }

  randomSong() {
    if (this.random) {
      this.start(this.playlist[Math.floor(Math.random() * this.playlist.length)]);
    } else {
      // this.start(this.playlist[Math.floor(Math.random() * this.playlist.length)]);
    }
  }

  randomSong1() {
    if (!this.random) {
       this.random = true;
       } else {
        this.random = false;
       }
  }

  // volumeUp() {
  //   let vol = this.player.volume();
	// 	vol += 0.1;
	// 	if (vol > 1) {
	// 		vol = 1;
	// 	}
	// 	this.player.volume(vol);
  // }

  // volumeDowne() {
  //   let vol = this.player.volume();
	// 	vol -= 0.1;
	// 	if (vol < 0) {
	// 		vol = 0;
	// 	}
	// 	this.player.volume(vol);
  // }

  formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (Math.trunc(seconds) < 10 ? '0' : '') + Math.trunc(seconds);
  }

  homeGrid() {
    if (this.playerImage) {
      this.playerImage = false;
      this.seeList = false;
      this.hideGrid = true;
    } else if (!this.hideGrid) {
      this.hideGrid = true;
      this.seeList = false;
    } else if (!this.seeList) {
      this.seeList = true;
      this.hideGrid = false;
    }
    // this.playerImage = false;
  }
}
