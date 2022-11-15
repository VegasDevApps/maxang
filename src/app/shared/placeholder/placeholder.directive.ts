import { Directive, ViewContainerRef } from "@angular/core";

@Directive({selector: '[appPlacehoder]'})
export class PlaceholderDirective {
    constructor(public viewContainerRef: ViewContainerRef){}
}