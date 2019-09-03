import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';

import { TrmProvider } from "../../providers/trm/trm";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //atributos globales
  @ViewChild('graficoCanva') graficoCanva: ElementRef;

  private graficoBarra: Chart;
  
  datos:{};
  topDolar:{};
  dolarHoy:{};

  mensaje:string;

  constructor(public navCtrl: NavController, public _trmProv:TrmProvider) {

  }
  consultaDatos(){
    let topFive;
    let ultimosRegistros;

    this._trmProv.llamado().then(resp=>{

      topFive = resp;
      //Ordeno los datos por fecha de mayor a menor
      this.datos = resp.sort((a, b)=> {
        return new Date(b.vigenciahasta) - new Date(a.vigenciahasta);
      });

      // calcular el valor actual del dolar
      this.dolarHoy = topFive[0].valor;
      //selecciono lo 5 primeros datos para el top 5
      this.topDolar = topFive.slice(0,5);
      ultimosRegistros = topFive.slice(0,2);

      

      this.grafica(topFive);

    }).catch(err=>{
      console.log(err);
    })
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.consultaDatos();
    
  }

  restarDias(fecha:Date, dias:number){
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
  }

  grafica(datosGrafica:any){
    let data:[] = [];
    let labels:[] = [];
    let fActual:Date = new Date();
    let minTime = this.restarDias(fActual, 15);

    
    
    datosGrafica.forEach((elem:any) =>{
      data.push(elem.valor)
      labels.push(elem.vigenciahasta)
    })

    this.graficoCanva = new Chart(this.graficoCanva.nativeElement, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Comportamiento historico",
            data: data,
            fill:false,
            backgroundColor: "#eebcde ",
            borderColor: "#eebcde",
            borderCapStyle: 'butt',
            borderDash: [2, 2],          
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive:true,
        hover:{
          mode:'label'
        },
        scales: {
          xAxes:[{
            type:'time',
            time:{
              unit:'day',
              min:minTime,           
              
            },
            scaleLabel:{
              display:true,
              labelString: 'Fecha'
            }
            
          }],
          yAxes:[{
            display:true,
            ticks:{
              max:3800,
              min:3000
            },
            scaleLabel:{
              display:true,
              labelString:'TRM'
            }
          }]
        },
        legend: {
            display: false
         },
      }
    });
  
  }
  
  

}
