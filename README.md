# ng-tree-hierarchy-nodes

> A library for managing hierarchical data structures and data emission.

## Prerequisites

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are easy to install.
To ensure they are available on your machine, run the following command:

```sh
$ npm -v && node -v
10.8.1
v22.2.0
```

## Table of contents

- [ng-tree-hierarchy-nodes](#ng-tree-hierarchy-nodes)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [API](#api)
    - [Hierarchical Data Usage](#hierarchical-data-usage)
  - [Built With](#built-with)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites).
 
```sh
 npm ng-tree-hierarchy-nodes 
```
## API

### Hierarchical Data Usage

The `ng-tree-hierarchy-nodes` package is designed to handle hierarchical data structures and enable smooth data emission.

#### Example of Data Usage:

```typescript
import { Component } from '@angular/core';
import {  ParentNode } from 'ng-tree-hierarchy-nodes';   

@Component({
  selector: 'app-root',
  template: `
   <ng-tree-hierarchy-nodes 
   [data]="parentData" 
   [selectedValue]="seleted"
   [config]="config"
   (ngModelChanage)="onNodeSelected($event)">
   </ng-tree-hierarchy-nodes>

  `,
})
export class AppComponent {
  treeData:ParentNode[] = [
    {
      id: 1,
      name: 'Parent Node',
      children: [
        { id: 2, name: 'Child Node 1' },
        { id: 3, name: 'Child Node 2' },
      ],
    },
  ];

#### It should come with primaryKey for mapping with selected
  seleted:any =
                [
                        {
                            "_id": "1.1",
                            "item": "Apple"
                        }
                ]

expandAll ensures all nodes are expanded 
  config = {
    // Used for uniqueness
    primaryKey: '_id', 

    // Shown when there is no value
    placeholder: '', 
    
    // Default is this; change to any custom value as required
    showDisabledText: 'No items available', 
    
     // Allows parent selection; set to false to make only leaf nodes selectable
    parentSelectionAvailable: true,
    
     // When a parent is clicked, all children are selected, and child nodes are collapsed
    onSelectionToggle: false,
    
    // Ensures all nodes are expanded
    expandAll: true 
  };

  onNodeSelected(node: any): void {
    // Node contains: { type: enum (TreeSelectionType: {leafNode="leafNode"; parentNode="parentNode"}), value: any[] (all selected nodes) }
    console.log('Node Selected:', node);
  }
} 

import {  NgTreeStructureModule } from 'ng-tree-hierarchy-nodes';   
@NgModule({
  declarations: [AppComponent],
  imports: [ 
    NgTreeStructureModule, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
} 

```
 
## Built With

- **Angular** - A platform for building mobile and desktop web applications.
- **RxJS** - For reactive programming.
- **TypeScript** - A strongly typed programming language that builds on JavaScript.
 
## Authors

* **Sanjay** - *Initial work* - [Sanjay](https://github.com/Sanjay5528)

## License

[MIT License](https://opensource.org/licenses/MIT) © 2025 Sanjay

If any issues arise or you have any doubts, please contact the [GitHub repository](https://github.com/Sanjay5528/ng-tree-hierarchy-nodes) and create an issue. I will address it immediately.

