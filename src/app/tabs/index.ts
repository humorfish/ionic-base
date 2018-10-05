import { NgModule } from "@angular/core";
import { SharedModule } from "../shared";
import { Routes, RouterModule } from "@angular/router";

import { TabsPage } from "./tabs.page";
import { MsitePage } from "./msite/msite.page";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/tabs/(msite:msite)',
        pathMatch: 'full'
    },
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: '',
                redirectTo: '/tabs/(msite:msite)',
                pathMatch: 'full'
            },
            {
                path: 'msite',
                outlet: 'msite',
                component: MsitePage
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [TabsPage, MsitePage]
})
export class TabModule
{}