import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Utilities } from '../Services/utilities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css'],
})
export class LeftComponent implements OnInit, OnDestroy {
  limit = new FormControl(10); // Casella input con valore di default

  limitUpdated: number = 10; // variabile per avere il numero aggiornato

  pokemonTotalNumber: number = 0; // totale dei pokemon

  totalPages: number = 0; // numero totale delle pagine
  currentPage: number = 1; // pagina attuale

  offset: number = 0;

  pagesSelect: number = 1; // imposto il default per il mio selettore

  clickEventSubscription!: Subscription;
  private limitSubscription!: Subscription;

  pokemonNumber: number = 0;

  constructor(public pokeService: Utilities) {
  }
  
  ngOnInit(): void {
    // Carica i dati iniziali
    this.loadInitialData();
    
    // reset quando arriva il click dalla navbar
    this.clickEventSubscription = this.pokeService
      .getClickEvent()
      .subscribe(() => {
        this.limit.patchValue(10);
        this.currentPage = 1;
        this.pagesSelect = 1;
        this.loadInitialData();
      });

    this.limitSubscription = this.limit.valueChanges.subscribe((res: number) => {
      // mi sottoscrivo al valore che cambia
      this.limitUpdated = res;
      
      // Reset alla prima pagina quando si cambia il limite
      this.currentPage = 1;
      this.offset = 0;
      this.pagesSelect = 1;
      
      this.pokeService
        .httpGetPokemonByPagination(this.offset, this.limitUpdated)
        .subscribe({
          next: (res) => {
            this.pokeService.getPokemonsData(res.results, res.count);
            this.updateTotalPages();
          },
          error: (error) => {
            console.error('Error fetching pokemon pagination:', error);
          }
        });
    });
  }

  doppiaFrecciaSinistra() {
    this.bipOnClick();
    this.currentPage = 1;
    this.offset = 0;
    this.pagesSelect = this.currentPage; // aggiorno la pagina nella select box
    this.getPokemon(this.offset, this.limit.value);
  }

  doppiaFrecciaDestra() {
    this.bipOnClick();
    this.currentPage = this.totalPages;
    this.pagesSelect = this.currentPage; // aggiorno la pagina nella select box
    this.offset =
      this.pokeService.pokemonsCountTotal -
      (this.pokeService.pokemonsCountTotal % this.limit.value);
    this.getPokemon(this.offset, this.limit.value);
  }
  
  frecciaSinistra() {
    this.bipOnClick();
    if (this.currentPage != 1) {
      this.currentPage = this.currentPage - 1;
      this.offset = this.offset - this.limit.value;
      this.pagesSelect = this.currentPage; // aggiorno la pagina nella select box
      this.getPokemon(this.offset, this.limit.value);
    }
  }
  frecciaDestra() {
    this.bipOnClick();
    if (this.currentPage <= this.totalPages - 1) {
      console.log('freccia destra IF');
      this.offset = this.currentPage * this.limit.value;
      this.currentPage = this.currentPage + 1;
      this.pagesSelect = this.currentPage; // aggiorno la pagina nella select box
      this.getPokemon(this.offset, this.limit.value);
    } else {
      console.log('attaccati al tram');
    }
  }

  counter(i: number) {
    // console.log (new Array(Number))
    return new Array(i);
  }

  pagesChange(pagina: any) {
    // Validazione della pagina selezionata
    const pageNumber = parseInt(pagina);
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > this.totalPages) {
      console.warn('Pagina non valida:', pagina);
      return;
    }
    
