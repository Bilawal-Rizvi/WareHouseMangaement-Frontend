import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";

export const FormModal = ({ isOpen, onClose, fields, onSubmit, editData, loading }) => {
  const [formData, setFormData] = useState({});

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (editData && editData._id) {
        setFormData(editData); // Edit mode
      } else {
        const initialData = {};
        fields.forEach(field => initialData[field.name] = "");
        setFormData(initialData); // Add new mode
      }
    }
  }, [isOpen, editData, fields]);

  if (!isOpen) return null;

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Quantity increment/decrement handlers
  const handleQuantityChange = (fieldName, operation) => {
    const currentValue = parseInt(formData[fieldName]) || 0;
    let newValue = currentValue;

    if (operation === 'increment') {
      newValue = currentValue + 1;
    } else if (operation === 'decrement') {
      newValue = Math.max(0, currentValue - 1); // Don't go below 0
    }

    setFormData(prev => ({ ...prev, [fieldName]: newValue.toString() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Remove _id from new item
    const dataToSubmit = { ...formData };
    if (!editData?._id) delete dataToSubmit._id;

    onSubmit(dataToSubmit);
  };

  // Check if field is a quantity field
  const isQuantityField = (fieldName) => {
    const quantityKeywords = ['quantity', 'quinty', 'quntty', 'qty', 'amount', 'total', 'count'];
    return quantityKeywords.some(keyword => 
      fieldName.toLowerCase().includes(keyword)
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {editData?._id ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div 
                key={field.name} 
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>

                {/* Textarea */}
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                ) : /* Number field with plus/minus buttons */
                field.type === "number" || isQuantityField(field.name) ? (
                  <div className="flex items-center gap-2">
                    {/* Minus Button */}
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(field.name, 'decrement')}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-md active:scale-95"
                    >
                      <Minus size={20} />
                    </button>

                    {/* Input Field */}
                    <input
                      type="number"
                      name={field.name}
                      value={formData[field.name] || "0"}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-semibold text-lg"
                      min="0"
                    />

                    {/* Plus Button */}
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(field.name, 'increment')}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors shadow-md active:scale-95"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ) : /* Regular input fields */
                (
                  <input
                    type={field.type}
                    name={field.name}
                    value={
                      field.type === "date" && formData[field.name]
                        ? new Date(formData[field.name]).toISOString().split("T")[0]
                        : formData[field.name] || ""
                    }
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Saving..." : editData?._id ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

