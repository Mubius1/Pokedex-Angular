import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Utilities {
  pokemons: any; // variabile che contiene tutti i pokemon
  pokemonsCountTotal!: number; // numero totale dei pokemon

  pokeDetails: Array<any> = [];
  pokemonListWithDetails: Array<any> = []; // lista con dettagli completi

  inputLength!: number;

  private subject = new Subject<any>();

  constructor(private httpGet: HttpClient) {} // creo una istanza di http client

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

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
      `https://pokeapi.co/api/v2/pokemon?offset=0&limit=2000`
    ).pipe(
      catchError(this.handleError)
    );
  }
  getPokemonDataByName(name: any) {
    this.pokemons = name;
    this.pokemonListWithDetails = []; // Reset della lista con dettagli
    // Carica i dettagli anche per i risultati della ricerca
    if (name && name.length > 0) {
      this.loadPokemonDetails(name);
    }
  }

  httpGetPokemonByPagination(offset: number, limit: number) {
    // per la paginazione lo richiama al click della pokeball
    console.log('questo é il mio limit e offset', offset, limit); // un console log per il debug

    return this.httpGet.get<any>(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    ).pipe(
      catchError(this.handleError)
    ); // fa il return della chiamata http
  }
  getPokemonsData(pokemons: any, PokemonCount?: any) {
    this.pokemons = pokemons;
    this.pokemonsCountTotal = PokemonCount;
    console.log(PokemonCount); // un console log per il debug
    console.log(pokemons); // un console log per il debug
    
    // Carica i dettagli per ogni Pokémon nella lista
    this.loadPokemonDetails(pokemons);
  }
  httpGetPokemonDetail(ulrDetail: string) {
    return this.httpGet.get<any>(ulrDetail).pipe(
      catchError(this.handleError)
    ); // fa la chiamata al singolo pokemon
  }
  getPokemonDetail(param: any) {
    // Controlla se il Pokémon è già presente per evitare duplicati
    const existingIndex = this.pokeDetails.findIndex(pokemon => pokemon.id === param.id);
    if (existingIndex === -1) {
      this.pokeDetails.push(param); // prende l`oggetto con i dettagli del pokemon
      console.log('Pokemon aggiunto:', param.name);
    } else {
      console.log('Pokemon già presente:', param.name);
    }
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
    if (this.pokemons && Array.isArray(this.pokemons)) {
      this.pokemons.length = 0;
    } else {
      this.pokemons = [];
    }
    // Pulisce anche la lista con dettagli
    this.pokemonListWithDetails = [];
  }

  // Metodo per verificare se i dati sono validi
  isValidPokemonData(data: any): boolean {
    return data && Array.isArray(data) && data.length > 0;
  }

  // Carica i dettagli per ogni Pokémon nella lista
  private loadPokemonDetails(pokemons: any[]) {
    this.pokemonListWithDetails = [];
    
    // Inizializza l'array con i dati base
    pokemons.forEach((pokemon, index) => {
      this.pokemonListWithDetails[index] = pokemon;
    });
    
    // Carica i dettagli per ogni Pokémon
    pokemons.forEach((pokemon, index) => {
      this.httpGetPokemonDetail(pokemon.url).subscribe({
        next: (details) => {
          // Aggiorna i dettagli nella lista
          this.pokemonListWithDetails[index] = {
            ...pokemon,
            details: details
          };
          // Forza l'aggiornamento del template
          this.pokemonListWithDetails = [...this.pokemonListWithDetails];
        },
        error: (error) => {
          console.error('Error loading pokemon details:', error);
          // In caso di errore, mantieni i dati base
        }
      });
    });
  }

  // Ottieni il tipo di un Pokémon
  getPokemonType(pokemon: any): string {
    // Controlla se abbiamo i dettagli completi
    if (pokemon.details && pokemon.details.types && pokemon.details.types.length > 0) {
      return pokemon.details.types[0].type.name;
    }
    
    // Se non abbiamo i dettagli, prova a estrarre il tipo dall'URL
    // L'URL contiene informazioni sul Pokémon che possiamo usare
    if (pokemon.url) {
      const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
      if (pokemonId) {
        // Per ora restituiamo 'normal' come fallback
        // In futuro potremmo implementare una cache locale dei tipi
        return 'normal';
      }
    }
    
    return 'normal'; // tipo di default
  }

  // Ottieni l'icona del tipo
  getTypeIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      'normal': '⚪',
      'fire': '🔥',
      'water': '💧',
      'electric': '⚡',
      'grass': '🌿',
      'ice': '❄️',
      'fighting': '👊',
      'poison': '☠️',
      'ground': '🌍',
      'flying': '🦅',
      'psychic': '🔮',
      'bug': '🐛',
      'rock': '🪨',
      'ghost': '👻',
      'dragon': '🐉',
      'dark': '🌑',
      'steel': '⚙️',
      'fairy': '🧚'
    };
    return typeIcons[type] || '⚪';
  }

  // Forza il caricamento dei dettagli per un Pokémon specifico
  forceLoadPokemonDetails(pokemon: any, index: number): void {
    if (pokemon.url && (!pokemon.details || !pokemon.details.types)) {
      this.httpGetPokemonDetail(pokemon.url).subscribe({
        next: (details) => {
          this.pokemonListWithDetails[index] = {
            ...pokemon,
            details: details
          };
          // Forza l'aggiornamento del template
          this.pokemonListWithDetails = [...this.pokemonListWithDetails];
        },
        error: (error) => {
          console.error('Error loading pokemon details:', error);
        }
      });
    }
  }
}
