//Crear la clase Person
export class Person {
  //Crear los atributos (key: type)
  //Los encapsulamos como privados
  public nombre: string;
  private edad: number;
  private fechaNac: Date;

  //   constructor
  // El constructor permite guardar los parametros en los valores internos del objeto
  constructor(nombre: string, edad: number, fechaNac: Date) {
    this.nombre = nombre;
    this.edad = edad;
    this.fechaNac = fechaNac;
  }

  //Creamos los metodos
  // ": void", es el tipo de retorno
  public saludar(): string {
    console.log(`¡Hola ${this.nombre}!`);
    return `¡Hola ${this.nombre}!`;
  }

  public getNombre(): string {
    console.log(this.nombre);
    return this.nombre;
  }

  //Podes usar un retorno doble "string | undefined"
  public setNombre(nuevoNombre: string): string {
    //validacion para quitar espacios y no recibir un string vacio
    // .trim() remueve espacios adelante y atras del string
    if (nuevoNombre.trim().length > 0) {
      return (this.nombre = nuevoNombre);
    } else {
      console.log("nombre no valido");
      return "Nombre no valido";
    }
  }
}
