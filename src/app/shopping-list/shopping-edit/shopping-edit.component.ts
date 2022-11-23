import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListAction from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  constructor(private store: Store<fromApp.AppState>) { }
  
  @ViewChild('form', { static: false }) slForm: NgForm;
  
  private subscription: Subscription
  editMode = false;
  private editedIngredient: Ingredient;

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedIngredient = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      } else {
        this.editMode = false;
      }

    });

    // this.subscription = this.shoppingListService.stertedEditing.subscribe(
    //   (index: number) => { 
    //     this.editMode = true;
    //     this.editingItemIndex = index;
    //     this.editedIngredient = this.shoppingListService.getIngredient(index);
    //     this.slForm.setValue({
    //       name: this.editedIngredient.name,
    //       amount: this.editedIngredient.amount
    //     });
    //   });
  }

  onSubmit() {
    
    const { name: ingName, amount: ingAmount } = this.slForm.value;

    if (ingName.length && ingAmount) {
      const newIngredient = new Ingredient(ingName, ingAmount);

      if (this.editMode) {
        //this.shoppingListService.updateIngredient(this.editingItemIndex, newIngredient);
        this.store.dispatch(new ShoppingListAction.UpdateIngredient(newIngredient));
      } else {
        //this.shoppingListService.addIngrediant(newIngredient);
        this.store.dispatch(new ShoppingListAction.AddIngredient(newIngredient));
      }
      this.editMode = false;
      this.slForm.reset();
    }
    
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

  onDelete() {
    //this.shoppingListService.deleteIngredient(this.editingItemIndex);
    this.store.dispatch(new ShoppingListAction.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }
}
