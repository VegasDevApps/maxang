import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  constructor(private shoppingListService: ShoppingListService) { }
  
  @ViewChild('form', { static: false }) slForm: NgForm;
  
  private subscription: Subscription
  editMode = false;
  private editingItemIndex: number;
  private editedIngredient: Ingredient;

  ngOnInit() {
    this.subscription = this.shoppingListService.stertedEditing.subscribe(
      (index: number) => { 
        this.editMode = true;
        this.editingItemIndex = index;
        this.editedIngredient = this.shoppingListService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      });
  }

  onSubmit() {
    
    const { name: ingName, amount: ingAmount } = this.slForm.value;

    if (ingName.length && ingAmount) {
      const newIngredient = new Ingredient(ingName, ingAmount);

      if (this.editMode) {
        this.shoppingListService.updateIngredient(this.editingItemIndex, newIngredient);
      } else {
        this.shoppingListService.addIngrediant(newIngredient);
      }
      this.editMode = false;
      this.slForm.reset();
    }
    
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editingItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
