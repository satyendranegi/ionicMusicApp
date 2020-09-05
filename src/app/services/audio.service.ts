import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {map, tap, catchError, retry} from 'rxjs/operators';
import { AudioTrack } from '../tab2/tab2.page';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
url = 'https://localhost:44375/api/Audio/AudioList?';

  seachData(startin: number, end: number): Observable<AudioTrack[]> {
    console.log('service component');
    return this.http.get<AudioTrack[]>('http://localhost:8080/api/Audio/AudioList?start=2&end=5').pipe(catchError(err => {
    // return this.http.get<any>('https://localhost:44375/api/Audio/AudioList?start=2&end=5').pipe(catchError(err => {
      console.error(err.message);
      return throwError('errrorrrr');
    })
    );
  }
  getDetails(id) {
    return this.http.get(`${this.url}?start=${encodeURI(id)}`);
  }

  TrackListByArtist(artist: string): Observable<AudioTrack[]> {
    return this.http.get<AudioTrack[]>('http://localhost:8080/api/Audio/TrackListByArtist?Artist=' + artist).pipe(catchError(err => {
    // return this.http.get<any>('https://localhost:44375/api/Audio/AudioList?start=2&end=5').pipe(catchError(err => {
      console.error(err.message);
      return throwError('errrorrrr');
    })
    );
  }
  SearchTrack(searchTrack: string): Observable<AudioTrack[]> {
    return this.http.get<AudioTrack[]>('http://localhost:8080/api/Audio/SearchTrack?SearchTrack=' + searchTrack).pipe(catchError(err => {
    // return this.http.get<any>('https://localhost:44375/api/Audio/AudioList?start=2&end=5').pipe(catchError(err => {
      console.error(err.message);
      return throwError('errrorrrr');
    })
    );
  }
  constructor(private http: HttpClient) { }
}
