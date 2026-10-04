import { useEffect, useState } from "react";
import api from "./api";

const empty = { product_name: "", description: "", price: "", quantity: "" };

export default function Products({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/api/products");
      setProducts(data.data);
    } catch {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, form);
      } else {
        await api.post("/api/products", form);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Save failed");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      product_name: p.product_name,
      description: p.description || "",
      price: p.price,
      quantity: p.quantity,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      load();
    } catch {
      setError("Delete failed");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(empty);
  };

  const logout = async () => {
    try {
      await api.post("/api/logout", { refresh_token: localStorage.getItem("refresh_token") });
    } catch {
      /* mag-logout pa rin kahit may error */
    }
    localStorage.clear();
    onLogout();
  };

  return (
    <div>
      <header>
        <h2>Product Management</h2>
        <div>
          <span>{user?.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
        <input name="product_name" placeholder="Product name" value={form.product_name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" step="0.01" min="0" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="quantity" type="number" min="0" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        {error && <p className="error">{error}</p>}
        <div>
          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Qty</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan="6">No products yet.</td></tr>
          )}
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.product_name}</td>
              <td>{p.description}</td>
              <td>₱{Number(p.price).toFixed(2)}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}