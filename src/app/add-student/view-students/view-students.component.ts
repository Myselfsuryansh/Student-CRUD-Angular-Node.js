import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/Service/data.service';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.css']
})
export class ViewStudentsComponent implements OnInit {
  itemId:any;
  item:any
 
  constructor(private service:DataService,private activatedRouter:ActivatedRoute, private router:Router){}

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params) => {
      this.itemId = params.get('id'); // Convert the ID to a number (if it's not a string)
      console.log(this.itemId);

      this.service.getDataForSpecificID(this.itemId).subscribe((item:any)=>{
        this.item=item;
        
      })
    });
    
    
    
    
  }
  goBack(){
    this.router.navigate(['/add-student'])
  }
}
