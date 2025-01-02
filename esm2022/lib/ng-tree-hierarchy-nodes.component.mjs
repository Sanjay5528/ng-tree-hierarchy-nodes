import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgTreeHierarchyNodesService } from './ng-tree-hierarchy-nodes.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/form-field";
import * as i2 from "@angular/material/input";
import * as i3 from "@angular/material/checkbox";
import * as i4 from "@angular/material/tree";
import * as i5 from "@angular/material/icon";
import * as i6 from "@angular/material/autocomplete";
import * as i7 from "@angular/material/core";
// Define data models
export class ParentNode {
}
export class TreeSelectiontype {
    constructor() {
        this.leafNode = "leafNode";
        this.parentNode = "parentNode";
    }
}
export class LeafNode {
}
export class config {
    constructor() {
        this.primaryKey = '_id';
        this.placeholder = 'No items available';
        this.showDisabledText = 'Select the Item Below';
        this.parentSelectionAvailable = false;
        this.onSelectionToggle = false;
        this.expandAll = false;
    }
}
export class NgTreeHierarchyNodesComponent {
    constructor() {
        this.ngModelChanage = new EventEmitter(true);
        this.data = [];
        this.selectedValue = [];
        this.config = {
            primaryKey: '_id',
            showDisabledText: 'No items available',
            placeholder: "Select items",
            parentSelectionAvailable: false,
            onSelectionToggle: false,
            expandAll: false
        };
        this.checklistSelection = new SelectionModel(true);
        this.flatNodeMap = new Map();
        this.nestedNodeMap = new Map();
        this.TreeStructService = inject(NgTreeHierarchyNodesService);
        this.transformer = (node, level) => {
            const flatNode = this.nestedNodeMap.get(node) || new LeafNode();
            flatNode.item = node.item;
            flatNode.level = level;
            flatNode.expandable = !!node.children;
            flatNode[this.config.primaryKey] = node[this.config.primaryKey];
            this.flatNodeMap.set(flatNode, node);
            this.nestedNodeMap.set(node, flatNode);
            return flatNode;
        };
        this.getLevel = (node) => node.level || 0;
        this.isExpandable = (node) => node.expandable || false;
        this.getChildren = (node) => node.children || [];
        this.hasChild = (_, node) => node.expandable;
    }
    ngOnInit() {
        console.error("INIT");
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        console.log(this.data);
        this.TreeStructService.init(this.data);
        this.TreeStructService.recordLisner$().subscribe((data) => {
            console.log(this);
            this.dataSource.data = data;
            if (this.config.expandAll) {
                this.treeControl.expandAll();
            }
        });
        console.log(this);
        if (this.selectedValue.length > 0)
            this.setDefaultSelected(this.selectedValue);
    }
    toggleLeafNodeSelection(node) {
        this.checklistSelection.toggle(node);
        if (this.config['parentSelectionAvailable']) {
            this.checkAllParentsSelection(node);
        }
        this.emitSelectedItems(new TreeSelectiontype().leafNode);
    }
    checkAllParentsSelection(node) {
        let parent = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }
    checkRootNodeSelection(node) {
        const descendants = this.treeControl.getDescendants(node);
        const allSelected = descendants.every((child) => this.checklistSelection.isSelected(child));
        allSelected
            ? this.checklistSelection.select(node)
            : this.checklistSelection.deselect(node);
    }
    getParentNode(node) {
        const currentLevel = this.getLevel(node);
        if (currentLevel < 1)
            return null;
        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];
            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }
    getSelectedItems() {
        return (this.checklistSelection.selected.map((node) => node.item).join(', ') ||
            this.config.placeholder);
    }
    descendantsAllSelected(node) {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every((child) => this.checklistSelection.isSelected(child));
    }
    descendantsPartiallySelected(node) {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some((child) => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }
    todoItemSelectionToggle(node, id) {
        if (this.config['onSelectionToggle']) {
            document.getElementById(id).click();
        }
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        if (this.checklistSelection.isSelected(node)) {
            this.checklistSelection.select(...descendants);
        }
        else {
            this.checklistSelection.deselect(...descendants);
        }
        this.checkAllParentsSelection(node);
        this.emitSelectedItems(new TreeSelectiontype().parentNode);
    }
    filterChanged(event) {
        this.TreeStructService.filter(event['value']);
    }
    setDefaultSelected(selectedKeys) {
        if (selectedKeys.length == 0) {
            console.log("No Data Available");
            return;
        }
        console.log("Data Available", selectedKeys);
        const dataNodes = this.treeControl.dataNodes;
        selectedKeys.forEach((key) => {
            const node = dataNodes.find((n) => n[this.config.primaryKey] === key[this.config.primaryKey]);
            if (node) {
                this.checklistSelection.select(node);
                // Ensure all parent nodes are updated
                this.checkAllParentsSelection(node);
            }
        });
    }
    emitSelectedItems(type) {
        const selectedItems = this.checklistSelection.selected;
        this.ngModelChanage.emit({ type, value: selectedItems });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NgTreeHierarchyNodesComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: NgTreeHierarchyNodesComponent, selector: "ng-tree-hierarchy-nodes", inputs: { data: "data", selectedValue: "selectedValue", config: "config" }, outputs: { ngModelChanage: "ngModelChanage" }, ngImport: i0, template: `

  JO
    <mat-form-field class="example-full-width">
      <!-- <mat-label *ngIf="config.label">{{ config.label }}</mat-label> -->
      <input
        type="text"
        placeholder="{{ getSelectedItems() }}" 
        matInput
        (input)="filterChanged($event.target)"
        [matAutocomplete]="auto"
      />
      <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
          <mat-option disabled>{{config["showDisabledText"]}}</mat-option>
				<mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
					<mat-tree-node *matTreeNodeDef="let node"  matTreeNodePadding>
						<mat-checkbox class="checklist-leaf-node" [checked]="checklistSelection.isSelected(node)" (change)="toggleLeafNodeSelection(node)">{{node.item}}</mat-checkbox>
					</mat-tree-node>

					<mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
    <div  style="display: contents;margin-top:2px">
      <mat-icon class="mat-icon-rtl-mirror" matTreeNodeToggle [id]="'toggle' + node.item"> {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}} </mat-icon>
      @if(config['parentSelectionAvailable']){
        <mat-checkbox [checked]="descendantsAllSelected(node)" [indeterminate]="descendantsPartiallySelected(node)" (change)="todoItemSelectionToggle(node,'toggle' + node.item)"></mat-checkbox>
      }
      {{node.item}}
      
    </div>
					</mat-tree-node>
				</mat-tree>
			</mat-autocomplete> 
    </mat-form-field>
  `, isInline: true, styles: [".example-tree-invisible{display:none}.example-tree ul,.example-tree li{margin-top:0;margin-bottom:0;list-style-type:none}.example-form{min-width:150px;max-width:500px;width:100%}.example-full-width{width:100%}.tree-toggle{display:contents;margin-top:2px}\n"], dependencies: [{ kind: "component", type: i1.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i2.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "component", type: i3.MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "directive", type: i4.MatTreeNodeDef, selector: "[matTreeNodeDef]", inputs: ["matTreeNodeDefWhen", "matTreeNode"] }, { kind: "directive", type: i4.MatTreeNodePadding, selector: "[matTreeNodePadding]", inputs: ["matTreeNodePadding", "matTreeNodePaddingIndent"] }, { kind: "directive", type: i4.MatTreeNodeToggle, selector: "[matTreeNodeToggle]", inputs: ["matTreeNodeToggleRecursive"] }, { kind: "component", type: i4.MatTree, selector: "mat-tree", exportAs: ["matTree"] }, { kind: "directive", type: i4.MatTreeNode, selector: "mat-tree-node", inputs: ["role", "disabled", "tabIndex"], exportAs: ["matTreeNode"] }, { kind: "component", type: i5.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: i6.MatAutocomplete, selector: "mat-autocomplete", inputs: ["aria-label", "aria-labelledby", "displayWith", "autoActiveFirstOption", "autoSelectActiveOption", "requireSelection", "panelWidth", "disableRipple", "class", "hideSingleSelectionIndicator"], outputs: ["optionSelected", "opened", "closed", "optionActivated"], exportAs: ["matAutocomplete"] }, { kind: "component", type: i7.MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "directive", type: i6.MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", inputs: ["matAutocomplete", "matAutocompletePosition", "matAutocompleteConnectedTo", "autocomplete", "matAutocompleteDisabled"], exportAs: ["matAutocompleteTrigger"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NgTreeHierarchyNodesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-tree-hierarchy-nodes', template: `

  JO
    <mat-form-field class="example-full-width">
      <!-- <mat-label *ngIf="config.label">{{ config.label }}</mat-label> -->
      <input
        type="text"
        placeholder="{{ getSelectedItems() }}" 
        matInput
        (input)="filterChanged($event.target)"
        [matAutocomplete]="auto"
      />
      <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
          <mat-option disabled>{{config["showDisabledText"]}}</mat-option>
				<mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
					<mat-tree-node *matTreeNodeDef="let node"  matTreeNodePadding>
						<mat-checkbox class="checklist-leaf-node" [checked]="checklistSelection.isSelected(node)" (change)="toggleLeafNodeSelection(node)">{{node.item}}</mat-checkbox>
					</mat-tree-node>

					<mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
    <div  style="display: contents;margin-top:2px">
      <mat-icon class="mat-icon-rtl-mirror" matTreeNodeToggle [id]="'toggle' + node.item"> {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}} </mat-icon>
      @if(config['parentSelectionAvailable']){
        <mat-checkbox [checked]="descendantsAllSelected(node)" [indeterminate]="descendantsPartiallySelected(node)" (change)="todoItemSelectionToggle(node,'toggle' + node.item)"></mat-checkbox>
      }
      {{node.item}}
      
    </div>
					</mat-tree-node>
				</mat-tree>
			</mat-autocomplete> 
    </mat-form-field>
  `, styles: [".example-tree-invisible{display:none}.example-tree ul,.example-tree li{margin-top:0;margin-bottom:0;list-style-type:none}.example-form{min-width:150px;max-width:500px;width:100%}.example-full-width{width:100%}.tree-toggle{display:contents;margin-top:2px}\n"] }]
        }], propDecorators: { ngModelChanage: [{
                type: Output
            }], data: [{
                type: Input
            }], selectedValue: [{
                type: Input
            }], config: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdHJlZS1oaWVyYXJjaHktbm9kZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctdHJlZS1oaWVyYXJjaHktbm9kZXMvc3JjL2xpYi9uZy10cmVlLWhpZXJhcmNoeS1ub2Rlcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDaEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7Ozs7O0FBQ2pGLHFCQUFxQjtBQUNyQixNQUFNLE9BQU8sVUFBVTtDQUl0QjtBQUNELE1BQU0sT0FBTyxpQkFBaUI7SUFBOUI7UUFDRSxhQUFRLEdBQUMsVUFBVSxDQUFDO1FBQ3BCLGVBQVUsR0FBQyxZQUFZLENBQUM7SUFDMUIsQ0FBQztDQUFBO0FBQ0QsTUFBTSxPQUFPLFFBQVE7Q0FLcEI7QUFFRCxNQUFNLE9BQU8sTUFBTTtJQUFuQjtRQUNFLGVBQVUsR0FBVSxLQUFLLENBQUM7UUFDMUIsZ0JBQVcsR0FBVSxvQkFBb0IsQ0FBQztRQUMxQyxxQkFBZ0IsR0FBWSx1QkFBdUIsQ0FBQztRQUNwRCw2QkFBd0IsR0FBWSxLQUFLLENBQUM7UUFDMUMsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLGNBQVMsR0FBWSxLQUFLLENBQUM7SUFDN0IsQ0FBQztDQUFBO0FBa0VELE1BQU0sT0FBTyw2QkFBNkI7SUFqRTFDO1FBa0VZLG1CQUFjLEdBQUcsSUFBSSxZ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QyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBSUQsaUJBQWlCLENBQUMsSUFBUTtRQUN4QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFBO1FBQ3RELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxhQUFhLEVBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7K0dBN0xVLDZCQUE2QjttR0FBN0IsNkJBQTZCLDBMQS9EOUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0NUOzs0RkErQlUsNkJBQTZCO2tCQWpFekMsU0FBUzsrQkFDRSx5QkFBeUIsWUFDekI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0NUOzhCQWdDUyxjQUFjO3NCQUF2QixNQUFNO2dCQUNFLElBQUk7c0JBQVosS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBpbmplY3QsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJzsgXHJcbmltcG9ydCB7IE5nVHJlZUhpZXJhcmNoeU5vZGVzU2VydmljZSB9IGZyb20gJy4vbmctdHJlZS1oaWVyYXJjaHktbm9kZXMuc2VydmljZSc7XHJcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcclxuaW1wb3J0IHsgRmxhdFRyZWVDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xyXG5pbXBvcnQgeyBNYXRUcmVlRmxhdHRlbmVyLCBNYXRUcmVlRmxhdERhdGFTb3VyY2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90cmVlJzsgXHJcbi8vIERlZmluZSBkYXRhIG1vZGVsc1xyXG5leHBvcnQgY2xhc3MgUGFyZW50Tm9kZSB7XHJcbiAgaXRlbSE6IHN0cmluZztcclxuICBjaGlsZHJlbj86IFBhcmVudE5vZGVbXTtcclxuICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFRyZWVTZWxlY3Rpb250eXBlIHtcclxuICBsZWFmTm9kZT1cImxlYWZOb2RlXCI7XHJcbiAgcGFyZW50Tm9kZT1cInBhcmVudE5vZGVcIjtcclxufVxyXG5leHBvcnQgY2xhc3MgTGVhZk5vZGUge1xyXG4gIGl0ZW0hOiBzdHJpbmc7XHJcbiAgbGV2ZWwhOiBudW1iZXI7XHJcbiAgZXhwYW5kYWJsZSE6IGJvb2xlYW47XHJcbiAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgY29uZmlnIHtcclxuICBwcmltYXJ5S2V5OiBzdHJpbmc9ICdfaWQnO1xyXG4gIHBsYWNlaG9sZGVyOiBzdHJpbmc9ICdObyBpdGVtcyBhdmFpbGFibGUnO1xyXG4gIHNob3dEaXNhYmxlZFRleHQ6IHN0cmluZyA9ICAnU2VsZWN0IHRoZSBJdGVtIEJlbG93JztcclxuICBwYXJlbnRTZWxlY3Rpb25BdmFpbGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBvblNlbGVjdGlvblRvZ2dsZT86IGJvb2xlYW49IGZhbHNlO1xyXG4gIGV4cGFuZEFsbD86IGJvb2xlYW49IGZhbHNlO1xyXG59IFxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25nLXRyZWUtaGllcmFyY2h5LW5vZGVzJywgXHJcbiAgdGVtcGxhdGU6IGBcclxuXHJcbiAgSk9cclxuICAgIDxtYXQtZm9ybS1maWVsZCBjbGFzcz1cImV4YW1wbGUtZnVsbC13aWR0aFwiPlxyXG4gICAgICA8IS0tIDxtYXQtbGFiZWwgKm5nSWY9XCJjb25maWcubGFiZWxcIj57eyBjb25maWcubGFiZWwgfX08L21hdC1sYWJlbD4gLS0+XHJcbiAgICAgIDxpbnB1dFxyXG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICBwbGFjZWhvbGRlcj1cInt7IGdldFNlbGVjdGVkSXRlbXMoKSB9fVwiIFxyXG4gICAgICAgIG1hdElucHV0XHJcbiAgICAgICAgKGlucHV0KT1cImZpbHRlckNoYW5nZWQoJGV2ZW50LnRhcmdldClcIlxyXG4gICAgICAgIFttYXRBdXRvY29tcGxldGVdPVwiYXV0b1wiXHJcbiAgICAgIC8+XHJcbiAgICAgIDxtYXQtYXV0b2NvbXBsZXRlIGF1dG9BY3RpdmVGaXJzdE9wdGlvbiAjYXV0bz1cIm1hdEF1dG9jb21wbGV0ZVwiPlxyXG4gICAgICAgICAgPG1hdC1vcHRpb24gZGlzYWJsZWQ+e3tjb25maWdbXCJzaG93RGlzYWJsZWRUZXh0XCJdfX08L21hdC1vcHRpb24+XHJcblx0XHRcdFx0PG1hdC10cmVlIFtkYXRhU291cmNlXT1cImRhdGFTb3VyY2VcIiBbdHJlZUNvbnRyb2xdPVwidHJlZUNvbnRyb2xcIj5cclxuXHRcdFx0XHRcdDxtYXQtdHJlZS1ub2RlICptYXRUcmVlTm9kZURlZj1cImxldCBub2RlXCIgIG1hdFRyZWVOb2RlUGFkZGluZz5cclxuXHRcdFx0XHRcdFx0PG1hdC1jaGVja2JveCBjbGFzcz1cImNoZWNrbGlzdC1sZWFmLW5vZGVcIiBbY2hlY2tlZF09XCJjaGVja2xpc3RTZWxlY3Rpb24uaXNTZWxlY3RlZChub2RlKVwiIChjaGFuZ2UpPVwidG9nZ2xlTGVhZk5vZGVTZWxlY3Rpb24obm9kZSlcIj57e25vZGUuaXRlbX19PC9tYXQtY2hlY2tib3g+XHJcblx0XHRcdFx0XHQ8L21hdC10cmVlLW5vZGU+XHJcblxyXG5cdFx0XHRcdFx0PG1hdC10cmVlLW5vZGUgKm1hdFRyZWVOb2RlRGVmPVwibGV0IG5vZGU7IHdoZW46IGhhc0NoaWxkXCIgbWF0VHJlZU5vZGVQYWRkaW5nPlxyXG4gICAgPGRpdiAgc3R5bGU9XCJkaXNwbGF5OiBjb250ZW50czttYXJnaW4tdG9wOjJweFwiPlxyXG4gICAgICA8bWF0LWljb24gY2xhc3M9XCJtYXQtaWNvbi1ydGwtbWlycm9yXCIgbWF0VHJlZU5vZGVUb2dnbGUgW2lkXT1cIid0b2dnbGUnICsgbm9kZS5pdGVtXCI+IHt7dHJlZUNvbnRyb2wuaXNFeHBhbmRlZChub2RlKSA/ICdleHBhbmRfbW9yZScgOiAnY2hldnJvbl9yaWdodCd9fSA8L21hdC1pY29uPlxyXG4gICAgICBAaWYoY29uZmlnWydwYXJlbnRTZWxlY3Rpb25BdmFpbGFibGUnXSl7XHJcbiAgICAgICAgPG1hdC1jaGVja2JveCBbY2hlY2tlZF09XCJkZXNjZW5kYW50c0FsbFNlbGVjdGVkKG5vZGUpXCIgW2luZGV0ZXJtaW5hdGVdPVwiZGVzY2VuZGFudHNQYXJ0aWFsbHlTZWxlY3RlZChub2RlKVwiIChjaGFuZ2UpPVwidG9kb0l0ZW1TZWxlY3Rpb25Ub2dnbGUobm9kZSwndG9nZ2xlJyArIG5vZGUuaXRlbSlcIj48L21hdC1jaGVja2JveD5cclxuICAgICAgfVxyXG4gICAgICB7e25vZGUuaXRlbX19XHJcbiAgICAgIFxyXG4gICAgPC9kaXY+XHJcblx0XHRcdFx0XHQ8L21hdC10cmVlLW5vZGU+XHJcblx0XHRcdFx0PC9tYXQtdHJlZT5cclxuXHRcdFx0PC9tYXQtYXV0b2NvbXBsZXRlPiBcclxuICAgIDwvbWF0LWZvcm0tZmllbGQ+XHJcbiAgYCxcclxuICBzdHlsZXM6IFtcclxuICAgIGBcclxuICAgICAgLmV4YW1wbGUtdHJlZS1pbnZpc2libGUge1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5leGFtcGxlLXRyZWUgdWwsXHJcbiAgICAgIC5leGFtcGxlLXRyZWUgbGkge1xyXG4gICAgICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5leGFtcGxlLWZvcm0ge1xyXG4gICAgICAgIG1pbi13aWR0aDogMTUwcHg7XHJcbiAgICAgICAgbWF4LXdpZHRoOiA1MDBweDtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmV4YW1wbGUtZnVsbC13aWR0aCB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC50cmVlLXRvZ2dsZSB7XHJcbiAgICAgICAgZGlzcGxheTogY29udGVudHM7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogMnB4O1xyXG4gICAgICB9XHJcbiAgICBgXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdUcmVlSGllcmFyY2h5Tm9kZXNDb21wb25lbnQge1xyXG4gIEBPdXRwdXQoKSBuZ01vZGVsQ2hhbmFnZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55Pih0cnVlKTtcclxuICBASW5wdXQoKSBkYXRhOiBQYXJlbnROb2RlW10gPVtdO1xyXG4gIEBJbnB1dCgpIHNlbGVjdGVkVmFsdWU6IGFueVtdID1bXTtcclxuICBASW5wdXQoKSBjb25maWc6IHtcclxuICAgIHByaW1hcnlLZXk/OiBzdHJpbmc7XHJcbiAgICBwbGFjZWhvbGRlcj86IHN0cmluZztcclxuICAgIHNob3dEaXNhYmxlZFRleHQ/OiBzdHJpbmc7XHJcbiAgICBwYXJlbnRTZWxlY3Rpb25BdmFpbGFibGU/OiBib29sZWFuO1xyXG4gICAgb25TZWxlY3Rpb25Ub2dnbGU/OiBib29sZWFuO1xyXG4gICAgZXhwYW5kQWxsPzogYm9vbGVhbjtcclxuICB9ID0ge1xyXG4gICAgcHJpbWFyeUtleTogJ19pZCcsXHJcbiAgICBzaG93RGlzYWJsZWRUZXh0OiAnTm8gaXRlbXMgYXZhaWxhYmxlJyxcclxuICAgIHBsYWNlaG9sZGVyOlwiU2VsZWN0IGl0ZW1zXCIsXHJcbiAgICBwYXJlbnRTZWxlY3Rpb25BdmFpbGFibGU6IGZhbHNlLFxyXG4gICAgb25TZWxlY3Rpb25Ub2dnbGU6ZmFsc2UsXHJcbiAgICBleHBhbmRBbGw6ZmFsc2VcclxuICB9O1xyXG4gIGNoZWNrbGlzdFNlbGVjdGlvbiA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxMZWFmTm9kZT4odHJ1ZSk7XHJcbiAgdHJlZUNvbnRyb2whOiBGbGF0VHJlZUNvbnRyb2w8TGVhZk5vZGU+O1xyXG4gIHRyZWVGbGF0dGVuZXIhOiBNYXRUcmVlRmxhdHRlbmVyPFBhcmVudE5vZGUsIExlYWZOb2RlPjtcclxuICBkYXRhU291cmNlITogTWF0VHJlZUZsYXREYXRhU291cmNlPFBhcmVudE5vZGUsIExlYWZOb2RlPjtcclxuXHJcbiAgZmxhdE5vZGVNYXAgPSBuZXcgTWFwPExlYWZOb2RlLCBQYXJlbnROb2RlPigpO1xyXG4gIG5lc3RlZE5vZGVNYXAgPSBuZXcgTWFwPFBhcmVudE5vZGUsIExlYWZOb2RlPigpO1xyXG4gIHByaXZhdGUgVHJlZVN0cnVjdFNlcnZpY2UgPSBpbmplY3QoTmdUcmVlSGllcmFyY2h5Tm9kZXNTZXJ2aWNlKTtcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiSU5JVFwiKTtcclxuICAgIHRoaXMudHJlZUZsYXR0ZW5lciA9IG5ldyBNYXRUcmVlRmxhdHRlbmVyKFxyXG4gICAgICB0aGlzLnRyYW5zZm9ybWVyLFxyXG4gICAgICB0aGlzLmdldExldmVsLFxyXG4gICAgICB0aGlzLmlzRXhwYW5kYWJsZSxcclxuICAgICAgdGhpcy5nZXRDaGlsZHJlblxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLnRyZWVDb250cm9sID0gbmV3IEZsYXRUcmVlQ29udHJvbDxMZWFmTm9kZT4oXHJcbiAgICAgIHRoaXMuZ2V0TGV2ZWwsXHJcbiAgICAgIHRoaXMuaXNFeHBhbmRhYmxlXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuZGF0YVNvdXJjZSA9IG5ldyBNYXRUcmVlRmxhdERhdGFTb3VyY2UoXHJcbiAgICAgIHRoaXMudHJlZUNvbnRyb2wsXHJcbiAgICAgIHRoaXMudHJlZUZsYXR0ZW5lclxyXG4gICAgKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuZGF0YSk7XHJcbiAgICBcclxuICAgIHRoaXMuVHJlZVN0cnVjdFNlcnZpY2UuaW5pdCh0aGlzLmRhdGEpXHJcbiAgICB0aGlzLlRyZWVTdHJ1Y3RTZXJ2aWNlLnJlY29yZExpc25lciQoKS5zdWJzY3JpYmUoKGRhdGE6YW55KSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBkYXRhO1xyXG4gICAgICBpZih0aGlzLmNvbmZpZy5leHBhbmRBbGwpe1xyXG4gICAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kQWxsKCk7XHJcbiAgICAgIH0gICAgIFxyXG4gICAgICBcclxuICAgIH0pO1xyXG4gICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICBcclxuICBpZiAodGhpcy5zZWxlY3RlZFZhbHVlLmxlbmd0aD4wKSB0aGlzLnNldERlZmF1bHRTZWxlY3RlZCh0aGlzLnNlbGVjdGVkVmFsdWUpIDtcclxuICB9XHJcblxyXG4gIHRyYW5zZm9ybWVyID0gKG5vZGU6IFBhcmVudE5vZGUsIGxldmVsOiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IGZsYXROb2RlID0gdGhpcy5uZXN0ZWROb2RlTWFwLmdldChub2RlKSB8fCBuZXcgTGVhZk5vZGUoKTtcclxuICAgIGZsYXROb2RlLml0ZW0gPSBub2RlLml0ZW07XHJcbiAgICBmbGF0Tm9kZS5sZXZlbCA9IGxldmVsO1xyXG4gICAgZmxhdE5vZGUuZXhwYW5kYWJsZSA9ICEhbm9kZS5jaGlsZHJlbjtcclxuICAgIGZsYXROb2RlW3RoaXMuY29uZmlnLnByaW1hcnlLZXkhXSA9IG5vZGVbdGhpcy5jb25maWcucHJpbWFyeUtleSFdO1xyXG4gICAgdGhpcy5mbGF0Tm9kZU1hcC5zZXQoZmxhdE5vZGUsIG5vZGUpO1xyXG4gICAgdGhpcy5uZXN0ZWROb2RlTWFwLnNldChub2RlLCBmbGF0Tm9kZSk7XHJcbiAgICByZXR1cm4gZmxhdE5vZGU7XHJcbiAgfTtcclxuXHJcbiAgZ2V0TGV2ZWwgPSAobm9kZTogTGVhZk5vZGUpID0+IG5vZGUubGV2ZWwgfHwgMDtcclxuICBpc0V4cGFuZGFibGUgPSAobm9kZTogTGVhZk5vZGUpID0+IG5vZGUuZXhwYW5kYWJsZSB8fCBmYWxzZTtcclxuICBnZXRDaGlsZHJlbiA9IChub2RlOiBQYXJlbnROb2RlKTogUGFyZW50Tm9kZVtdID0+IG5vZGUuY2hpbGRyZW4gfHwgW107XHJcbiAgaGFzQ2hpbGQgPSAoXzogbnVtYmVyLCBub2RlOiBMZWFmTm9kZSkgPT4gbm9kZS5leHBhbmRhYmxlO1xyXG5cclxuICB0b2dnbGVMZWFmTm9kZVNlbGVjdGlvbihub2RlOiBMZWFmTm9kZSk6IHZvaWQge1xyXG4gICAgdGhpcy5jaGVja2xpc3RTZWxlY3Rpb24udG9nZ2xlKG5vZGUpOyBcclxuICAgIGlmKHRoaXMuY29uZmlnWydwYXJlbnRTZWxlY3Rpb25BdmFpbGFibGUnXSl7XHJcbiAgICAgIHRoaXMuY2hlY2tBbGxQYXJlbnRzU2VsZWN0aW9uKG5vZGUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0U2VsZWN0ZWRJdGVtcyhuZXcgVHJlZVNlbGVjdGlvbnR5cGUoKS5sZWFmTm9kZSlcclxuICB9XHJcblxyXG4gIGNoZWNrQWxsUGFyZW50c1NlbGVjdGlvbihub2RlOiBMZWFmTm9kZSk6IHZvaWQge1xyXG4gICAgbGV0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50Tm9kZShub2RlKTtcclxuICAgIHdoaWxlIChwYXJlbnQpIHtcclxuICAgICAgdGhpcy5jaGVja1Jvb3ROb2RlU2VsZWN0aW9uKHBhcmVudCk7XHJcbiAgICAgIHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50Tm9kZShwYXJlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hlY2tSb290Tm9kZVNlbGVjdGlvbihub2RlOiBMZWFmTm9kZSk6IHZvaWQge1xyXG4gICAgY29uc3QgZGVzY2VuZGFudHMgPSB0aGlzLnRyZWVDb250cm9sLmdldERlc2NlbmRhbnRzKG5vZGUpO1xyXG4gICAgY29uc3QgYWxsU2VsZWN0ZWQgPSBkZXNjZW5kYW50cy5ldmVyeSgoY2hpbGQpID0+XHJcbiAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmlzU2VsZWN0ZWQoY2hpbGQpXHJcbiAgICApO1xyXG4gICAgYWxsU2VsZWN0ZWRcclxuICAgICAgPyB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5zZWxlY3Qobm9kZSlcclxuICAgICAgOiB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5kZXNlbGVjdChub2RlKTtcclxuICB9XHJcblxyXG4gIGdldFBhcmVudE5vZGUobm9kZTogTGVhZk5vZGUpOiBMZWFmTm9kZSB8IG51bGwge1xyXG4gICAgY29uc3QgY3VycmVudExldmVsID0gdGhpcy5nZXRMZXZlbChub2RlKTtcclxuICAgIGlmIChjdXJyZW50TGV2ZWwgPCAxKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuaW5kZXhPZihub2RlKSAtIDE7XHJcbiAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlc1tpXTtcclxuICAgICAgaWYgKHRoaXMuZ2V0TGV2ZWwoY3VycmVudE5vZGUpIDwgY3VycmVudExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGdldFNlbGVjdGVkSXRlbXMoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnNlbGVjdGVkLm1hcCgobm9kZSkgPT4gbm9kZS5pdGVtKS5qb2luKCcsICcpIHx8XHJcbiAgICAgIHRoaXMuY29uZmlnLnBsYWNlaG9sZGVyIVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGRlc2NlbmRhbnRzQWxsU2VsZWN0ZWQobm9kZTogTGVhZk5vZGUpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGRlc2NlbmRhbnRzID0gdGhpcy50cmVlQ29udHJvbC5nZXREZXNjZW5kYW50cyhub2RlKTtcclxuICAgIHJldHVybiBkZXNjZW5kYW50cy5ldmVyeSgoY2hpbGQpID0+XHJcbiAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmlzU2VsZWN0ZWQoY2hpbGQpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZGVzY2VuZGFudHNQYXJ0aWFsbHlTZWxlY3RlZChub2RlOiBMZWFmTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgZGVzY2VuZGFudHMgPSB0aGlzLnRyZWVDb250cm9sLmdldERlc2NlbmRhbnRzKG5vZGUpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gZGVzY2VuZGFudHMuc29tZSgoY2hpbGQpID0+XHJcbiAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmlzU2VsZWN0ZWQoY2hpbGQpXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIHJlc3VsdCAmJiAhdGhpcy5kZXNjZW5kYW50c0FsbFNlbGVjdGVkKG5vZGUpO1xyXG4gIH1cclxuXHJcbiAgdG9kb0l0ZW1TZWxlY3Rpb25Ub2dnbGUobm9kZTogTGVhZk5vZGUsaWQ6YW55KTogdm9pZCB7XHJcbiAgICBpZih0aGlzLmNvbmZpZ1snb25TZWxlY3Rpb25Ub2dnbGUnXSl7XHJcbiAgICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgIH1cclxuICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnRvZ2dsZShub2RlKTtcclxuICAgIGNvbnN0IGRlc2NlbmRhbnRzID0gdGhpcy50cmVlQ29udHJvbC5nZXREZXNjZW5kYW50cyhub2RlKTtcclxuICAgIFxyXG4gICAgaWYgKHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmlzU2VsZWN0ZWQobm9kZSkpIHtcclxuICAgICAgdGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uc2VsZWN0KC4uLmRlc2NlbmRhbnRzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmRlc2VsZWN0KC4uLmRlc2NlbmRhbnRzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5jaGVja0FsbFBhcmVudHNTZWxlY3Rpb24obm9kZSk7XHJcbiAgICB0aGlzLmVtaXRTZWxlY3RlZEl0ZW1zKG5ldyBUcmVlU2VsZWN0aW9udHlwZSgpLnBhcmVudE5vZGUpXHJcbiAgfVxyXG4gXHJcbiAgZmlsdGVyQ2hhbmdlZChldmVudDogYW55KSB7XHJcbiAgICB0aGlzLlRyZWVTdHJ1Y3RTZXJ2aWNlLmZpbHRlcihldmVudFsndmFsdWUnXSlcclxuICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgc2V0RGVmYXVsdFNlbGVjdGVkKHNlbGVjdGVkS2V5czogYW55W10pOiB2b2lkIHtcclxuICAgIGlmKHNlbGVjdGVkS2V5cy5sZW5ndGggPT0gMCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIk5vIERhdGEgQXZhaWxhYmxlXCIpO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKFwiRGF0YSBBdmFpbGFibGVcIixzZWxlY3RlZEtleXMpO1xyXG4gICAgY29uc3QgZGF0YU5vZGVzID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXM7XHJcbiAgICBzZWxlY3RlZEtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGUgPSBkYXRhTm9kZXMuZmluZCgobikgPT4gblt0aGlzLmNvbmZpZy5wcmltYXJ5S2V5IV0gPT09IGtleVt0aGlzLmNvbmZpZy5wcmltYXJ5S2V5IV0pO1xyXG4gICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnNlbGVjdChub2RlKTtcclxuICBcclxuICAgICAgICAvLyBFbnN1cmUgYWxsIHBhcmVudCBub2RlcyBhcmUgdXBkYXRlZFxyXG4gICAgICAgIHRoaXMuY2hlY2tBbGxQYXJlbnRzU2VsZWN0aW9uKG5vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTsgXHJcbiAgfVxyXG4gIFxyXG5cclxuXHJcbiAgZW1pdFNlbGVjdGVkSXRlbXModHlwZTphbnkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5zZWxlY3RlZFxyXG4gICAgdGhpcy5uZ01vZGVsQ2hhbmFnZS5lbWl0KHt0eXBlLHZhbHVlOnNlbGVjdGVkSXRlbXN9KTtcclxuICB9XHJcbn1cclxuIl19