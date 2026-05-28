import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardTitle, MatCardHeader, MatCardSubtitle, MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { RouterLink } from "@angular/router";
import { MatRadioModule } from "@angular/material/radio"
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSortModule } from "@angular/material/sort";
@NgModule({
    declarations: [],
    imports: [
        MatFormFieldModule,
        MatTableModule, 
        MatCheckboxModule, 
        CommonModule, 
        MatInputModule,
        MatCardTitle, 
        MatCardHeader, 
        MatCardSubtitle, 
        MatCardModule, 
        MatIconModule, 
        MatPaginator, 
        RouterLink, 
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatTooltipModule,
        MatSortModule
    ],

    exports: [
        MatFormFieldModule,
        MatTableModule, 
        MatCheckboxModule, 
        CommonModule, 
        FormsModule, 
        MatInputModule,
        MatCardTitle, 
        MatCardHeader, 
        MatCardSubtitle, 
        MatCardModule, 
        MatIconModule, 
        MatPaginator, 
        RouterLink, 
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatTooltipModule,
        MatSortModule
    ]
})
export class MaterialModule { }