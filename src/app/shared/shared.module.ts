import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpennerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";

const components = [
    AlertComponent,
    LoadingSpennerComponent,
    PlaceholderDirective,
    DropdownDirective
];

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpennerComponent,
        PlaceholderDirective,
        DropdownDirective
    ],
    exports: [
        AlertComponent,
        LoadingSpennerComponent,
        PlaceholderDirective,
        DropdownDirective,
        CommonModule
    ],
    imports: [
        CommonModule
    ]
})
export class SharedModule {

}