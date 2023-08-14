import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';


@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true,
    },
  ],
})

export class CustomDropdownComponent implements ControlValueAccessor, AfterViewInit {

  @ViewChild('dropdown', { static: true }) dropdown!: ElementRef<any>;

  @Input() placeholder: string = 'Select an option'
  @Input() items: Array<string> = [];
  @Input() selectedItem: string | null = null;

  @Output() selectedItemChange = new EventEmitter<string | null>()
  @Output() onSelection = new EventEmitter<string | null>()

  open = false;
  disabled = false;

  private onChange = (_: string | null) => { };
  private onTouch = () => { };

  ngAfterViewInit(): void {
    console.log(this.dropdown);
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    const clickedInside = this.dropdown.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.closeDropdown();
      this.onTouch();
    }
  }

  @HostListener('blur')
  public onTouched() {
    this.closeDropdown();
    this.onTouch();
  }

  get selectedValue() {
    return this.selectedItem
  }

  writeValue(item: string): void {
    this.selectedItem = item;
    this.onChange(this.selectedItem);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onItemClick(item: string) {
    if (!this.disabled) {
      const found = this.isItemAlreadySelected(item);
      if (!found) {
        this.select(item);
      }
      this.onChange(this.selectedItem);
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  isItemAlreadySelected(clickedItem: any) {
    return (clickedItem === this.selectedItem)
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.open = !this.open;
    }
  }

  closeDropdown() {
    this.open = false;
  }

  private select(item: string) {
    this.selectedItem = item;
    this.open = false
    this.selectedItemChange.emit(item);
    this.onSelection.emit(item)
  }
}
