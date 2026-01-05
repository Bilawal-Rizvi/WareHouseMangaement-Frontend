import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Minus, Check, X } from 'lucide-react';

export const DataTable = ({ data, fields, onEdit, onDelete, onUpdateQuantity, loading }) => {
  const [editingQuantity, setEditingQuantity] = useState(null); // {id, field}
  const [tempValue, setTempValue] = useState('');

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading data...</p>
      </div>
    );
  }

  // Check if field is a quantity field
  const isQuantityField = (fieldName) => {
    const quantityKeywords = ['quantity', 'quinty', 'quntty', 'qty', 'amount', 'total', 'count', 'advance'];
    return quantityKeywords.some(keyword => 
      fieldName.toLowerCase().includes(keyword)
    );
  };

  // Handle quantity change (plus/minus)
  const handleQuantityChange = async (item, field, operation) => {
    const currentValue = parseInt(item[field.name]) || 0;
    let newValue = currentValue;

    if (operation === 'increment') {
      newValue = currentValue + 1;
    } else if (operation === 'decrement') {
      newValue = Math.max(0, currentValue - 1);
    }

    // Update via API
    const updatedItem = { ...item, [field.name]: newValue };
    if (onUpdateQuantity) {
      await onUpdateQuantity(item._id, updatedItem);
    }
  };

  // Start editing quantity
  const startEditingQuantity = (itemId, field, currentValue) => {
    setEditingQuantity({ id: itemId, field: field.name });
    setTempValue(currentValue || '0');
  };

  // Save edited quantity
  const saveQuantity = async (item, field) => {
    const updatedItem = { ...item, [field.name]: tempValue };
    if (onUpdateQuantity) {
      await onUpdateQuantity(item._id, updatedItem);
    }
    setEditingQuantity(null);
    setTempValue('');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingQuantity(null);
    setTempValue('');
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-blue-50">
          <tr>
            {fields.map(field => (
              <th key={field.name} className="px-4 py-3 text-left text-sm font-semibold text-blue-900">
                {field.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-sm font-semibold text-blue-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={fields.length + 1} className="px-4 py-8 text-center text-gray-500">
                No data available. Click "Add New" to create an entry.
              </td>
            </tr>
          ) : (
            (Array.isArray(data) ? data : []).map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                {fields.map(field => (
                  <td key={field.name} className="px-4 py-3 text-sm">
                    {/* Quantity Field with Plus/Minus */}
                    {isQuantityField(field.name) ? (
                      <div className="flex items-center gap-2">
                        {/* Check if this field is being edited */}
                        {editingQuantity?.id === item._id && editingQuantity?.field === field.name ? (
                          // Edit Mode
                          <>
                            <input
                              type="number"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="w-20 px-2 py-1 border border-blue-300 rounded text-center font-semibold focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={() => saveQuantity(item, field)}
                              className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
                              title="Save"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-400 text-white p-1 rounded hover:bg-gray-500 transition-colors"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          // Display Mode with Plus/Minus
                          <>
                            <button
                              onClick={() => handleQuantityChange(item, field, 'decrement')}
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors active:scale-95"
                              title="Decrease"
                            >
                              <Minus size={14} />
                            </button>
                            
                            <span 
                              onClick={() => startEditingQuantity(item._id, field, item[field.name])}
                              className="font-semibold text-gray-800 min-w-10 text-center cursor-pointer hover:text-blue-600 hover:underline"
                              title="Click to edit"
                            >
                              {item[field.name] ?? '0'}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item, field, 'increment')}
                              className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors active:scale-95"
                              title="Increase"
                            >
                              <Plus size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      // Regular Field
                      <span className="text-gray-700">
                        {item[field.name] ?? '-'}
                      </span>
                    )}
                  </td>
                ))}
                
                {/* Actions Column */}
                <td className="px-4 py-3 text-right space-x-2">
                  <button 
                    onClick={() => onEdit(item)} 
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 size={16} />
                    <span className="text-xs">Edit</span>
                  </button>
                  <button 
                    onClick={() => onDelete(item._id)} 
                    className="text-red-600 hover:text-red-800 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="text-xs">Delete</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};