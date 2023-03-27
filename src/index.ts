import { IngredientsList } from "./ingredients/IngredientsList.service";
import { IIngredient } from "./ingredients/models/Ingredient.model";
import { OrdersList } from "./orders/OrdersList.service";
import { IPizza } from "./pizzas/models/Pizza.model";
import { PizzaList } from "./pizzas/PizzaList.service";
import { Pizzeria } from "./pizzeria/Pizzeria.component";
import { ITable } from "./tables/models/Table.model";
import { TableList } from "./tables/Tables.service";
import { IWorker } from "./workers/models/Worker.model";
import { WorkerList } from "./workers/WorkerList.service";

const ingredients = new IngredientsList();
const pizzas = new PizzaList();
const workers = new WorkerList();
const tables = new TableList();
const orders = new OrdersList();

const pizzeria = new Pizzeria(workers, tables, pizzas, orders, ingredients);

const tomato: IIngredient = { id: "1", name: "tomato" };
const pepperoni: IIngredient = { id: "2", name: "pepperoni" };
ingredients.addIngredient(tomato, 20);
ingredients.addIngredient(pepperoni, 40);

const marg: IPizza = { id: "123", name: "Margerita", ingredients: new Map().set(tomato.id, 10) };
const pep: IPizza = { id: "111", name: "Pepperoni", ingredients: new Map().set(pepperoni.id, 20) };
pizzas.addPizza(marg, 20);
pizzas.addPizza(pep, 30);

const waiter: IWorker = { id: "11", name: "John", occupation: "waiter" };
const cook: IWorker = { id: "12", name: "Adam", occupation: "cook" };
workers.addWorker(waiter);
workers.addWorker(cook);

const table: ITable = { id: "1000", number: 5, numberOfSeats: 10 };
tables.addTable(table);

const order: number = pizzeria.makeAnOrder(new Map<string, number>().set(marg.id, 1).set(pep.id, 2), "on-site", 5);

console.log(order);
