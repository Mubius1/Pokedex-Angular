import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Utilities } from '../Services/utilities';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  name = new FormControl(''); // il form controll dell`input di ricerca

  pokemon: Array<any> = new Array();

  offset: number = 0; // valori di default di offset e number
  limit: number = 10;
  constructor(public pokeService: Utilities) {
    // creo istanza del servizio utilities
  }

  ngOnInit(): void {
    this.name.valueChanges.subscribe((nameRes) => {
      if (nameRes.length >= 3) {
        this.pokeService.httpGetPokemonByName(nameRes).subscribe((res) => {
          this.pokemon = res.results;
          const pokemons = this.pokemon.filter((element) => {
            if (element.name.includes(nameRes)) {
              return true;
            } else {
              return false;
            }
            console.log(element);
          });
          this.pokeService.getPokemonDataByName(pokemons);
          console.log(pokemons);
        });

        console.log(nameRes);
      }
    });

    this.name.valueChanges.subscribe((nameRes) =>
      this.pokeService.getDirtyInputValue(this.name.value.length)
    );
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
      .subscribe((res) => {
        this.pokeService.getPokemonsData(res.results, res.count);
      });
  }

  OnClickClearAllPokemons() {
    // richiamata all`evento click sulla scritta pokemon, chiama il metodo pulisce l`array dei pokemon
    this.pokeService.clearAllPokemons();
  }
  OnClickDeleteAllPokemonDetail() {
    this.pokeService.deleteAllPokemonDetail();
  }
}
