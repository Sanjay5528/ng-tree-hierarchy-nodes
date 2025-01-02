import { BehaviorSubject } from 'rxjs';
import { LeafNode } from './ng-tree-hierarchy-nodes.component';
import * as i0 from "@angular/core";
export declare class NgTreeHierarchyNodesService {
    protected records: BehaviorSubject<LeafNode[]>;
    protected treeData: any[];
    init(data: any): void;
    recordLisner$(): import("rxjs").Observable<LeafNode[]>;
    filter(filterText: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgTreeHierarchyNodesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgTreeHierarchyNodesService>;
}
