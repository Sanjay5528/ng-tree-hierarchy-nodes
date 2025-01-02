import { EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import * as i0 from "@angular/core";
export declare class ParentNode {
    item: string;
    children?: ParentNode[];
    [key: string]: any;
}
export declare class TreeSelectiontype {
    leafNode: string;
    parentNode: string;
}
export declare class LeafNode {
    item: string;
    level: number;
    expandable: boolean;
    [key: string]: any;
}
export declare class config {
    primaryKey: string;
    placeholder: string;
    showDisabledText: string;
    parentSelectionAvailable: boolean;
    onSelectionToggle?: boolean;
    expandAll?: boolean;
}
export declare class NgTreeHierarchyNodesComponent {
    ngModelChanage: EventEmitter<any>;
    data: ParentNode[];
    selectedValue: any[];
    config: {
        primaryKey?: string;
        placeholder?: string;
        showDisabledText?: string;
        parentSelectionAvailable?: boolean;
        onSelectionToggle?: boolean;
        expandAll?: boolean;
    };
    checklistSelection: SelectionModel<LeafNode>;
    treeControl: FlatTreeControl<LeafNode>;
    treeFlattener: MatTreeFlattener<ParentNode, LeafNode>;
    dataSource: MatTreeFlatDataSource<ParentNode, LeafNode>;
    flatNodeMap: Map<LeafNode, ParentNode>;
    nestedNodeMap: Map<ParentNode, LeafNode>;
    private TreeStructService;
    ngOnInit(): void;
    transformer: (node: ParentNode, level: number) => LeafNode;
    getLevel: (node: LeafNode) => number;
    isExpandable: (node: LeafNode) => boolean;
    getChildren: (node: ParentNode) => ParentNode[];
    hasChild: (_: number, node: LeafNode) => boolean;
    toggleLeafNodeSelection(node: LeafNode): void;
    checkAllParentsSelection(node: LeafNode): void;
    checkRootNodeSelection(node: LeafNode): void;
    getParentNode(node: LeafNode): LeafNode | null;
    getSelectedItems(): string;
    descendantsAllSelected(node: LeafNode): boolean;
    descendantsPartiallySelected(node: LeafNode): boolean;
    todoItemSelectionToggle(node: LeafNode, id: any): void;
    filterChanged(event: any): void;
    setDefaultSelected(selectedKeys: any[]): void;
    emitSelectedItems(type: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgTreeHierarchyNodesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgTreeHierarchyNodesComponent, "ng-tree-hierarchy-nodes", never, { "data": { "alias": "data"; "required": false; }; "selectedValue": { "alias": "selectedValue"; "required": false; }; "config": { "alias": "config"; "required": false; }; }, { "ngModelChanage": "ngModelChanage"; }, never, never, false, never>;
}
