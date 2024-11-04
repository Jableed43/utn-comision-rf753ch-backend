//Enum es buena practica
// Te permite identificar posibles valores ya definidos

export enum Genero {
  Macho = "Macho",
  Hembra = "Hembra",
}

export enum Especie {
  Mamifero = "Mamifero",
  Ave = "Ave",
  Reptil = "Reptil",
  Anfibio = "Anfibio",
  Pez = "Pez",
  Insecto = "Insecto",
}

export class Animal {
  //variables internas
  nombre: string;
  raza: string;
  genero: Genero;
  especie: Especie;
  fechaNac: Date;

  constructor(
    nombre: string,
    raza: string,
    genero: Genero,
    especie: Especie,
    fechaNac: Date
  ) {
    this.nombre = nombre;
    this.fechaNac = fechaNac;
    this.genero = genero;
    this.raza = raza;
    this.especie = especie;
  }
}
