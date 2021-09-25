import { Component, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Patient {
  id: number;
  name: string;
  date: Date;
  session: string;
  heartBeat: number;
  timestamp: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  p1: Patient = {
    id: 1,
    name: 'Nilesh',
    date: new Date(),
    session: 'Morning',
    heartBeat: 50,
    timestamp: '1632045685',
  }
  title = 'HearBeat';
  loader: Boolean;
  message: string;
  hearRate: number;
  error: string;

  myControl = new FormControl();

  myControl2 = new FormControl();

  myControl3 = new FormControl();

  options: Patient[] = [
    { id: 1, name: 'Nilesh', date: new Date(), session: 'Morning', heartBeat: 50, timestamp: '1632045685' },
    { id: 2, name: 'Aryan', date: new Date(), session: 'Evening', heartBeat: 50, timestamp: '1632045685', },
    { id: 3, name: 'Prince', date: new Date(), session: 'Night', heartBeat: 50, timestamp: '1632045685', }
  ];

  selectedOpt: Patient;

  filteredOptions: Observable<Patient[]>;
  constructor() { }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  displayFn(user: Patient): string {
    return user && user.name ? user.name : '';
  }
  selectedPatient(): void {
    console.log("Hello");
    console.log(this.selectedOpt);
  }
  showLoad() {
    this.loader = true;
  }
  addPatient() {
    console.log(this.myControl2.value);

    this.p1 = {
      id: this.options.length + 1,
      name: this.myControl2.value,
      date: new Date(),
      session: '',
      heartBeat: 0,
      timestamp: "" + new Date().valueOf()
    };

    if (this.options.some(e => e.name === this.p1.name)) {
      this.message = "Patient Exists";
    } else if (this.p1.name == null) {
      this.message = "Patient Name Required";
    }
    else {
      this.options.push(this.p1);
      this.message = "Patient Added Successfully";
    }
  }
  captureBeat() {
    if (this.myControl3.value) {
      console.log(this.selectedOpt);
      var options = { hour12: false };
      console.log(new Date().toLocaleString('en-US', options));
      var d = new Date();
      var session;
      if (d.getHours() > 3 && d.getHours() < 11) {
        session = 'Morning';
      } else if (d.getHours() > 11 && d.getHours() > 19) {
        session = 'Afternoon';
      } else {
        session = 'Evening';
      }
      this.p1 = {
        id: this.selectedOpt.id,
        name: this.selectedOpt.name,
        date: new Date(),
        session: session,
        heartBeat: this.myControl3.value,
        timestamp: "" + new Date().valueOf()
      };
      var index = this.options.findIndex(obj => obj.id == this.selectedOpt.id);
      this.options[index] = this.p1;
      this.myControl3.reset();
    }
  }
  check(){
    if(this.hearRate<30 || this.hearRate>160){
      this.error='HeartBeat Value Should be between 30-160';
    }
  }

  private _filter(name: string): Patient[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
