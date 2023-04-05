import { IngredientsList } from "./ingredients/IngredientsList.service";
import { OrdersList } from "./orders/OrdersList.service";
import { PizzaList } from "./pizzas/PizzaList.service";
import { Pizzeria } from "./pizzeria/Pizzeria.component";
import { TableList } from "./tables/Tables.service";
import { WorkerList } from "./workers/WorkerList.service";

const ingredients = new IngredientsList();
const pizzas = new PizzaList();
const workers = new WorkerList();
const tables = new TableList();
const orders = new OrdersList();

const pizzeria = new Pizzeria(workers, tables, pizzas, orders, ingredients);