    this.currentPage = pageNumber;
    this.offset = (this.currentPage - 1) * this.limit.value;
    this.getPokemon(this.offset, this.limit.value);
  }

  clickOnPokeball(url: string, index?: number) {
      this.currentPage = 1;
      console.log('Click on pokeball:', { url, index, hasDetails: index !== undefined ? !!this.pokeService.pokemonListWithDetails[index]?.details : 'no index' });
      
      // Se abbiamo l'indice e i dettagli sono già caricati, usiamo quelli
      if (index !== undefined && this.pokeService.pokemonListWithDetails[index]?.details) {
        this.pokeService.getPokemonDetail(this.pokeService.pokemonListWithDetails[index].details);
        return;
      }
      
      // Se abbiamo l'indice ma non i dettagli, forziamo il caricamento
      if (index !== undefined) {
        this.pokeService.forceLoadPokemonDetails(this.pokeService.pokemonListWithDetails[index], index);
        // Facciamo anche la chiamata HTTP per aggiungere subito il Pokémon
        this.pokeService.httpGetPokemonDetail(url).subscribe({
          next: (res) => {
            this.pokeService.getPokemonDetail(res);
          },
          error: (error) => {
            console.error('Error fetching pokemon detail:', error);
          }
        });
        return;
      }
      
      // Altrimenti facciamo la chiamata HTTP
      this.pokeService.httpGetPokemonDetail(url).subscribe({
        next: (res) => {
          this.pokeService.getPokemonDetail(res);
        },
        error: (error) => {
          console.error('Error fetching pokemon detail:', error);
        }
      });
  }

  bipOnHover() {  // suono di bip al passaggio del mouse
    let audio = new Audio();
    audio.src = 'assets/sounds/HoverBip.mp3';
    audio.load();
    audio.play();
  }
  bipOnClick() { // suono di click messo sulle freccette
    let audio = new Audio();
    audio.src = 'assets/sounds/HoverBip.mp3';
    audio.load();
    audio.play();
  }
  alertSound() {
    let audio = new Audio();
    audio.src = 'assets/sounds/Alert.mp3';
    audio.load();
    audio.play();
  }
  updateTotalPages() {
    // Validazione per evitare divisioni per zero o calcoli con valori NaN
    if (!this.pokeService.pokemonsCountTotal || !this.limitUpdated || this.limitUpdated <= 0) {
      this.totalPages = 0;
      return;
    }

    this.totalPages = Math.trunc(
      this.pokeService.pokemonsCountTotal / this.limitUpdated
    );
    
    // Se c'è un resto, aggiungi una pagina
    if (this.pokeService.pokemonsCountTotal % this.limitUpdated !== 0) {
      this.totalPages++;
    }

    // Assicurati che totalPages sia almeno 1 se ci sono Pokémon
    if (this.pokeService.pokemonsCountTotal > 0 && this.totalPages === 0) {
      this.totalPages = 1;
    }
  }

  getPokemon(offset: number, limit: number) { // funzione centralizzata per andare a fare le chiamate
    // Validazione dei parametri
    if (offset < 0) {
      offset = 0;
    }
    if (limit <= 0) {
      limit = 10; // valore di default
    }
    
    this.pokeService
      .httpGetPokemonByPagination(offset, limit)
      .subscribe({
        next: (res) => {
          this.pokeService.getPokemonsData(res.results, res.count);
        },
        error: (error) => {
          console.error('Error fetching pokemon:', error);
        }
      });
    console.log('Fetching pokemon with offset:', offset, 'limit:', limit);
  }
  selectedPokemon(index: number) {
    const elem = document.getElementsByClassName("listOfElements")[index];
    if (elem) {
      // Rimuovi la selezione precedente
      const allElements = document.getElementsByClassName("listOfElements");
      for (let i = 0; i < allElements.length; i++) {
        (allElements[i] as HTMLElement).style.backgroundColor = '';
      }
      // Seleziona l'elemento corrente
      (elem as HTMLElement).style.backgroundColor = 'lime';
    }
    console.log('Selected pokemon at index:', index);
  }

  private loadInitialData(): void {
    // Reset delle variabili di stato
    this.currentPage = 1;
    this.offset = 0;
    this.pagesSelect = 1;
    this.limitUpdated = this.limit.value || 10;
    
    this.pokeService
      .httpGetPokemonByPagination(0, this.limitUpdated)
      .subscribe({
        next: (res) => {
          this.pokeService.getPokemonsData(res.results, res.count);
          this.updateTotalPages();
        },
        error: (error) => {
          console.error('Error loading initial data:', error);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.clickEventSubscription) {
      this.clickEventSubscription.unsubscribe();
    }
    if (this.limitSubscription) {
      this.limitSubscription.unsubscribe();
    }
  }
}
