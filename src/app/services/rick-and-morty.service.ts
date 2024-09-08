import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {

  private charUrl = 'https://rickandmortyapi.com/api/character';
  private episodeUrl = 'https://rickandmortyapi.com/api/episode';
  private locationUrl = 'https://rickandmortyapi.com/api/location'

  constructor(private http: HttpClient) { }

  getChar(page: number): Observable<any> {
    return this.http.get(`${this.charUrl}?page=${page}`);
  }

  getEpisode(page: number): Observable<any> {
    return this.http.get(`${this.episodeUrl}?page=${page}`);
  }

  getLocations(page: number): Observable<any> {
    return this.http.get(`${this.locationUrl}?page=${page}`)
  }

}
