import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

export default function ItemManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // Get all items
  async function fetchItems() {
    try {
      const res = await fetch(`${API_URL}/api/item`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setItems(data.itemList || []);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to fetch items",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error while fetching items",
      });
    } finally {
      setLoading(false);
    }
  }

  // Load items when the page opens
  useEffect(() => {
    const loadItems = async () => {
      await fetchItems();
    };

    loadItems();
  }, []);

  // Open dialog for creating an item
  function handleAddItem() {
    setEditingItem(null);

    setName("");
    setCategory("");
    setPrice("");
    setAmount("");

    setMessage({
      type: "",
      text: "",
    });

    setOpenDialog(true);
  }

  // Open dialog for editing an item
  function handleEditItem(item) {
    setEditingItem(item);

    setName(item.name || "");
    setCategory(item.category || "");
    setPrice(item.price ?? "");
    setAmount(item.amount ?? "");

    setMessage({
      type: "",
      text: "",
    });

    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setEditingItem(null);
  }

  // Create or update item
  async function handleSaveItem() {
    if (!name || !category || price === "" || amount === "") {
      setMessage({
        type: "error",
        text: "Please fill in all fields",
      });
      return;
    }

    try {
      let res;

      if (editingItem) {
        // UPDATE
        res = await fetch(
          `${API_URL}/api/item/${editingItem._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name,
              category,
              price: Number(price),
              amount: Number(amount),
            }),
          }
        );
      } else {
        // CREATE
        res = await fetch(`${API_URL}/api/item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            category,
            price: Number(price),
            amount: Number(amount),
          }),
        });
      }

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: editingItem
            ? "Item updated successfully!"
            : "Item created successfully!",
        });

        handleCloseDialog();
        await fetchItems();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Operation failed",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error while saving item",
      });
    }
  }

  // Delete item
  async function handleDeleteItem(item) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/item/${item._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Item deleted successfully!",
        });

        await fetchItems();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to delete item",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Network error while deleting item",
      });
    }
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Item Management
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleAddItem}
        sx={{ mb: 2 }}
      >
        Add Item
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>

              <TableCell>
                <strong>Category</strong>
              </TableCell>

              <TableCell>
                <strong>Price</strong>
              </TableCell>

              <TableCell>
                <strong>Amount</strong>
              </TableCell>

              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  Loading items...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  No items found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>

                  <TableCell>{item.category}</TableCell>

                  <TableCell>{item.price}</TableCell>

                  <TableCell>{item.amount}</TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditItem(item)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteItem(item)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingItem ? "Edit Item" : "Add Item"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Category"
            fullWidth
            margin="normal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveItem}
          >
            {editingItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}