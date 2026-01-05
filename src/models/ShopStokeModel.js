export const ShopStokeModel = {
  tableName: 'shop_stoke',
  fields: [
    { name: 'date', type: 'date', label: 'Date' },
    { name: 'shopNo', type: 'text', label: 'Shop No' },
    { name: 'quantity', type: 'number', label: 'Quantity' },
    { name: 'pandiName', type: 'text', label: 'Pandi Name' },
    { name: 'volumeNo', type: 'text', label: 'Volume No' }
  ]
};
