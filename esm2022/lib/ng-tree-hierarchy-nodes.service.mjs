import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class NgTreeHierarchyNodesService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdHJlZS1oaWVyYXJjaHktbm9kZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXRyZWUtaGllcmFyY2h5LW5vZGVzL3NyYy9saWIvbmctdHJlZS1oaWVyYXJjaHktbm9kZXMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBTXZDLE1BQU0sT0FBTywyQkFBMkI7SUFIeEM7UUFJWSxZQUFPLEdBQUcsSUFBSSxlQUFlLENBQWEsRUFBRSxDQUFDLENBQUM7S0E4Q3pEO0lBNUNDLElBQUksQ0FBQyxJQUFRO1FBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7SUFDdEIsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUE7SUFDcEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFrQjtRQUM5QixJQUFJLGdCQUFnQixDQUFDO1FBQ3JCLElBQUksVUFBVSxFQUFFLENBQUM7WUFDZixrQkFBa0I7WUFDbEIsU0FBUyxNQUFNLENBQUMsS0FBUyxFQUFFLElBQVE7Z0JBQ2pDLE1BQU0sV0FBVyxHQUFHLENBQUMsTUFBVSxFQUFFLE1BQVUsRUFBRSxFQUFFO29CQUM3QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFHLENBQUM7d0JBQ3JILE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxhQUFhLENBQUMsQ0FBQzt3QkFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsTUFBTSxDQUFDLENBQUM7d0JBRXBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3RCLE9BQU8sTUFBTSxDQUFDO29CQUNoQixDQUFDO29CQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQzt3QkFDbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUN6RCxJQUFJLFFBQVEsQ0FBQyxNQUFNOzRCQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUM1RCxDQUFDO29CQUNELE9BQU8sTUFBTSxDQUFDO2dCQUNoQixDQUFDLENBQUM7Z0JBRUYsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN2QyxDQUFDO1lBRUQsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdkQsQ0FBQzthQUFNLENBQUM7WUFDTiwwQkFBMEI7WUFDMUIsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBRUQsNEZBQTRGO1FBQzVGLHlCQUF5QjtRQUN6QixNQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQztRQUM5QixxQkFBcUI7UUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQzsrR0E5Q1UsMkJBQTJCO21IQUEzQiwyQkFBMkIsY0FGMUIsTUFBTTs7NEZBRVAsMkJBQTJCO2tCQUh2QyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IExlYWZOb2RlIH0gZnJvbSAnLi9uZy10cmVlLWhpZXJhcmNoeS1ub2Rlcy5jb21wb25lbnQnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdUcmVlSGllcmFyY2h5Tm9kZXNTZXJ2aWNlIHtcclxuICBwcm90ZWN0ZWQgcmVjb3JkcyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8TGVhZk5vZGVbXT4oW10pO1xyXG4gIHByb3RlY3RlZCB0cmVlRGF0YSE6IGFueVtdO1xyXG4gIGluaXQoZGF0YTphbnkpe1xyXG4gICAgdGhpcy5yZWNvcmRzLm5leHQoZGF0YSlcclxuICAgIHRoaXMudHJlZURhdGEgPSBkYXRhXHJcbiAgfSBcclxuICBcclxuICByZWNvcmRMaXNuZXIkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5yZWNvcmRzLmFzT2JzZXJ2YWJsZSgpXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmlsdGVyKGZpbHRlclRleHQ6IHN0cmluZykge1xyXG4gICAgbGV0IGZpbHRlcmVkVHJlZURhdGE7XHJcbiAgICBpZiAoZmlsdGVyVGV4dCkge1xyXG4gICAgICAvLyBGaWx0ZXIgdGhlIHRyZWVcclxuICAgICAgZnVuY3Rpb24gZmlsdGVyKGFycmF5OmFueSwgdGV4dDphbnkpIHtcclxuICAgICAgICBjb25zdCBnZXRDaGlsZHJlbiA9IChyZXN1bHQ6YW55LCBvYmplY3Q6YW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAob2JqZWN0Lml0ZW0udG9Mb3dlckNhc2UoKSA9PT0gdGV4dC50b0xvd2VyQ2FzZSgpIHx8IG9iamVjdC5pdGVtLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCh0ZXh0LnRvTG93ZXJDYXNlKCkpICkge1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhvYmplY3QuaXRlbSxcIm9iamVjdC5pdGVtXCIpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyh0ZXh0LFwidGV4dFwiKTtcclxuICAgICAgICAgXHJcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2gob2JqZWN0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdC5jaGlsZHJlbikpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBvYmplY3QuY2hpbGRyZW4ucmVkdWNlKGdldENoaWxkcmVuLCBbXSk7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpIHJlc3VsdC5wdXNoKHsgLi4ub2JqZWN0LCBjaGlsZHJlbiB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5LnJlZHVjZShnZXRDaGlsZHJlbiwgW10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmaWx0ZXJlZFRyZWVEYXRhID0gZmlsdGVyKHRoaXMudHJlZURhdGEsIGZpbHRlclRleHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gUmV0dXJuIHRoZSBpbml0aWFsIHRyZWVcclxuICAgICAgZmlsdGVyZWRUcmVlRGF0YSA9IHRoaXMudHJlZURhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQnVpbGQgdGhlIHRyZWUgbm9kZXMgZnJvbSBKc29uIG9iamVjdC4gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgYFRvZG9JdGVtTm9kZWAgd2l0aCBuZXN0ZWRcclxuICAgIC8vIGZpbGUgbm9kZSBhcyBjaGlsZHJlbi5cclxuICAgIGNvbnN0IGRhdGEgPSBmaWx0ZXJlZFRyZWVEYXRhO1xyXG4gICAgLy8gTm90aWZ5IHRoZSBjaGFuZ2UuXHJcbiAgICB0aGlzLnJlY29yZHMubmV4dChkYXRhKTtcclxuICB9XHJcbn1cclxuIl19