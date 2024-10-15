import { Person } from "./Person";

//Creamos subclase
//Hereda todo lo mismo del padre
// podemos añadir atributos/metodos nuevos, si queremos
// Todo el contenido de la superclase se hereda aunque no este visible
export class Owner extends Person {
  public mascota: string;

  constructor(nombre: string, edad: number, fechaNac: Date, mascota: string) {
    //Dentro de super() ponemos las propiedades heredadas
    //De esta forma, se asignan los valores a las variables internas
    super(nombre, edad, fechaNac);
    this.mascota = mascota;
  }

  public mostrarInfo(): void {
    console.log(
      `El dueño es ${this.getNombre()} y su mascota es ${this.mascota}`
    );
  }
}
