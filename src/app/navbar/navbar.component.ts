import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Utilities } from '../Services/utilities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  name = new FormControl(''); // il form controll dell`input di ricerca

  pokemon: Array<any> = new Array();

  offset: number = 0; // valori di default di offset e number
  limit: number = 10;

  private subscriptions: Subscription[] = [];
  constructor(public pokeService: Utilities) {
    // creo istanza del servizio utilities
  }

  ngOnInit(): void {
    const nameSubscription = this.name.valueChanges.subscribe((nameRes) => {
      if (nameRes && nameRes.length >= 3) {
        this.pokeService.httpGetPokemonByName(nameRes).subscribe({
          next: (res) => {
            this.pokemon = res.results;
            const pokemons = this.pokemon.filter((element) => 
              element.name.toLowerCase().includes(nameRes.toLowerCase())
            );
            this.pokeService.getPokemonDataByName(pokemons);
            console.log(pokemons);
          },
          error: (error) => {
            console.error('Error fetching pokemon:', error);
            this.pokeService.getPokemonDataByName([]);
          }
        });
        console.log(nameRes);
      } else if (nameRes && nameRes.length === 0) {
        // Reset quando l'input è vuoto
        this.pokeService.clearAllPokemons();
      }
    });

    const inputLengthSubscription = this.name.valueChanges.subscribe((nameRes) =>
      this.pokeService.getDirtyInputValue(this.name.value.length)
    );

    this.subscriptions.push(nameSubscription, inputLengthSubscription);
    // controlla la lunghezza del testo immesso per disabilitare il footer, questa funzionalitá ha bisogno di alcuni accorgimenti nel template del left component
  }

  OnFocusOutResetInputValue() {
    console.log('focus out trigger');
    this.name.setValue('');
  }

  OnClickGetPokemonByPagination() {
    // richimata al click sulla pokeball mostra tutti i pokemon con la paginazione
    this.pokeService.sendClickEvent();
    this.pokeService
      .httpGetPokemonByPagination(this.offset, this.limit)
      .subscribe({
        next: (res) => {
          this.pokeService.getPokemonsData(res.results, res.count);
        },
        error: (error) => {
          console.error('Error fetching pokemon pagination:', error);
        }
      });
  }

  OnClickClearAllPokemons() {
    // richiamata all`evento click sulla scritta pokemon, chiama il metodo pulisce l`array dei pokemon
    this.pokeService.clearAllPokemons();
  }
  OnClickDeleteAllPokemonDetail() {
    this.pokeService.deleteAllPokemonDetail();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
