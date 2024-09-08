import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-char-list',
  standalone: true,
  imports: [CardModule, PaginatorModule, CommonModule, AutoCompleteModule,CheckboxModule],
  templateUrl: './char-list.component.html',
  styleUrl: './char-list.component.css'
})
export class CharListComponent implements OnInit {
  
  @Output() dataEvent = new EventEmitter();
  lengthData ={
    charLength : null,
    episLength : null,
    locaLength : null
  }
  
  characters: any[] = [];
  episodes: any[] = [];
  filteredCharacters: any[] = []; // Filtrelenmiş öneriler burada olacak
  selectedCharacter: any; // Kullanıcının seçtiği karakter
  cachedPages: { [key: number]: any[] } = {}; // Bellekte sayfalar için cache
  allCharacters: any[] = [];
  first = 0;
  rows = 20;
  totalPages: number = 0;
  totalRecords: number = 0;
  searchQuery: string = '';

  selectedMale: boolean = false
  selectedFemale: boolean = false
  selectedAlive: boolean = false
  selectedDead: boolean = false

  constructor(private rickAndMortyService: RickAndMortyService) { }

  ngOnInit() {
    this.getEpisode();
    this.loadInitialData(); // İlk sayfa verilerini yükle
  }

  loadInitialData() {
    this.rickAndMortyService.getChar(1).subscribe((data: any) => {
      this.lengthData.charLength = data.info.count

      this.characters = data.results.map((character: { episode: any[]; }) => {
        const episodeUrl = character.episode[0];
        const episode = this.episodes.find(ep => ep.url === episodeUrl);
        return {
          ...character,  // Mevcut karakterin tüm özellikleri
          episodeName: episode ? episode.name : 'Unknown' // Datayı manipüle et
        };

      })
      this.cachedPages[1] = this.characters;
      this.allCharacters = [...this.characters];
      this.totalRecords = data.info.count;


      this.dataEvent.emit(this.lengthData)
    });
  }

  searchCharacters(event: any) {
    console.log(event)
    const query = event.query?.toLowerCase();
    this.searchQuery = query;
  
    this.filteredCharacters = this.allCharacters.filter(character =>
      character.name.toLowerCase().includes(query)
    );
  
    if (this.searchQuery) {
      this.characters = this.filteredCharacters;
    } else {
      // Arama yoksa mevcut sayfadaki karakterleri göster
      const pageNumber = Math.floor(this.first / this.rows) + 1;
      this.characters = this.cachedPages[pageNumber] || [];
    }
  }

  filterCharacters() {
    this.filteredCharacters = this.allCharacters.filter(character => {
      const matchesGender = (this.selectedMale && character.gender === 'Male') ||
                            (this.selectedFemale && character.gender === 'Female') ||
                            (!this.selectedMale && !this.selectedFemale);

      const matchesStatus = (this.selectedAlive && character.status === 'Alive') ||
                            (this.selectedDead && character.status === 'Dead') ||
                            (!this.selectedAlive && !this.selectedDead);

      return matchesGender && matchesStatus;
    });
    
    this.characters = this.filteredCharacters;

  }

  paginate(event: any) {
    const pageNumber = Math.floor(event.first / this.rows) + 1;

    if (this.cachedPages[pageNumber]) {
      this.characters = this.cachedPages[pageNumber]; // Cache'den çek
      this.characters.map(character => {
        const episodeUrl = character.episode[0];
        const episode = this.episodes.find(ep => ep.url === episodeUrl);
        return {
          ...character, 
          episodeName: episode ? episode.name : 'Unknown' 
        };
      })
    } else {
      this.rickAndMortyService.getChar(pageNumber).subscribe((data: any) => {
        this.characters = data.results.map((character: { episode: any[]; }) => {
          const episodeUrl = character.episode[0];
          const episode = this.episodes.find(ep => ep.url === episodeUrl);
          return {
            ...character,
            episodeName: episode ? episode.name : 'Unknown' 
          };
        })

        this.cachedPages[pageNumber] = this.characters; // Cache'e ekle
        this.allCharacters = [...this.allCharacters, ...this.characters]; 

      });
    }

    // Sonraki sayfayı önceden yükle
    if (pageNumber < Math.ceil(this.totalRecords / this.rows)) {
      const nextPage = pageNumber + 1;
      if (!this.cachedPages[nextPage]) {
        this.rickAndMortyService.getChar(nextPage).subscribe((data: any) => {
          let chars = data.results.map((character: { episode: any[]; }) => {
            const episodeUrl = character.episode[0];
            const episode = this.episodes.find(ep => ep.url === episodeUrl);
            return {
              ...character,
              episodeName: episode ? episode.name : 'Unknown'
            };

          })
          this.cachedPages[nextPage] = chars;
          this.allCharacters = [...this.allCharacters, ...chars];
        });
      }
    }
  }




  getEpisode() {
    this.rickAndMortyService.getEpisode(1).subscribe((data: any) => {
      this.episodes = [...data.results];
      this.lengthData.episLength = data.info.count
    });
    this.rickAndMortyService.getEpisode(2).subscribe((data: any) => {
      this.episodes = [...this.episodes, ...data.results];
    });
    this.rickAndMortyService.getEpisode(3).subscribe((data: any) => {
      this.episodes = [...this.episodes, ...data.results];
      console.log(this.episodes)
    });
    this.rickAndMortyService.getLocations(1).subscribe((data: any) => {
      this.lengthData.locaLength = data.info.count
    });

  }


}

