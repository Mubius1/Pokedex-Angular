import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Utilities } from '../Services/utilities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css'],
})
export class LeftComponent implements OnInit {
  limit = new FormControl(10); // Casella input con valore di default

  limitUpdated!: number; // variabile per avere il numero aggiornato

  pokemonTotalNumber!: number; // totale dei pokemon

  totalPages!: number; // numero totale delle pagine
  currentPage!: number; // pagina attuale

  offset!: number;

  pagesSelect = 1; // imposto il default per il mio selettore

  clickEventSubscription!: Subscription;

  pokemonNumber!:number

  constructor(public pokeService: Utilities) {
  }
  
  ngOnInit(): void {
    // reset quando arriva il click dalla navbar
    this.updateTotalPages();
    this.clickEventSubscription = this.pokeService
      .getClickEvent()
      .subscribe(() => {
        this.limit.patchValue(10);
        this.currentPage = 1;
        this.pagesSelect = 1;
      });

    this.limit.valueChanges.subscribe((res: number) => {
      // mi sottoscrivo al valore che cambia
      this.limitUpdated = res;
      this.pokeService
        .httpGetPokemonByPagination(this.offset, this.limitUpdated)
        .subscribe((res) => {
          this.pokeService.getPokemonsData(res.results, res.count);
          this.updateTotalPages();
        });
      // calcolo il totale della pagine dividendo il numero totale dei pokemon per gli elementi da visualizzare
      if (this.currentPage <= 0) {
        console.log('sono in if');
        this.currentPage = 1;
      } else {
        // calcolo la pagina attuale dividendo il totale delle pagine per gli elementi visualizzati SBAGLIATO
        this.currentPage = Math.trunc(this.offset / this.limit.value);
        console.log('sono in else');
      }
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
    this.currentPage = pagina;
    this.offset = this.currentPage * this.limit.value - this.limit.value;
    this.getPokemon(this.offset,this.limit.value)
  }

  clickOnPokeball(url: string) {
      this.currentPage = 1;
      this.pokeService.httpGetPokemonDetail(url).subscribe((res) => {
        this.pokeService.getPokemonDetail(res);
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
    this.totalPages = Math.trunc(
      this.pokeService.pokemonsCountTotal / this.limitUpdated
    );
    if (this.pokeService.pokemonsCountTotal % this.limit.value != 0) {
      this.totalPages++;
    }
  }

  getPokemon(offset: number, limit: number) { // funzione centralizzata per andare a fare le chiamate
    this.pokeService
      .httpGetPokemonByPagination(offset, limit)
      .subscribe((res) => {
        this.pokeService.getPokemonsData(res.results, res.count);
      });
    console.log(this.offset, this.limit.value);
  }
  selectedPokemon(index:number){
    const elem = document.getElementsByClassName(".listOfElements")[1]
    document.documentElement.style.setProperty('background-color', 'lime')
    console.log(elem)
    
  }
}
