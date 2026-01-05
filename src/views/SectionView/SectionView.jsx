import React, { useState, useEffect } from "react";
import { Plus, Search, Download } from "lucide-react";
import { DataTable } from "../../components/DataTable/DataTable";
import { FormModal } from "../../components/FormTable/FormModal";
import { apiService } from "../../services/api";

export const SectionView = ({ title, model }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [model.tableName]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await apiService.getAll(model.tableName);
      // console.log(`[${model.tableName}] API response:`, result.data);

      // Handle array directly or wrapped in { data: [...] }
      const fetchedData = Array.isArray(result.data)
        ? result.data
        : result.data.data || [];

      setData(fetchedData);
    } catch (err) {
      console.error(`Error loading ${model.tableName}:`, err);
      setData([]);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.reload();
      }
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return loadData();
    setLoading(true);
    try {
      const results = await apiService.search(model.tableName, searchTerm);
      const fetchedData = Array.isArray(results.data)
        ? results.data
        : results.data.data || [];
      setData(fetchedData);
    } catch (err) {
      console.error("Error searching:", err);
      setData([]);
    }
    setLoading(false);
  };

  const handleCreateOrUpdate = async (newItem) => {
    setLoading(true);
    try {
      if (editData?._id) {
        await apiService.update(model.tableName, editData._id, newItem);
      } else {
        await apiService.create(model.tableName, newItem);
      }
      await loadData();
      setIsModalOpen(false);
      setEditData(null);
    } catch (err) {
      console.error("Error saving:", err);
      alert("Error saving data. Please try again.");
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setLoading(true);
    try {
      await apiService.delete(model.tableName, id);
      await loadData();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Error deleting record. Please try again.");
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (id, updatedItem) => {
    try {
      await apiService.update(model.tableName, id, updatedItem);
      setData((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updatedItem } : item))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity. Please try again.");
      await loadData();
    }
  };

  const handleExport = () => {
    const csv = [
      model.fields.map(f => f.label).join(","),
      ...data.map(row =>
        model.fields.map(f => row[f.name] ?? "").join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${model.tableName}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 text-sm mt-1">Manage your {title.toLowerCase()} records</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg font-medium"
          >
            <Download size={20} /> Export
          </button>
          <button
            onClick={() => { setEditData(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-medium"
          >
            <Plus size={20} /> Add New
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={data}
        fields={model.fields}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateQuantity={handleUpdateQuantity}
        loading={loading}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditData(null); }}
        fields={model.fields}
        onSubmit={handleCreateOrUpdate}
        editData={editData}
        loading={loading}
      />
    </div>
  );
};
