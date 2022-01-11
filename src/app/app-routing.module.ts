import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from 'src/app/routes/routes';

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
