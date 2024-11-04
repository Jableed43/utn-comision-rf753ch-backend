import { Owner } from "./Owner";
import { Person } from "./Person";
import { Animal, Especie, Genero } from "./Animal";
//El tipo date se instancia
// date: año, mes(0), dia?
const javier = new Person("Javier", 32, new Date(1992, 8, 10));
javier.getNombre();
javier.saludar();
javier.nombre = "PEPE";
console.log(javier.nombre);
javier.saludar();

const firulais = new Animal(
  "firulais",
  "criollo",
  Genero.Macho,
  Especie.Mamifero,
  new Date(2017, 7, 11)
);

const pedro = new Owner("pedro", 45, new Date(1982, 8, 10), firulais);
console.log(pedro);
pedro.mostrarInfo();
