import { Directive, EventEmitter, Output, Input } from '@angular/core';
/**
 * CKGroup component
 * Usage :
 *  <ckeditor [(ngModel)]="data" [config]="{...}" debounce="500">
 *      <ckbutton [name]="'SaveButton'" [command]="'saveCommand'" (click)="save($event)"
 *                [icon]="'/save.png'" [toolbar]="'customGroup,1'" [label]="'Save'">
 *      </ckbutton>
 *   </ckeditor>
 */
export class CKButtonDirective {
    constructor() {
        this.click = new EventEmitter();
    }
    initialize(editor) {
        editor.instance.addCommand(this.command, {
            exec: (edit) => {
                this.click.emit(edit);
                return true;
            },
        });
        editor.instance.ui.addButton(this.name, {
            label: this.label,
            command: this.command,
            toolbar: this.toolbar,
            icon: this.icon,
        });
    }
    ngOnInit() {
        if (!this.name) {
            throw new Error('Attribute "name" is required on <ckbutton>');
        }
        if (!this.command) {
            throw new Error('Attribute "command" is required on <ckbutton>');
        }
    }
}
CKButtonDirective.decorators = [
    { type: Directive, args: [{
                selector: 'ckbutton',
            },] }
];
CKButtonDirective.propDecorators = {
    click: [{ type: Output }],
    label: [{ type: Input }],
    command: [{ type: Input }],
    toolbar: [{ type: Input }],
    name: [{ type: Input }],
    icon: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tidXR0b24uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrYnV0dG9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRy9FOzs7Ozs7OztHQVFHO0FBSUgsTUFBTSxPQUFPLGlCQUFpQjtJQUg5QjtRQUlZLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztJQStCeEQsQ0FBQztJQXhCUSxVQUFVLENBQUMsTUFBeUI7UUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUN2QyxJQUFJLEVBQUUsQ0FBQyxJQUFxQixFQUFXLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QixPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUN0QyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztTQUMvRDtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUNsRTtJQUNILENBQUM7OztZQWxDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7YUFDckI7OztvQkFFRSxNQUFNO29CQUNOLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLO21CQUNMLEtBQUs7bUJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgT25Jbml0LCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENLRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9ja2VkaXRvci5jb21wb25lbnQnO1xuXG4vKipcbiAqIENLR3JvdXAgY29tcG9uZW50XG4gKiBVc2FnZSA6XG4gKiAgPGNrZWRpdG9yIFsobmdNb2RlbCldPVwiZGF0YVwiIFtjb25maWddPVwiey4uLn1cIiBkZWJvdW5jZT1cIjUwMFwiPlxuICogICAgICA8Y2tidXR0b24gW25hbWVdPVwiJ1NhdmVCdXR0b24nXCIgW2NvbW1hbmRdPVwiJ3NhdmVDb21tYW5kJ1wiIChjbGljayk9XCJzYXZlKCRldmVudClcIlxuICogICAgICAgICAgICAgICAgW2ljb25dPVwiJy9zYXZlLnBuZydcIiBbdG9vbGJhcl09XCInY3VzdG9tR3JvdXAsMSdcIiBbbGFiZWxdPVwiJ1NhdmUnXCI+XG4gKiAgICAgIDwvY2tidXR0b24+XG4gKiAgIDwvY2tlZGl0b3I+XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2NrYnV0dG9uJyxcbn0pXG5leHBvcnQgY2xhc3MgQ0tCdXR0b25EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICBAT3V0cHV0KCkgY2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPENLRURJVE9SLmVkaXRvcj4oKTtcbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcbiAgQElucHV0KCkgY29tbWFuZDogc3RyaW5nO1xuICBASW5wdXQoKSB0b29sYmFyOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgaWNvbjogc3RyaW5nO1xuXG4gIHB1YmxpYyBpbml0aWFsaXplKGVkaXRvcjogQ0tFZGl0b3JDb21wb25lbnQpOiB2b2lkIHtcbiAgICBlZGl0b3IuaW5zdGFuY2UuYWRkQ29tbWFuZCh0aGlzLmNvbW1hbmQsIHtcbiAgICAgIGV4ZWM6IChlZGl0OiBDS0VESVRPUi5lZGl0b3IpOiBib29sZWFuID0+IHtcbiAgICAgICAgdGhpcy5jbGljay5lbWl0KGVkaXQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBlZGl0b3IuaW5zdGFuY2UudWkuYWRkQnV0dG9uKHRoaXMubmFtZSwge1xuICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICBjb21tYW5kOiB0aGlzLmNvbW1hbmQsXG4gICAgICB0b29sYmFyOiB0aGlzLnRvb2xiYXIsXG4gICAgICBpY29uOiB0aGlzLmljb24sXG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgXCJuYW1lXCIgaXMgcmVxdWlyZWQgb24gPGNrYnV0dG9uPicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuY29tbWFuZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgXCJjb21tYW5kXCIgaXMgcmVxdWlyZWQgb24gPGNrYnV0dG9uPicpO1xuICAgIH1cbiAgfVxufVxuIl19