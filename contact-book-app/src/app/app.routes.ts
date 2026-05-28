import { Routes } from '@angular/router';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { UploadComponent } from './pages/upload/upload.component';
import { ExportFileComponent } from './pages/export-file/export-file.component';
import { ChildComponent } from './pages/child/child.component';
import { GrandchildComponent } from './pages/grandchild/grandchild.component';
import { FilterTestComponent } from './pages/filter-test/filter-test.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'upload ',
        pathMatch:'full'
    },
    {
        path:'upload',
        component:UploadComponent
    },
     {
        path:'filtertest',
        component:FilterTestComponent
    },
    {
        path:'contacts',
        component:ContactsComponent,
        data:{breadcrumb:'contact'},
        children:[
            {
                path:'child',
                component:ChildComponent,
                data:{breadcrumb:'child'},
                children:[
                    {
                        path:'grandchild',
                        component:GrandchildComponent,
                        data:{breadcrumb:'grandchild'}
                    }
                ]
            }
        ]
    },
    {
        path:'export',
        component:ExportFileComponent
    }

];
