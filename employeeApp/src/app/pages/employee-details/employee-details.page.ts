// src/app/pages/employee-details/employee-details.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.page.html',
  styleUrls: ['./employee-details.page.scss'],
})
export class EmployeeDetailsPage implements OnInit {
  employee: any = { name: '', email: '', position: '' };
  isNew = true;
  id: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isNew = false;
      this.loadEmployee(this.id);
    }
  }

  loadEmployee(id: string) {
    this.employeeService.getEmployee(+id).subscribe((response) => {
      this.employee = response;
    });
  }

  // Save employee (either add or update)
  saveEmployee() {
    if (this.isNew) {
      this.employeeService.addEmployee(this.employee).subscribe(() => {
        // Navigate back to employee list after saving
        this.router.navigate(['/employee-list']);
      });
    } else {
      this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe(() => {
        // Navigate back to employee list after updating
        this.router.navigate(['/employee-list']);
      });
    }
  }
}
