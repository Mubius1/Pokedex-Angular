import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Utilities {
  pokemons: any; // variabile che contiene tutti i pokemon
  pokemonsCountTotal!: number; // numero totale dei pokemon

  pokeDetails: Array<any> = [];

  inputLength!: number;

  private subject = new Subject<any>();

  constructor(private httpGet: HttpClient) {} // creo una istanza di http client

  sendClickEvent() {
    this.subject.next(event);
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  httpGetPokemonByName(name: string) {
    // fa la chiamata http per la ricerca per nome
    console.log(name);
    return this.httpGet.get<any>(
      `https://pokeapi.co/api/v2/pokemon?offset=0&limit=200000000000000000${name}`
    );
  }
  getPokemonDataByName(name: any) {
    this.pokemons = name;
  }

  httpGetPokemonByPagination(offset: number, limit: number) {
    // per la paginazione lo richiama al click della pokeball
    console.log('questo é il mio limit e offset', offset, limit); // un console log per il debug

    return this.httpGet.get<any>(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    ); // fa il return della chiamata http
  }
  getPokemonsData(pokemons: any, PokemonCount?: any) {
    this.pokemons = pokemons;
    this.pokemonsCountTotal = PokemonCount;
    console.log(PokemonCount); // un console log per il debug
    console.log(pokemons); // un console log per il debug
  }
  httpGetPokemonDetail(ulrDetail: string) {
    return this.httpGet.get<any>(ulrDetail); // fa la chiamata al singolo pokemon
  }
  getPokemonDetail(param: any) {
    this.pokeDetails.push(param); // prende l`oggetto con i dettagli del pokemon
  }
  deletePokemonDetail(arrayIndex: number) {
    this.pokeDetails.splice(arrayIndex, 1);

    console.log('array lunghezza' + this.pokeDetails.length);
    console.log('indice array' + arrayIndex);
  }
  deleteAllPokemonDetail() {
    this.pokeDetails = [];
    console.log('works');
  }

  getDirtyInputValue(value: number) {
    // prende il valore dei caratteri immessi nell`input
    this.inputLength = value;
    console.log(value);
  }

  clearAllPokemons() {
    // pulisce la ricerca
    this.pokemons.length = 0;
  }
}
