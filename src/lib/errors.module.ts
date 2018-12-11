import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent, ErrorPageComponent } from './pages';
import { MaterialModule } from './materials.module';

const routes: Routes = [
	{
		path: 'error',
		component: ErrorPageComponent
	},
	{
		path: '**',
		component: NotFoundPageComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		MaterialModule
	],
	declarations: [ErrorPageComponent, NotFoundPageComponent],
	exports: [RouterModule],
})
export class ErrorsModule { }
