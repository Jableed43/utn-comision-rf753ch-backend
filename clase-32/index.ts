import { Owner } from "./Owner";
import { Person } from "./Person";
//El tipo date se instancia
// date: año, mes(0), dia?
const javier = new Person("Javier", 32, new Date(1992, 8, 10));
javier.getNombre();
javier.saludar();
javier.nombre = "PEPE";
console.log(javier.nombre);
javier.saludar();

const pedro = new Owner("pedro", 45, new Date(1982, 8, 10), "firulais");
console.log(pedro);
pedro.mostrarInfo();
