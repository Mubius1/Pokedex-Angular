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
    this.pokeService.pokeDetails = this.pokeService.pokeDetails
  }
  OnClickDeletePokemon(index:number){
    this.pokeService.deletePokemonDetail(index)
    // console.log(index)
    
  }
}
