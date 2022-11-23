import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListAction from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Observable<fromApp.AppState['shoppingList']>;
  private subscribtion: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }
  
  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    
    // Before Redux
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.subscribtion = this.shoppingListService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => this.ingredients = ingredients);
  }

  onEditItem(index: number) {
    //this.shoppingListService.stertedEditing.next(index);
    this.store.dispatch(new ShoppingListAction.StartEdit(index));
  }

  ngOnDestroy(): void {
    //this.subscribtion.unsubscribe();
  }

}
