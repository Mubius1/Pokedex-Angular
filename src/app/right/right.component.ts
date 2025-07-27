import { Component, OnInit } from '@angular/core';
import { Utilities } from '../Services/utilities';


@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})
export class RightComponent implements OnInit {
  
  constructor(public pokeService: Utilities) {
    
   }

  ngOnInit(): void {
    // Inizializzazione del componente
    console.log('Right component initialized');
  }
  OnClickDeletePokemon(index:number){
    this.pokeService.deletePokemonDetail(index)
    // console.log(index)
    
  }
}
