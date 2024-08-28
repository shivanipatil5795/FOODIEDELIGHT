import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {
  restaurantForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private router: Router
  ) {
    this.restaurantForm = this.fb.group({
      id: [''],
      imageUrl: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
    });
    
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.restaurantForm.valid) {
      this.restaurantService.addRestaurant(this.restaurantForm.value).subscribe(
        () => this.router.navigate(['/restaurants']),
        (error) => console.error('Error adding restaurant', error)
      );
    }
  }

  navigateToList(): void {
    this.router.navigate(['/restaurants']); // Navigate to the list page
  }
}
