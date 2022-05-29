import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Componentes personalizados para usar en la app

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MaterialModule } from '../utils/material';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
    declarations : [
        
    ],
    exports: [
        
    ],
    //Importamos el modulo te Ionic para tener sus componentes disponibles
    // dentro de los componentes personalizados
    imports : [
        CommonModule,
        NgxMaskModule.forRoot(maskConfig),
        NgbModule,
        /* Gives the directives and biding functions in the components */
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}
