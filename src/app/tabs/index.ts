import { NgModule } from "@angular/core";
import { SharedModule } from "../shared";
import { Routes } from "@angular/router";

import { TabsPage } from "./tabs.page";

const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'tab',
        component: TabsPage,
        children: [
            {
                
            },
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
    ],
})
export class TabModule
{}