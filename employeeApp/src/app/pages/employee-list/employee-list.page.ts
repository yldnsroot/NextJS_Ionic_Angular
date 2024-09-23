// src/app/pages/employee-list/employee-list.page.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee'; // Import the Employee interface

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {
  employees: Employee[] = [];
  page = 1;
  limit = 5;
  totalPages = 1;
  totalEmployees = 0; // Total number of employees from the API
  loadedEmployees = 0; // Number of employees loaded so far

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.loadEmployees();
  }

  // Load employees initially and during infinite scroll
  loadEmployees(event?: any) {
    this.employeeService.getEmployees(this.page, this.limit).subscribe((response) => {
      this.employees = [...this.employees, ...response.data]; // Append new data
      this.loadedEmployees += response.data.length; // Update the number of loaded employees
      this.totalEmployees = response.total; // Total number of employees from the server

      // Disable infinite scroll if all employees are loaded
      if (this.loadedEmployees >= this.totalEmployees && event) {
        event.target.disabled = true; // Disable infinite scroll when all data is loaded
      }

      event?.target?.complete(); // Complete the infinite scroll event
    });
  }

  ionViewWillEnter() {
    // Reload employee data when returning to the list
    this.page = 1; // Reset the page count to load from the beginning
    this.employees = []; // Clear the existing employees list
    this.loadEmployees();
  }

  // Triggered when the user scrolls to the bottom
  loadMore(event: any) {
    this.page++; // Move to the next page

    // Load more employees
    this.loadEmployees(event);
  }

  // Delete an employee
  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.employees = this.employees.filter(emp => emp.id !== id);
    });
  }
}
