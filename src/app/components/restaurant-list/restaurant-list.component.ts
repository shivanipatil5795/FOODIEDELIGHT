import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant} from '../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  selectedRestaurant: Restaurant | null = null;
  restaurantForm: FormGroup;
  filteredRestaurants: Restaurant[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4;
  

  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.restaurantForm = this.fb.group({
      id: [''],
      imageUrl: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Example: 10-digit number
      email: ['', [Validators.required, Validators.email]],
     
      
    });
  }

  ngOnInit(): void {
    this.getRestaurants();
  }


  getRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe(
      (data: Restaurant[]) => {
        this.restaurants = data;
        this.filterRestaurants(); // Apply filtering when data is loaded
        this.currentPage = 1; // Reset to the first page when restaurant list is loaded
      },
      (error) => {
        console.error('Error fetching restaurants', error);
      }
    );
  }

  filterRestaurants(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredRestaurants = this.restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.location.toLowerCase().includes(query)
    );
    this.currentPage = 1; // Reset to the first page after filtering
  }

  get paginatedRestaurants(): Restaurant[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredRestaurants.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRestaurants.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteRestaurant(id: number): void {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.deleteRestaurant(id).subscribe(
        () => this.getRestaurants(), // Refresh the list after deletion
        (error) => {
          console.error('Error deleting restaurant', error);
        }
      );
    }
  }

  startEdit(restaurant: Restaurant): void {
    this.selectedRestaurant = restaurant;
    this.restaurantForm.patchValue(restaurant); // Populate the form with selected restaurant's data
  }
  
  cancelEdit(): void {
    this.selectedRestaurant = null;  // Clear selected restaurant
    this.restaurantForm.reset();     // Reset form fields
  }

  onSubmit(): void {
    console.log('Form Validity:', this.restaurantForm.valid);
    console.log('Form Values:', this.restaurantForm.value);
  
    if (this.restaurantForm.valid) {
      const restaurantData = this.restaurantForm.value;
      if (this.selectedRestaurant) {
        this.restaurantService.updateRestaurant(this.selectedRestaurant.id, restaurantData).subscribe(
          () => {
            this.getRestaurants(); // Refresh the list after updating
            this.cancelEdit(); // Clear form and selection
          },
          (error) => {
            console.error('Error updating restaurant', error);
          }
        );
      } else {
        this.restaurantService.addRestaurant(restaurantData).subscribe(
          () => {
            this.getRestaurants(); // Refresh the list after adding
            this.cancelEdit(); // Clear form
          },
          (error) => {
            console.error('Error adding restaurant', error);
          }
        );
      }
    }
  }
  
  
  navigateToForm(): void {
    this.router.navigate(['/restaurants/new']); // Clear form data
  }
}
