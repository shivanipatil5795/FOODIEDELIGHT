// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';


const routes: Routes = [ 

  { path: 'restaurants/new', component: RestaurantFormComponent }, // Ensure this path is correct
  { path: 'restaurants/edit/:id', component: RestaurantFormComponent },
  { path: 'restaurants', component: RestaurantListComponent }, // Ensure this path is correct
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
  { path: '**', redirectTo: '/restaurants' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
