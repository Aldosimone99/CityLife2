import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: false,
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  usersPerPage: number = 10; // Default number of users per page
  usersPerPageOptions: number[] = [5, 10, 20, 50]; // Options for users per page
  loggedInUserId!: number;

  constructor(@Inject(UserService) private userService: UserService, private router: Router, private http: HttpClient) {
    this.userService.getCurrentUser().subscribe(user => {
      this.loggedInUserId = user.id;
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get('/api/users').subscribe(
      (response: any) => {
        this.users = response.map((user: any) => ({
          ...user,
          name: user.name // Ensure the name is retrieved from the database
        }));
        this.filteredUsers = this.users.slice(0, this.usersPerPage); // Display the initial set of users
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  searchUsers() {
    const filtered = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredUsers = filtered.slice(0, this.usersPerPage); // Update the displayed users based on the search term and selected number
  }

  viewUser(id: number) {
    this.router.navigate(['/user', id]);
  }

  updateUsersPerPage() {
    this.filteredUsers = this.users.slice(0, this.usersPerPage); // Update the displayed users based on the selected number
  }
}