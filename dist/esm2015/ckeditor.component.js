// Imports
import { Component, Input, Output, ViewChild, EventEmitter, NgZone, forwardRef, ContentChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CKButtonDirective } from './ckbutton.directive';
import { CKGroupDirective } from './ckgroup.directive';
/**
 * CKEditor component
 * Usage :
 *  <ckeditor [(ngModel)]="data" [config]="{...}" debounce="500"></ckeditor>
 */
export class CKEditorComponent {
    /**
     * Constructor
     */
    constructor(zone) {
        this.zone = zone;
        this.change = new EventEmitter();
        this.editorChange = new EventEmitter();
        this.ready = new EventEmitter();
        this.blur = new EventEmitter();
        this.focus = new EventEmitter();
        this.contentDom = new EventEmitter();
        this.fileUploadRequest = new EventEmitter();
        this.fileUploadResponse = new EventEmitter();
        this.paste = new EventEmitter();
        this.drop = new EventEmitter();
        this._value = '';
        this.destroyed = false;
    }
    get value() {
        return this._value;
    }
    set value(v) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }
    ngOnChanges(changes) {
        if (changes.readonly && this.instance) {
            this.instance.setReadOnly(changes.readonly.currentValue);
        }
    }
    /**
     * On component destroy
     */
    ngOnDestroy() {
        this.destroyed = true;
        this.zone.runOutsideAngular(() => {
            if (this.instance) {
                this.instance.destroy();
                this.instance = null;
            }
        });
    }
    /**
     * On component view init
     */
    ngAfterViewInit() {
        if (this.destroyed) {
            return;
        }
        this.ckeditorInit(this.config || {});
    }
    /**
     * On component view checked
     */
    ngAfterViewChecked() {
        this.ckeditorInit(this.config || {});
    }
    /**
     * Value update process
     */
    updateValue(value) {
        this.zone.run(() => {
            this.value = value;
            this.onChange(value);
            this.onTouched();
            this.change.emit(value);
        });
    }
    /**
     * CKEditor init
     */
    ckeditorInit(config) {
        if (typeof CKEDITOR === 'undefined') {
            console.warn('CKEditor 4.x is missing (http://ckeditor.com/)');
        }
        else {
            // Check textarea exists
            if (this.instance || !this.documentContains(this.host.nativeElement)) {
                return;
            }
            if (this.readonly) {
                config.readOnly = this.readonly;
            }
            // CKEditor replace textarea
            this.instance = CKEDITOR.replace(this.host.nativeElement, config);
            // Set initial value
            this.instance.setData(this.value);
            // listen for instanceReady event
            this.instance.on('instanceReady', (evt) => {
                // if value has changed while instance loading
                // update instance with current component value
                if (this.instance.getData() !== this.value) {
                    this.instance.setData(this.value);
                }
                // send the evt to the EventEmitter
                this.ready.emit(evt);
            });
            // CKEditor change event
            this.instance.on('change', (evt) => {
                this.onTouched();
                const value = this.instance.getData();
                if (this.value !== value) {
                    // Debounce update
                    if (this.debounce) {
                        if (this.debounceTimeout) {
                            clearTimeout(this.debounceTimeout);
                        }
                        this.debounceTimeout = window.setTimeout(() => {
                            this.updateValue(value);
                            this.debounceTimeout = null;
                        }, parseInt(this.debounce));
                        // Live update
                    }
                    else {
                        this.updateValue(value);
                    }
                }
                // Original ckeditor event dispatch
                this.editorChange.emit(evt);
            });
            // CKEditor blur event
            this.instance.on('blur', (evt) => {
                this.blur.emit(evt);
            });
            // CKEditor focus event
            this.instance.on('focus', (evt) => {
                this.focus.emit(evt);
            });
            // CKEditor contentDom event
            this.instance.on('contentDom', (evt) => {
                this.contentDom.emit(evt);
            });
            // CKEditor fileUploadRequest event
            this.instance.on('fileUploadRequest', (evt) => {
                this.fileUploadRequest.emit(evt);
            });
            // CKEditor fileUploadResponse event
            this.instance.on('fileUploadResponse', (evt) => {
                this.fileUploadResponse.emit(evt);
            });
            // CKEditor paste event
            this.instance.on('paste', (evt) => {
                this.paste.emit(evt);
            });
            // CKEditor drop event
            this.instance.on('drop', (evt) => {
                this.drop.emit(evt);
            });
            // Add Toolbar Groups to Editor. This will also add Buttons within groups.
            this.toolbarGroups.forEach((group) => {
                group.initialize(this);
            });
            // Add Toolbar Buttons to Editor.
            this.toolbarButtons.forEach((button) => {
                button.initialize(this);
            });
        }
    }
    /**
     * Implements ControlValueAccessor
     */
    writeValue(value) {
        this._value = value;
        if (this.instance)
            this.instance.setData(value);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    documentContains(node) {
        return document.contains ? document.contains(node) : document.body.contains(node);
    }
}
CKEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'ckeditor',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => CKEditorComponent),
                        multi: true,
                    },
                ],
                template: `<textarea #host></textarea>`
            },] }
];
CKEditorComponent.ctorParameters = () => [
    { type: NgZone }
];
CKEditorComponent.propDecorators = {
    config: [{ type: Input }],
    readonly: [{ type: Input }],
    debounce: [{ type: Input }],
    change: [{ type: Output }],
    editorChange: [{ type: Output }],
    ready: [{ type: Output }],
    blur: [{ type: Output }],
    focus: [{ type: Output }],
    contentDom: [{ type: Output }],
    fileUploadRequest: [{ type: Output }],
    fileUploadResponse: [{ type: Output }],
    paste: [{ type: Output }],
    drop: [{ type: Output }],
    host: [{ type: ViewChild, args: ['host', { static: false },] }],
    toolbarButtons: [{ type: ContentChildren, args: [CKButtonDirective,] }],
    toolbarGroups: [{ type: ContentChildren, args: [CKGroupDirective,] }],
    value: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLFVBQVUsRUFHVixlQUFlLEVBS2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXZEOzs7O0dBSUc7QUFZSCxNQUFNLE9BQU8saUJBQWlCO0lBMEI1Qjs7T0FFRztJQUNILFlBQW9CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBeEJ0QixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQXNCLENBQUM7UUFDaEQsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBc0IsQ0FBQztRQUN0RCxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQXNCLENBQUM7UUFDL0MsU0FBSSxHQUFHLElBQUksWUFBWSxFQUFzQixDQUFDO1FBQzlDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBc0IsQ0FBQztRQUMvQyxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQXNCLENBQUM7UUFDcEQsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQXNCLENBQUM7UUFDM0QsdUJBQWtCLEdBQUcsSUFBSSxZQUFZLEVBQXNCLENBQUM7UUFDNUQsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFzQixDQUFDO1FBQy9DLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBc0IsQ0FBQztRQU94RCxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBR0osY0FBUyxHQUFHLEtBQUssQ0FB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QUUsVUFBVTtnQkFDcEIsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUM7d0JBQ2hELEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGO2dCQUNELFFBQVEsRUFBRSw2QkFBNkI7YUFDeEM7OztZQTdCQyxNQUFNOzs7cUJBK0JMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3FCQUVMLE1BQU07MkJBQ04sTUFBTTtvQkFDTixNQUFNO21CQUNOLE1BQU07b0JBQ04sTUFBTTt5QkFDTixNQUFNO2dDQUNOLE1BQU07aUNBQ04sTUFBTTtvQkFDTixNQUFNO21CQUNOLE1BQU07bUJBRU4sU0FBUyxTQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7NkJBRW5DLGVBQWUsU0FBQyxpQkFBaUI7NEJBQ2pDLGVBQWUsU0FBQyxnQkFBZ0I7b0JBZ0JoQyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW1wb3J0c1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIEV2ZW50RW1pdHRlcixcbiAgTmdab25lLFxuICBmb3J3YXJkUmVmLFxuICBRdWVyeUxpc3QsXG4gIEFmdGVyVmlld0luaXQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIEVsZW1lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IENLQnV0dG9uRGlyZWN0aXZlIH0gZnJvbSAnLi9ja2J1dHRvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ0tHcm91cERpcmVjdGl2ZSB9IGZyb20gJy4vY2tncm91cC5kaXJlY3RpdmUnO1xuXG4vKipcbiAqIENLRWRpdG9yIGNvbXBvbmVudFxuICogVXNhZ2UgOlxuICogIDxja2VkaXRvciBbKG5nTW9kZWwpXT1cImRhdGFcIiBbY29uZmlnXT1cInsuLi59XCIgZGVib3VuY2U9XCI1MDBcIj48L2NrZWRpdG9yPlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdja2VkaXRvcicsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ0tFZGl0b3JDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgfSxcbiAgXSxcbiAgdGVtcGxhdGU6IGA8dGV4dGFyZWEgI2hvc3Q+PC90ZXh0YXJlYT5gLFxufSlcbmV4cG9ydCBjbGFzcyBDS0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgY29uZmlnOiBDS0VESVRPUi5jb25maWc7XG4gIEBJbnB1dCgpIHJlYWRvbmx5OiBib29sZWFuO1xuICBASW5wdXQoKSBkZWJvdW5jZTogc3RyaW5nO1xuXG4gIEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENLRURJVE9SLmV2ZW50SW5mbz4oKTtcbiAgQE91dHB1dCgpIGVkaXRvckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFRElUT1IuZXZlbnRJbmZvPigpO1xuICBAT3V0cHV0KCkgcmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPENLRURJVE9SLmV2ZW50SW5mbz4oKTtcbiAgQE91dHB1dCgpIGJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPENLRURJVE9SLmV2ZW50SW5mbz4oKTtcbiAgQE91dHB1dCgpIGZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VESVRPUi5ldmVudEluZm8+KCk7XG4gIEBPdXRwdXQoKSBjb250ZW50RG9tID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VESVRPUi5ldmVudEluZm8+KCk7XG4gIEBPdXRwdXQoKSBmaWxlVXBsb2FkUmVxdWVzdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFRElUT1IuZXZlbnRJbmZvPigpO1xuICBAT3V0cHV0KCkgZmlsZVVwbG9hZFJlc3BvbnNlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VESVRPUi5ldmVudEluZm8+KCk7XG4gIEBPdXRwdXQoKSBwYXN0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFRElUT1IuZXZlbnRJbmZvPigpO1xuICBAT3V0cHV0KCkgZHJvcCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFRElUT1IuZXZlbnRJbmZvPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2hvc3QnLCB7IHN0YXRpYzogZmFsc2UgfSkgaG9zdDogRWxlbWVudFJlZjxIVE1MVGV4dEFyZWFFbGVtZW50PjtcblxuICBAQ29udGVudENoaWxkcmVuKENLQnV0dG9uRGlyZWN0aXZlKSB0b29sYmFyQnV0dG9uczogUXVlcnlMaXN0PENLQnV0dG9uRGlyZWN0aXZlPjtcbiAgQENvbnRlbnRDaGlsZHJlbihDS0dyb3VwRGlyZWN0aXZlKSB0b29sYmFyR3JvdXBzOiBRdWVyeUxpc3Q8Q0tHcm91cERpcmVjdGl2ZT47XG5cbiAgX3ZhbHVlID0gJyc7XG4gIGluc3RhbmNlOiBDS0VESVRPUi5lZGl0b3I7XG4gIGRlYm91bmNlVGltZW91dDogbnVtYmVyO1xuICBwcml2YXRlIGRlc3Ryb3llZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHt9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHZhbHVlKHY6IHN0cmluZykge1xuICAgIGlmICh2ICE9PSB0aGlzLl92YWx1ZSkge1xuICAgICAgdGhpcy5fdmFsdWUgPSB2O1xuICAgICAgdGhpcy5vbkNoYW5nZSh2KTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMucmVhZG9ubHkgJiYgdGhpcy5pbnN0YW5jZSkge1xuICAgICAgdGhpcy5pbnN0YW5jZS5zZXRSZWFkT25seShjaGFuZ2VzLnJlYWRvbmx5LmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIGNvbXBvbmVudCBkZXN0cm95XG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmluc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBjb21wb25lbnQgdmlldyBpbml0XG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY2tlZGl0b3JJbml0KHRoaXMuY29uZmlnIHx8IHt9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbiBjb21wb25lbnQgdmlldyBjaGVja2VkXG4gICAqL1xuICBuZ0FmdGVyVmlld0NoZWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5ja2VkaXRvckluaXQodGhpcy5jb25maWcgfHwge30pO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbHVlIHVwZGF0ZSBwcm9jZXNzXG4gICAqL1xuICB1cGRhdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuXG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ0tFZGl0b3IgaW5pdFxuICAgKi9cbiAgY2tlZGl0b3JJbml0KGNvbmZpZzogQ0tFRElUT1IuY29uZmlnKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBDS0VESVRPUiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUud2FybignQ0tFZGl0b3IgNC54IGlzIG1pc3NpbmcgKGh0dHA6Ly9ja2VkaXRvci5jb20vKScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDaGVjayB0ZXh0YXJlYSBleGlzdHNcbiAgICAgIGlmICh0aGlzLmluc3RhbmNlIHx8ICF0aGlzLmRvY3VtZW50Q29udGFpbnModGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgY29uZmlnLnJlYWRPbmx5ID0gdGhpcy5yZWFkb25seTtcbiAgICAgIH1cbiAgICAgIC8vIENLRWRpdG9yIHJlcGxhY2UgdGV4dGFyZWFcbiAgICAgIHRoaXMuaW5zdGFuY2UgPSBDS0VESVRPUi5yZXBsYWNlKHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LCBjb25maWcpO1xuXG4gICAgICAvLyBTZXQgaW5pdGlhbCB2YWx1ZVxuICAgICAgdGhpcy5pbnN0YW5jZS5zZXREYXRhKHRoaXMudmFsdWUpO1xuXG4gICAgICAvLyBsaXN0ZW4gZm9yIGluc3RhbmNlUmVhZHkgZXZlbnRcbiAgICAgIHRoaXMuaW5zdGFuY2Uub24oJ2luc3RhbmNlUmVhZHknLCAoZXZ0OiBDS0VESVRPUi5ldmVudEluZm8pID0+IHtcbiAgICAgICAgLy8gaWYgdmFsdWUgaGFzIGNoYW5nZWQgd2hpbGUgaW5zdGFuY2UgbG9hZGluZ1xuICAgICAgICAvLyB1cGRhdGUgaW5zdGFuY2Ugd2l0aCBjdXJyZW50IGNvbXBvbmVudCB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5pbnN0YW5jZS5nZXREYXRhKCkgIT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmluc3RhbmNlLnNldERhdGEodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZW5kIHRoZSBldnQgdG8gdGhlIEV2ZW50RW1pdHRlclxuICAgICAgICB0aGlzLnJlYWR5LmVtaXQoZXZ0KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDS0VkaXRvciBjaGFuZ2UgZXZlbnRcbiAgICAgIHRoaXMuaW5zdGFuY2Uub24oJ2NoYW5nZScsIChldnQ6IENLRURJVE9SLmV2ZW50SW5mbykgPT4ge1xuICAgICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaW5zdGFuY2UuZ2V0RGF0YSgpO1xuXG4gICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgIC8vIERlYm91bmNlIHVwZGF0ZVxuICAgICAgICAgIGlmICh0aGlzLmRlYm91bmNlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kZWJvdW5jZVRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZGVib3VuY2VUaW1lb3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVib3VuY2VUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgICAgdGhpcy5kZWJvdW5jZVRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgfSwgcGFyc2VJbnQodGhpcy5kZWJvdW5jZSkpO1xuXG4gICAgICAgICAgICAvLyBMaXZlIHVwZGF0ZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcmlnaW5hbCBja2VkaXRvciBldmVudCBkaXNwYXRjaFxuICAgICAgICB0aGlzLmVkaXRvckNoYW5nZS5lbWl0KGV2dCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ0tFZGl0b3IgYmx1ciBldmVudFxuICAgICAgdGhpcy5pbnN0YW5jZS5vbignYmx1cicsIChldnQ6IENLRURJVE9SLmV2ZW50SW5mbykgPT4ge1xuICAgICAgICB0aGlzLmJsdXIuZW1pdChldnQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENLRWRpdG9yIGZvY3VzIGV2ZW50XG4gICAgICB0aGlzLmluc3RhbmNlLm9uKCdmb2N1cycsIChldnQ6IENLRURJVE9SLmV2ZW50SW5mbykgPT4ge1xuICAgICAgICB0aGlzLmZvY3VzLmVtaXQoZXZ0KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDS0VkaXRvciBjb250ZW50RG9tIGV2ZW50XG4gICAgICB0aGlzLmluc3RhbmNlLm9uKCdjb250ZW50RG9tJywgKGV2dDogQ0tFRElUT1IuZXZlbnRJbmZvKSA9PiB7XG4gICAgICAgIHRoaXMuY29udGVudERvbS5lbWl0KGV2dCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ0tFZGl0b3IgZmlsZVVwbG9hZFJlcXVlc3QgZXZlbnRcbiAgICAgIHRoaXMuaW5zdGFuY2Uub24oJ2ZpbGVVcGxvYWRSZXF1ZXN0JywgKGV2dDogQ0tFRElUT1IuZXZlbnRJbmZvKSA9PiB7XG4gICAgICAgIHRoaXMuZmlsZVVwbG9hZFJlcXVlc3QuZW1pdChldnQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENLRWRpdG9yIGZpbGVVcGxvYWRSZXNwb25zZSBldmVudFxuICAgICAgdGhpcy5pbnN0YW5jZS5vbignZmlsZVVwbG9hZFJlc3BvbnNlJywgKGV2dDogQ0tFRElUT1IuZXZlbnRJbmZvKSA9PiB7XG4gICAgICAgIHRoaXMuZmlsZVVwbG9hZFJlc3BvbnNlLmVtaXQoZXZ0KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDS0VkaXRvciBwYXN0ZSBldmVudFxuICAgICAgdGhpcy5pbnN0YW5jZS5vbigncGFzdGUnLCAoZXZ0OiBDS0VESVRPUi5ldmVudEluZm8pID0+IHtcbiAgICAgICAgdGhpcy5wYXN0ZS5lbWl0KGV2dCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ0tFZGl0b3IgZHJvcCBldmVudFxuICAgICAgdGhpcy5pbnN0YW5jZS5vbignZHJvcCcsIChldnQ6IENLRURJVE9SLmV2ZW50SW5mbykgPT4ge1xuICAgICAgICB0aGlzLmRyb3AuZW1pdChldnQpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEFkZCBUb29sYmFyIEdyb3VwcyB0byBFZGl0b3IuIFRoaXMgd2lsbCBhbHNvIGFkZCBCdXR0b25zIHdpdGhpbiBncm91cHMuXG4gICAgICB0aGlzLnRvb2xiYXJHcm91cHMuZm9yRWFjaCgoZ3JvdXApID0+IHtcbiAgICAgICAgZ3JvdXAuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgIH0pO1xuICAgICAgLy8gQWRkIFRvb2xiYXIgQnV0dG9ucyB0byBFZGl0b3IuXG4gICAgICB0aGlzLnRvb2xiYXJCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIGlmICh0aGlzLmluc3RhbmNlKSB0aGlzLmluc3RhbmNlLnNldERhdGEodmFsdWUpO1xuICB9XG5cbiAgb25DaGFuZ2U6IChfOiBzdHJpbmcpID0+IHZvaWQ7XG5cbiAgb25Ub3VjaGVkOiAoKSA9PiB2b2lkO1xuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBwcml2YXRlIGRvY3VtZW50Q29udGFpbnMobm9kZTogTm9kZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jb250YWlucyA/IGRvY3VtZW50LmNvbnRhaW5zKG5vZGUpIDogZG9jdW1lbnQuYm9keS5jb250YWlucyhub2RlKTtcbiAgfVxufVxuIl19