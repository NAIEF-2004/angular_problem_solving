import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Ticket } from '../service/ticket';
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
tickets: Ticket[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
 private service = inject(Ticket);
  private changeDetector = inject(ChangeDetectorRef);
  

  ngOnInit(): void {
    this.fetchTickets();
  }
  fetchTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getTickets().subscribe({
      next:(data)=> {
        this.tickets=data;
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
      error:(error)=>
        {
          this.isLoading = false;
          this.errorMessage = 'تعذر جلب التذاكر. تحقق من اتصال الإنترنت وحاول مجددًا.';
          console.error(error);
          this.changeDetector.markForCheck();
        }
    });
  }

  onAddTicket(input:HTMLInputElement):void
  {
    const ticket=input.value.trim();
    if(!ticket)return;
    this.service.createTicket(ticket).subscribe({
      next:(newticket)=>
        {
          this.tickets.unshift(newticket);
          input.value='';
          this.changeDetector.markForCheck();
        },
        error:(error)=>
          {
            alert('خطء اصناء الاضافة ');
            console.log(error);
          }
    });
  }

  onToggleStatus(ticket:Ticket):void
  {
    this.service.updateTicketStatus(ticket).subscribe({
      next:()=>
        {
          ticket.completed=!ticket.completed;
          this.changeDetector.markForCheck();
        },
        error:(error)=>
          {
            alert('مشكلة في التحديث ');
            console.log(error);
          }
    });
  }
  onDeleteTicket(id:number):void
  {
this.service.deleteTicket(id).subscribe(
  {
    next:()=>
   {
     this.tickets=this.tickets.filter(i=>i.id!==id);
     this.changeDetector.markForCheck();
   },
   error:(error)=>
    {
      alert('خطء بعملية الحذف ');
      console.log(error);
    }
  });
  }

}
