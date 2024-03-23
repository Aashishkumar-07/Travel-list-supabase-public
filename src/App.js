import { useEffect, useState } from "react";
import { supabase } from "./createClient.js";
const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: true },
];

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from("items").select("*");
    setItems(data);
    console.log(data);
  }

  async function deleteUser(userId) {
    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", userId);

    if (error) alert("ERROR IN DELETION ⚠️⚠️⚠️");

    if (data === null) alert("DELETION SUCCESSFUL 👍");
  }

  async function updateUser(userId) {
    const delId = items.find((item) => item.id === userId);
    const { data, error } = await supabase
      .from("items")
      .update({
        packed: !delId.packed,
      })
      .eq("id", userId)
      .select();

    console.log(data);

    if (error) alert("UPDATE FAILED⚠️⚠️⚠️");

    if (data === null) alert("UPDATE SUCCESSFUL 👍");
  }

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItems(id) {
    deleteUser(id);
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItems(id) {
    updateUser(id);
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onToggleItems={handleToggleItems}
        onDeleteItems={handleDeleteItems}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴Far Away💼</h1>;
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log(newItem);

    onAddItems(newItem);
    createUser();

    setDescription("");
    setQuantity(1);
  }

  async function createUser() {
    await supabase.from("items").insert({
      description: description,
      quantity: quantity,
      packed: false,
      id: Date.now(),
    });
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip ? </h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from(Array.from({ length: 20 }, (_, i) => i + 1)).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onDeleteItems, onToggleItems }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items.toSorted((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onToggleItems={onToggleItems}
            onDeleteItems={onDeleteItems}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItems, onToggleItems }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onToggleItems(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything ! Ready to go ✈️"
          : `💼 You have ${numItems} items on your list, and you already have packed
        ${numPacked}(${percentage}%)`}
      </em>
    </footer>
  );
}
