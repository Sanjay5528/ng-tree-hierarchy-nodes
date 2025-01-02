import * as i0 from '@angular/core';
import { Injectable, EventEmitter, inject, Component, Output, Input, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import * as i4 from '@angular/material/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeModule } from '@angular/material/tree';
import * as i1 from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i2 from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import * as i3 from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as i5 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i6 from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import * as i7 from '@angular/material/core';
import { CommonModule } from '@angular/common';

class NgTreeHierarchyNodesService {
    constructor() {
        this.records = new BehaviorSubject([]);
    }
    init(data) {
        this.records.next(data);
        this.treeData = data;
    }
    recordLisner$() {
        return this.records.asObservable();
    }
    filter(filterText) {
        let filteredTreeData;
        if (filterText) {
            // Filter the tree
            function filter(array, text) {
                const getChildren = (result, object) => {
                    if (object.item.toLowerCase() === text.toLowerCase() || object.item.toLowerCase().startsWith(text.toLowerCase())) {
                        console.log(object.item, "object.item");
                        console.log(text, "text");
                        result.push(object);
                        return result;
                    }
                    if (Array.isArray(object.children)) {
                        const children = object.children.reduce(getChildren, []);
                        if (children.length)
                            result.push({ ...object, children });
                    }
                    return result;
                };
                return array.reduce(getChildren, []);
            }
            filteredTreeData = filter(this.treeData, filterText);
        }
        else {
            // Return the initial tree
            filteredTreeData = this.treeData;
        }
        // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        // file node as children.
        const data = filteredTreeData;
        // Notify the change.
        this.records.next(data);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NgTreeHierarchyNodesService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NgTreeHierarchyNodesService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NgTreeHierarchyNodesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

// Define data models
class ParentNode {
}
class TreeSelectiontype {
    constructor() {
        this.leafNode = "leafNode";
        this.parentNode = "parentNode";
    }
}
class LeafNode {
}
class config {
    constructor() {
        this.primaryKey = '_id';
        this.placeholder = 'No items available';
        this.showDisabledText = 'Select the Item Below';
        this.parentSelectionAvailable = false;
        this.onSelectionToggle = false;
        this.expandAll = false;
    }
}
class NgTreeHierarchyNodesComponent {
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

class NgTreeStructureModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NgTreeStructureModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: NgTreeStructureModule, declarations: [NgTreeHierarchyNodesComponent], imports: [MatFormFieldModule,
            MatInputModule,
            MatCheckboxModule,
            MatTreeModule,
            MatIconModule, MatAutocompleteModule,
            CommonModule], exports: [NgTreeHierarchyNodesComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NgTreeStructureModule, imports: [MatFormFieldModule,
            MatInputModule,
            MatCheckboxModule,
            MatTreeModule,
            MatIconModule, MatAutocompleteModule,
            CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NgTreeStructureModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NgTreeHierarchyNodesComponent],
                    imports: [
                        MatFormFieldModule,
                        MatInputModule,
                        MatCheckboxModule,
                        MatTreeModule,
                        MatIconModule, MatAutocompleteModule,
                        CommonModule
                    ],
                    exports: [NgTreeHierarchyNodesComponent]
                }]
        }] });

/*
 * Public API Surface of ng-tree-hierarchy-nodes
 */

/**
 * Generated bundle index. Do not edit.
 */

export { LeafNode, NgTreeHierarchyNodesComponent, NgTreeHierarchyNodesService, NgTreeStructureModule, ParentNode, TreeSelectiontype, config };
//# sourceMappingURL=ng-tree-hierarchy-nodes.mjs.map
