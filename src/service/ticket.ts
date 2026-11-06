import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Ticket
{
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}
@Injectable({
  providedIn: 'root',
})

export class Ticket{
  

  private http=inject(HttpClient);
  private apiUrl='https://jsonplaceholder.typicode.com/todos';

  getTickets():Observable<Ticket[]>
  {
    return this.http.get<Ticket[]>(`${this.apiUrl}?_limit=10`)
  }

  createTicket(title:string):Observable<Ticket>
  {
    const payload=
    {
    title:title,
    completed:false,
    userId:1
    }
    return this.http.post<Ticket>(this.apiUrl,payload);
  }
  updateTicketStatus(ticket:Ticket):Observable<Ticket>
  {
    return this.http.put<Ticket>(`${this.apiUrl}/${ticket.id}`,
      {
        ...ticket,
        completed:!ticket.completed
      })
  }

  deleteTicket(id:number):Observable<void>
  {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
